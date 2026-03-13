import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    Container, Row, Col, Card, Form, Button, Table, Badge,
    InputGroup, FloatingLabel, OverlayTrigger, Tooltip,
    Modal, Toast, ToastContainer, Spinner
} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrashAlt, FaCut, FaClock, FaMoneyBillWave, FaSave, FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:5000/services';

const Service = () => {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({ name: '', price: '', duration: '', description: '' });
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const premiumSwal = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-dark btn-lg px-5 fw-bold rounded-3 shadow-sm text-warning border-warning ms-3',
            cancelButton: 'btn btn-outline-danger btn-lg px-4 fw-bold rounded-3'
        },
        buttonsStyling: false
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const showNotification = (message, variant = 'success') => {
        setToast({ show: true, message, variant });
    };

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            setTimeout(async () => {
                const response = await axios.get(API_URL);
                const data = response.data.map(item => ({
                    ...item,
                    price: Number(item.price) || 0,
                    duration: Number(item.duration) || 0,
                }));
                setServices(data);
                setIsLoading(false);
            }, 500);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            setIsLoading(false);
            premiumSwal.fire({
                icon: 'error',
                title: 'Connection Error',
                text: 'Lỗi kết nối đến máy chủ! Vui lòng kiểm tra API.',
                confirmButtonColor: '#ffc107',
            });
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const priceNum = Number(formData.price);
        const durationNum = Number(formData.duration);

        if (priceNum <= 0 || durationNum <= 0) {
            premiumSwal.fire({
                icon: 'warning',
                title: 'Dữ liệu không hợp lệ',
                text: 'Giá và Thời gian phải lớn hơn 0!',
                confirmButtonColor: '#ffc107',
            });
            return;
        }

        const payload = { ...formData, price: priceNum, duration: durationNum };

        try {
            if (editId) {
                await axios.put(`${API_URL}/${editId}`, payload);
                showNotification('Cập nhật thành công!');
            } else {
                const validIds = services.map(srv => Number(srv.id)).filter(id => !isNaN(id));
                const nextId = validIds.length > 0 ? (Math.max(...validIds) + 1).toString() : "1";
                await axios.post(API_URL, { ...payload, id: nextId });
                showNotification('Đã thêm dịch vụ mới!');
            }
            setFormData({ name: '', price: '', duration: '', description: '' });
            setEditId(null);
            fetchServices();
        } catch (error) {
            showNotification('Lỗi lưu dữ liệu!', 'danger');
        }
    };

    const handleEdit = (srv) => {
        setEditId(srv.id);
        setFormData({ name: srv.name, price: srv.price, duration: srv.duration, description: srv.description });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const confirmDelete = (srv) => {
        premiumSwal.fire({
            title: 'Xác nhận xóa?',
            text: `Bạn có chắc muốn xóa dịch vụ "${srv.name}"? Hành động này không thể hoàn tác.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý Xóa',
            cancelButtonText: 'Hủy bỏ',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_URL}/${srv.id}`);
                    fetchServices();
                    showNotification('Đã xóa thành công!');
                } catch (error) {
                    showNotification('Lỗi khi xóa!', 'danger');
                }
            }
        });
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (columnName) => {
        if (sortConfig.key !== columnName) {
            return <FaSort className="ms-1 text-muted opacity-50" size={14} />;
        }
        return sortConfig.direction === 'ascending' ? <FaSortUp className="ms-1 text-warning" /> : <FaSortDown className="ms-1 text-warning" />;
    };

    const sortedAndFilteredServices = useMemo(() => {
        let filterableItems = services.filter(srv =>
            srv.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (sortConfig.key !== null) {
            filterableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        } else {
            filterableItems.sort((a, b) => b.id - a.id);
        }
        return filterableItems;
    }, [services, searchTerm, sortConfig]);

    return (
        <Container className="py-5" style={{ maxWidth: '1300px' }}>

            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999, position: 'fixed' }}>
                <Toast onClose={() => setToast({ ...toast, show: false })} show={toast.show} delay={3000} autohide bg={toast.variant} className="text-white shadow-lg border border-dark rounded-3">
                    <Toast.Header className="bg-dark text-warning border-dark fw-bold">
                        <strong className="me-auto fs-6">{toast.variant === 'success' ? '🚀 Thành công' : '⚠️ Cảnh báo'}</strong>
                    </Toast.Header>
                    <Toast.Body className="fs-6">{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>

            <div className="text-center mb-5">
                <h1 className="display-4 fw-bolder text-uppercase d-flex justify-content-center align-items-center text-white"
                    style={{ letterSpacing: '5px', textShadow: '0 0 20px rgba(255,193,7,0.5)' }}>
                    <FaCut className="me-3 text-warning" style={{ filter: 'drop-shadow(0 0 8px rgba(255,193,7,0.8))' }} />
                    BARBERSHOP <span className="ms-3 text-warning">SYSTEM</span>
                </h1>
                <div className="bg-warning mx-auto rounded-pill" style={{ width: '120px', height: '4px', opacity: '0.8' }}></div>
                <p className="text-white-50 mt-3 fs-5 text-uppercase fw-light" style={{ letterSpacing: '3px' }}>
                    Hệ thống quản lý dịch vụ cắt tóc chuyên nghiệp
                </p>
            </div>

            <Row className="g-4">
                {/* 1. FORM CARD */}
                <Col lg={4}>
                    <Card className="led-border shadow-lg border-0 rounded-4 sticky-top overflow-hidden" style={{ top: '20px' }}>
                        <Card.Header className={`py-3 ${editId ? "bg-warning text-dark" : "bg-dark text-warning"} border-0`}>
                            <h5 className="mb-0 fw-bold d-flex align-items-center text-uppercase" style={{ letterSpacing: '1px' }}>
                                {editId ? <><FaEdit className="me-2" /> Sửa Dịch Vụ</> : <><FaPlus className="me-2" /> Thêm Mới</>}
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-4 bg-white">
                            <Form onSubmit={handleSubmit}>
                                <FloatingLabel controlId="floatingName" label="Tên dịch vụ" className="mb-3 text-muted">
                                    <Form.Control type="text" name="name" placeholder="..." value={formData.name} onChange={handleInputChange} required className="fw-bold text-dark border-2 focus-ring-warning border-dark" />
                                </FloatingLabel>
                                <Row className="g-2 mb-3">
                                    <Col xs={6}>
                                        <FloatingLabel controlId="floatingPrice" label="Giá (VNĐ)" className="text-muted">
                                            <Form.Control type="number" name="price" placeholder="..." value={formData.price} onChange={handleInputChange} required className="fw-bold text-dark border-2 border-dark" />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={6}>
                                        <FloatingLabel controlId="floatingDuration" label="Thời gian" className="text-muted">
                                            <Form.Control type="number" name="duration" placeholder="..." value={formData.duration} onChange={handleInputChange} required className="fw-bold text-dark border-2 border-dark" />
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                                <FloatingLabel controlId="floatingDesc" label="Mô tả chi tiết..." className="mb-4 text-muted">
                                    <Form.Control as="textarea" style={{ height: '100px' }} name="description" placeholder="..." value={formData.description} onChange={handleInputChange} required className="border-2 border-dark" />
                                </FloatingLabel>
                                <div className="d-grid gap-2">
                                    <Button variant="warning" type="submit" size="lg" className="fw-bold rounded-3 shadow py-2 text-dark border border-dark text-uppercase shadow-sm">
                                        {editId ? <><FaSave className="me-2 mb-1" /> Lưu Cập Nhật</> : <><FaPlus className="me-2 mb-1" /> Thêm Dịch Vụ</>}
                                    </Button>
                                    {editId && (
                                        <Button variant="outline-danger" className="fw-bold rounded-3 border-2" onClick={() => { setEditId(null); setFormData({ name: '', price: '', duration: '', description: '' }) }}>
                                            Hủy thao tác
                                        </Button>
                                    )}
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* 2. LIST CARD */}
                <Col lg={8}>
                    <Card className="led-border shadow-lg border-0 rounded-4 overflow-hidden h-100">
                        {/* Đã sửa Header này giống Header Form */}
                        <Card.Header className="bg-dark text-warning py-3 border-0 d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <h5 className="mb-0 fw-bold text-uppercase d-flex align-items-center" style={{ letterSpacing: '1px' }}>
                                <FaCut className="me-2 text-warning" /> Danh Sách Dịch Vụ
                            </h5>
                            <InputGroup style={{ maxWidth: '300px' }} className="shadow-sm">
                                <InputGroup.Text className="bg-warning text-dark border-dark"><FaSearch /></InputGroup.Text>
                                <Form.Control type="text" placeholder="Tìm kiếm nhanh..." className="border-dark focus-ring-dark" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </InputGroup>
                        </Card.Header>

                        <Card.Body className="p-0 position-relative bg-white">
                            {isLoading ? (
                                <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '300px' }}>
                                    <Spinner animation="grow" variant="warning" style={{ width: '3rem', height: '3rem' }} />
                                    <p className="mt-3 text-muted fw-bold">Đang tải dữ liệu...</p>
                                </div>
                            ) : (
                                <Table responsive hover className="mb-0 align-middle border-top-0">
                                    <thead className="bg-light text-dark">
                                        <tr className="border-bottom border-warning border-2">
                                            <th className="text-center py-3">#</th>
                                            <th>Dịch Vụ</th>
                                            <th onClick={() => requestSort('price')} style={{ cursor: 'pointer' }}>Giá {getSortIcon('price')}</th>
                                            <th onClick={() => requestSort('duration')} style={{ cursor: 'pointer' }}>Thời gian {getSortIcon('duration')}</th>
                                            <th className="text-center">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedAndFilteredServices.map((srv, index) => (
                                            <tr key={srv.id}>
                                                <td className="text-center fw-bold text-muted">{index + 1}</td>
                                                <td>
                                                    <div className="fw-bolder">{srv.name}</div>
                                                    <OverlayTrigger placement="bottom" overlay={<Tooltip className="tooltip-pro">{srv.description}</Tooltip>}>
                                                        <div className="text-muted small text-truncate" style={{ maxWidth: '200px', cursor: 'help' }}>{srv.description}</div>
                                                    </OverlayTrigger>
                                                </td>
                                                <td><Badge bg="dark" className="px-3 py-2 border border-warning text-warning rounded-pill">{srv.price.toLocaleString()} ₫</Badge></td>
                                                <td><Badge bg="light" text="dark" className="px-3 py-2 border shadow-sm rounded-pill">{srv.duration} Phút</Badge></td>
                                                <td className="text-center">
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <Button variant="warning" size="sm" className="rounded-circle border border-dark edit-btn-pro" onClick={() => handleEdit(srv)}><FaEdit size={14}/></Button>
                                                        <Button variant="dark" size="sm" className="rounded-circle border border-warning delete-btn-pro" onClick={() => confirmDelete(srv)}><FaTrashAlt className="text-warning" size={14}/></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <style>{`
                /* Hiệu ứng LED Border chạy sáng */
                @keyframes led-glow {
                    0% { box-shadow: 0 0 5px #ffc107, 0 0 10px #ffc107, inset 0 0 5px rgba(255,193,7,0.2); }
                    50% { box-shadow: 0 0 15px #ffc107, 0 0 25px #ffc107, inset 0 0 10px rgba(255,193,7,0.4); }
                    100% { box-shadow: 0 0 5px #ffc107, 0 0 10px #ffc107, inset 0 0 5px rgba(255,193,7,0.2); }
                }

                .led-border {
                    border: 2px solid #ffc107 !important;
                    animation: led-glow 3s infinite alternate ease-in-out;
                    transition: transform 0.3s;
                }

                .led-border:hover {
                    transform: translateY(-5px);
                }

                /* Tooltip Pro Style */
                .tooltip-pro .tooltip-inner {
                    background-color: #1a1a1a !important;
                    color: #ffc107 !important;
                    border: 1px solid #ffc107 !important;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                    padding: 10px;
                    font-size: 14px;
                }

                /* Button Hovers */
                .edit-btn-pro:hover { transform: scale(1.2) rotate(-10deg); }
                .delete-btn-pro:hover { transform: scale(1.2) rotate(10deg); }

                .focus-ring-warning:focus {
                    border-color: #ffc107 !important;
                    box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.25) !important;
                }
            `}</style>
        </Container>
    );
};

export default Service;