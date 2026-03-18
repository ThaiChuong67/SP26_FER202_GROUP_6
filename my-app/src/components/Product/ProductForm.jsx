import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Modal, Image } from 'react-bootstrap';
import { FaPlus, FaSave, FaEdit } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/products';

const ProductForm = ({ show, handleClose, productData, refreshData, showNotification, productsList }) => {
    const isEditMode = !!productData;
    const [formData, setFormData] = useState({ name: '', price: '', quantity: '', image: '', description: '' });

    // Điền dữ liệu nếu đang ở chế độ Sửa, xóa trắng nếu ở chế độ Thêm
    useEffect(() => {
        if (show) {
            if (productData) {
                setFormData(productData);
            } else {
                setFormData({ name: '', price: '', quantity: '', image: '', description: '' });
            }
        }
    }, [show, productData]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData({ ...formData, image: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                quantity: Number(formData.quantity)
            };

            if (isEditMode) {
                // GỌI API SỬA
                await axios.put(`${API_URL}/${productData.id}`, payload);
                showNotification('Cập nhật sản phẩm thành công!');
            } else {
                // GỌI API THÊM
                const validIds = productsList.map(p => Number(p.id)).filter(id => !isNaN(id));
                const nextId = validIds.length > 0 ? (Math.max(...validIds) + 1).toString() : "1";
                payload.id = nextId;
                await axios.post(API_URL, payload);
                showNotification('Đã thêm sản phẩm mới!');
            }
            
            refreshData();
            handleClose();
        } catch (error) {
            showNotification(isEditMode ? 'Lỗi cập nhật!' : 'Lỗi khi thêm dữ liệu!', 'danger');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} contentClassName="bg-dark border border-warning rounded-4 shadow-lg">
            <Modal.Header closeButton closeVariant="white" className="bg-transparent border-bottom border-secondary">
                <Modal.Title className="fw-bold text-uppercase text-warning">
                    {isEditMode ? <><FaEdit className="me-2 mb-1" /> Sửa Sản Phẩm</> : <><FaPlus className="me-2 mb-1" /> Thêm Sản Phẩm</>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                    {isEditMode && (
                        <Form.Group className="mb-3">
                            <Form.Label className="label-vip">ID (Chỉ xem)</Form.Label>
                            <Form.Control type="text" value={formData.id || ''} disabled className="dark-input text-muted" />
                        </Form.Group>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label className="label-vip text-uppercase">Tên Sản Phẩm</Form.Label>
                        <Form.Control required type="text" placeholder="Nhập tên..." value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="dark-input" />
                    </Form.Group>
                    <div className="d-flex gap-3 mb-3">
                        <Form.Group className="w-50">
                            <Form.Label className="label-vip text-uppercase">Giá (VNĐ)</Form.Label>
                            <Form.Control required type="number" min="1" placeholder="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="dark-input" />
                        </Form.Group>
                        <Form.Group className="w-50">
                            <Form.Label className="label-vip text-uppercase">Số lượng kho</Form.Label>
                            <Form.Control required type="number" min="0" placeholder="0" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} className="dark-input" />
                        </Form.Group>
                    </div>
                    <Form.Group className="mb-4">
                        <Form.Label className="label-vip text-uppercase">{isEditMode ? 'Đổi Ảnh' : 'Tải Ảnh Lên'}</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={handleImageUpload} className="dark-input" />
                        {formData.image && (
                            <div className="mt-3 text-center">
                                <Image src={formData.image} rounded className="border border-warning shadow-sm" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                            </div>
                        )}
                    </Form.Group>
                    <Button variant="warning" type="submit" className="w-100 fw-bold rounded-pill text-dark text-uppercase shadow-sm">
                        <FaSave className="me-2 mb-1" /> {isEditMode ? 'Lưu Thay Đổi' : 'Lưu Sản Phẩm'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ProductForm;