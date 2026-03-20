import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Table, Badge, InputGroup, OverlayTrigger, Tooltip, Modal, Toast, ToastContainer, Spinner, Pagination } from 'react-bootstrap';
import { FaCut, FaPlus, FaEdit, FaTrashAlt, FaSave, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:5000/services';

const Service = () => {
    // --- STATE QUẢN LÝ DỮ LIỆU ---
    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // --- STATE PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(1);
    const servicesPerPage = 6;

    // --- STATE MODAL THÊM MỚI ---
    const [showAddModal, setShowAddModal] = useState(false);
    const [newService, setNewService] = useState({ name: '', price: '', duration: '', description: '' });

    // --- STATE MODAL SỬA ---
    const [showEditModal, setShowEditModal] = useState(false);
    const [editService, setEditService] = useState({ id: '', name: '', price: '', duration: '', description: '' });
    const [originalId, setOriginalId] = useState('');

    // --- STATE THÔNG BÁO ---
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

    const premiumSwal = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-warning btn-lg px-5 fw-bold rounded-3 shadow-sm text-dark ms-3',
            cancelButton: 'btn btn-outline-light btn-lg px-4 fw-bold rounded-3'
        },
        buttonsStyling: false
    });

    const showNotification = (message, variant = 'success') => setToast({ show: true, message, variant });

    useEffect(() => { fetchServices(); }, []);

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(API_URL);
            setServices(res.data);
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setTimeout(() => setIsLoading(false), 500);
        }
    };

    // --- XỬ LÝ THÊM MỚI ---
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const validIds = services.map(s => Number(s.id)).filter(id => !isNaN(id));
            const nextId = validIds.length > 0 ? (Math.max(...validIds) + 1).toString() : "1";

            const serviceToSave = {
                id: nextId,
                name: newService.name,
                price: Number(newService.price),
                duration: Number(newService.duration),
                description: newService.description || ""
            };

            await axios.post(API_URL, serviceToSave);
            setShowAddModal(false); 
            setNewService({ name: '', price: '', duration: '', description: '' }); 
            await fetchServices(); 
            showNotification('Đã thêm dịch vụ thành công!');
        } catch (error) {
            showNotification('Lỗi khi thêm dữ liệu!', 'danger');
        }
    };

    // --- XỬ LÝ SỬA ---
    const handleShowEdit = (service) => {
        setOriginalId(service.id); 
        setEditService(service); 
        setShowEditModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/${originalId}`, {
                ...editService, price: Number(editService.price), duration: Number(editService.duration)
            });
            setShowEditModal(false); 
            fetchServices();
            showNotification('Cập nhật thành công!');
        } catch (error) { 
            showNotification('Lỗi cập nhật!', 'danger'); 
        }
    };

    // --- XỬ LÝ XÓA ---
    const handleDelete = async (id) => {
        const serviceToDelete = services.find(s => s.id === id);
        const serviceName = serviceToDelete ? serviceToDelete.name : 'dịch vụ này';

        premiumSwal.fire({
            title: 'Xác nhận xóa?',
            text: `Bạn có chắc muốn xóa dịch vụ "${serviceName}"? Hành động này không thể hoàn tác.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý Xóa',
            cancelButtonText: 'Hủy bỏ',
            background: '#1a1a1a',
            color: '#fff'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_URL}/${id}`);
                    await fetchServices();
                    if (currentItems.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
                    showNotification('Đã xóa thành công!');
                } catch (error) {
                    showNotification('Lỗi khi xóa!', 'danger');
                }
            }
        });
    };

    // --- LỌC, SẮP XẾP ---
    const filtered = services
        .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => Number(a.id) - Number(b.id)); 

    const indexOfLast = currentPage * servicesPerPage;
    const indexOfFirst = indexOfLast - servicesPerPage;
    const currentItems = filtered.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filtered.length / servicesPerPage);

    return (
        <Container className="py-4 px-lg-5 dashboard-supreme-wrapper" style={{ maxWidth: '1400px' }}>
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999, position: 'fixed' }}>
                <Toast onClose={() => setToast({ ...toast, show: false })} show={toast.show} delay={3000} autohide bg={toast.variant} className="text-white shadow-lg border border-warning rounded-3 bg-dark">
                    <Toast.Header className="bg-dark text-warning border-warning fw-bold">
                        <strong className="me-auto fs-6">{toast.variant === 'success' ? '🚀 Thành công' : '⚠️ Cảnh báo'}</strong>
                    </Toast.Header>
                    <Toast.Body className="fs-6 text-white">{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>

            <div className="mb-5">
                <div className="d-flex align-items-center">
                    <div className="master-hexagon-icon me-4"><FaCut /></div>
                    <div>
                        <h1 className="text-white fw-900 display-4 mb-0 tracking-tight">QUẢN LÝ <span className="gold-gradient-text">DỊCH VỤ</span></h1>
                        <div className="d-flex align-items-center mt-2">
                            <Badge bg="warning" text="dark" className="me-2 px-3">BARBER</Badge>
                            <span className="text-white-50 small tracking-widest uppercase">Thiết lập dịch vụ thượng hạng</span>
                        </div>
                    </div>
                </div>
            </div>

            <Row className="g-4">
                <Col xs={12}>
                    <Card className="luxury-card h-100">
                        <Card.Body className="p-4 position-relative z-10">
                            {/* THANH CÔNG CỤ TỐI ƯU */}
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                                <h5 className="mb-0 fw-bold text-uppercase d-flex align-items-center text-white">
                                    <FaCut className="me-2 text-warning" /> Danh Sách
                                </h5>

                                <div className="d-flex gap-2 align-items-center flex-wrap">
                                    <InputGroup style={{ maxWidth: '250px' }}>
                                        <InputGroup.Text className="bg-transparent text-warning border-warning rounded-start-pill"><FaSearch /></InputGroup.Text>
                                        <Form.Control type="text" placeholder="Tìm tên dịch vụ..." className="dark-input border-warning rounded-end-pill" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                                    </InputGroup>

                                    <Button variant="warning" className="rounded-pill fw-bold text-dark px-4 ms-2 shadow-sm" onClick={() => setShowAddModal(true)}>
                                        <FaPlus className="me-2 mb-1" /> Thêm Mới
                                    </Button>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '400px' }}>
                                    <Spinner animation="border" variant="warning" style={{ width: '4rem', height: '4rem' }} />
                                    <h6 className="text-warning mt-4 tracking-widest text-uppercase" style={{ letterSpacing: '3px' }}>
                                        ĐANG TẢI DỊCH VỤ...
                                    </h6>
                                </div>
                            ) : (
                                <>
                                    <Table responsive hover className="luxury-table align-middle text-center">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th className="text-start">Dịch Vụ</th>
                                                <th>Giá</th>
                                                <th>Thời Gian</th>
                                                <th>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.length > 0 ? (
                                                currentItems.map((s, index) => (
                                                    <tr key={s.id}>
                                                        <td className="fw-bold text-white-50">{indexOfFirst + index + 1}</td>
                                                        <td className="text-start">
                                                            <div className="fw-bold text-white">{s.name}</div>
                                                            <OverlayTrigger placement="bottom" overlay={<Tooltip className="bg-dark border border-warning text-warning p-2">{s.description}</Tooltip>}>
                                                                <div className="text-white-50 small text-truncate" style={{ maxWidth: '250px', cursor: 'help' }}>{s.description}</div>
                                                            </OverlayTrigger>
                                                        </td>
                                                        <td><Badge bg="transparent" className="px-3 py-2 border border-warning text-warning rounded-pill">{Number(s.price).toLocaleString('vi-VN')} ₫</Badge></td>
                                                        <td><Badge bg="transparent" className="px-3 py-2 border border-light text-light rounded-pill">{s.duration} Phút</Badge></td>
                                                        <td>
                                                            <div className="d-flex justify-content-center gap-2">
                                                                <Button variant="outline-warning" size="sm" className="rounded-circle btn-icon-pro" onClick={() => handleShowEdit(s)}><FaEdit size={12} /></Button>
                                                                <Button variant="outline-danger" size="sm" className="rounded-circle btn-icon-pro" onClick={() => handleDelete(s.id)}><FaTrashAlt size={12} /></Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan="5" className="text-center py-5 text-white-50 fw-bold">Không tìm thấy dịch vụ</td></tr>
                                            )}
                                        </tbody>
                                    </Table>

                                    {totalPages > 0 && (
                                        <div className="pt-4 d-flex justify-content-center">
                                            <Pagination className="pagination-luxury mb-0">
                                                {[...Array(totalPages)].map((_, i) => (
                                                    <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>{i + 1}</Pagination.Item>
                                                ))}
                                            </Pagination>
                                        </div>
                                    )}
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* --- MODAL THÊM MỚI --- */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} contentClassName="bg-dark border border-warning rounded-4 shadow-lg">
                <Modal.Header closeButton closeVariant="white" className="bg-transparent border-bottom border-secondary">
                    <Modal.Title className="fw-bold text-uppercase text-warning"><FaPlus className="me-2 mb-1" /> Thêm Dịch Vụ Mới</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form onSubmit={handleAddSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="label-vip text-uppercase">Tên Dịch Vụ</Form.Label>
                            <Form.Control required type="text" placeholder="Ví dụ: Cắt tóc nam VIP..." value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} className="dark-input" />
                        </Form.Group>
                        <div className="d-flex gap-3 mb-3">
                            <Form.Group className="w-50">
                                <Form.Label className="label-vip text-uppercase">Giá (VNĐ)</Form.Label>
                                <Form.Control required type="number" min="0" placeholder="0" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} className="dark-input" />
                            </Form.Group>
                            <Form.Group className="w-50">
                                <Form.Label className="label-vip text-uppercase">Thời gian (Phút)</Form.Label>
                                <Form.Control required type="number" min="1" placeholder="45" value={newService.duration} onChange={(e) => setNewService({ ...newService, duration: e.target.value })} className="dark-input" />
                            </Form.Group>
                        </div>
                        <Form.Group className="mb-4">
                            <Form.Label className="label-vip text-uppercase">Mô Tả Chi Tiết</Form.Label>
                            <Form.Control as="textarea" placeholder="Nhập mô tả..." style={{ height: '100px' }} value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} className="dark-input" />
                        </Form.Group>
                        <Button variant="warning" type="submit" className="w-100 fw-bold rounded-pill text-dark text-uppercase shadow-sm">
                            <FaSave className="me-2 mb-1" /> Lưu Dịch Vụ
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* --- MODAL SỬA --- */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} contentClassName="bg-dark border border-warning rounded-4 shadow-lg">
                <Modal.Header closeButton closeVariant="white" className="bg-transparent border-bottom border-secondary">
                    <Modal.Title className="fw-bold text-uppercase text-warning">Sửa Dịch Vụ</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form onSubmit={handleUpdate}>
                        <Form.Group className="mb-3">
                            <Form.Label className="label-vip">ID (Chỉ xem)</Form.Label>
                            <Form.Control required type="text" value={editService.id} disabled className="dark-input text-muted" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="label-vip text-uppercase">Tên Dịch Vụ</Form.Label>
                            <Form.Control required type="text" value={editService.name} onChange={(e) => setEditService({ ...editService, name: e.target.value })} className="dark-input" />
                        </Form.Group>
                        <div className="d-flex gap-3 mb-3">
                            <Form.Group className="w-50"><Form.Label className="label-vip text-uppercase">Giá</Form.Label><Form.Control type="number" value={editService.price} onChange={(e) => setEditService({ ...editService, price: e.target.value })} className="dark-input" /></Form.Group>
                            <Form.Group className="w-50"><Form.Label className="label-vip text-uppercase">Thời gian (Phút)</Form.Label><Form.Control type="number" value={editService.duration} onChange={(e) => setEditService({ ...editService, duration: e.target.value })} className="dark-input" /></Form.Group>
                        </div>
                        <Form.Group className="mb-4">
                            <Form.Label className="label-vip text-uppercase">Mô Tả</Form.Label>
                            <Form.Control as="textarea" style={{ height: '100px' }} value={editService.description} onChange={(e) => setEditService({ ...editService, description: e.target.value })} className="dark-input" />
                        </Form.Group>
                        <Button variant="warning" type="submit" className="w-100 fw-bold rounded-pill text-dark text-uppercase shadow-sm">Lưu Thay Đổi</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* --- CSS DÙNG CHUNG --- */}
            <style>{`
                .luxury-card {
                    background: rgba(15, 15, 15, 0.6) !important;
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05) !important;
                    border-radius: 25px !important;
                    transition: all 0.4s ease;
                }
                .luxury-card:hover { border-color: rgba(255, 193, 7, 0.3) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.6) !important; }
                
                .dark-input { 
                    background: rgba(0,0,0,0.5) !important; border: 1px solid rgba(255,255,255,0.1) !important; color: white !important; 
                }
                .dark-input:focus { border-color: #ffc107 !important; box-shadow: 0 0 10px rgba(255,193,7,0.2) !important; }
                .dark-input::placeholder { color: rgba(255,255,255,0.3) !important; }
                
                .luxury-table { background: transparent !important; color: white; }
                .luxury-table th { background: rgba(255,193,7,0.05) !important; color: #ffc107 !important; border-bottom: 2px solid rgba(255,193,7,0.3) !important; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;}
                .luxury-table td { background: transparent !important; color: #fff !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; }
                
                .btn-icon-pro { width: 35px; height: 35px; display: inline-flex; align-items: center; justify-content: center; transition: 0.3s; }
                .btn-icon-pro:hover { transform: scale(1.15); }
                
                .pagination-luxury .page-link { background: rgba(0,0,0,0.5); border-color: rgba(255,255,255,0.1); color: #fff; }
                .pagination-luxury .page-item.active .page-link { background: #ffc107; border-color: #ffc107; color: #000; font-weight: bold; }
                
                .swal2-popup { border: 1px solid rgba(255,193,7,0.3) !important; border-radius: 20px !important; }
                .label-vip { color: rgba(255,255,255,0.5); font-size: 0.75rem; font-weight: 700; letter-spacing: 2px; }
            `}</style>
        </Container>
    );
};

export default Service;