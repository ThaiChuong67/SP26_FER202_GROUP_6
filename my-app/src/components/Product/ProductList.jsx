import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Form, Button, Table, InputGroup, Toast, ToastContainer, Spinner, Pagination } from 'react-bootstrap';
import { FaShoppingBag, FaSearch, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import ProductItem from './ProductItem';
import ProductForm from './ProductForm';

const API_URL = 'http://localhost:5000/products';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    // Quản lý Modal Form (Thêm/Sửa)
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

    const premiumSwal = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-warning btn-lg px-5 fw-bold rounded-3 shadow-sm text-dark ms-3',
            cancelButton: 'btn btn-outline-light btn-lg px-4 fw-bold rounded-3'
        },
        buttonsStyling: false
    });

    const showNotification = (message, variant = 'success') => setToast({ show: true, message, variant });

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(API_URL);
            setProducts(res.data);
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setTimeout(() => setIsLoading(false), 500);
        }
    };

    const handleOpenAdd = () => {
        setSelectedProduct(null);
        setShowFormModal(true);
    };

    const handleOpenEdit = (product) => {
        setSelectedProduct(product);
        setShowFormModal(true);
    };

    const handleDelete = async (id) => {
        const productToDelete = products.find(p => p.id === id);
        const productName = productToDelete ? productToDelete.name : 'sản phẩm này';

        premiumSwal.fire({
            title: 'Xác nhận xóa?',
            text: `Bạn có chắc muốn xóa sản phẩm "${productName}"? Hành động này không thể hoàn tác.`,
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
                    await fetchProducts();
                    if (currentItems.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
                    showNotification('Đã xóa thành công!');
                } catch (error) {
                    showNotification('Lỗi khi xóa!', 'danger');
                }
            }
        });
    };

    // Lọc và sắp xếp (Sản phẩm thêm mới nằm ở dưới cùng)
    const filtered = products.filter(p => {
        const matchName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const min = minPrice ? parseInt(minPrice) : 0;
        const max = maxPrice ? parseInt(maxPrice) : Infinity;
        return matchName && p.price >= min && p.price <= max;
    }).sort((a, b) => Number(a.id) - Number(b.id)); 

    const indexOfLast = currentPage * productsPerPage;
    const indexOfFirst = indexOfLast - productsPerPage;
    const currentItems = filtered.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filtered.length / productsPerPage);

    return (
        <>
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999, position: 'fixed' }}>
                <Toast onClose={() => setToast({ ...toast, show: false })} show={toast.show} delay={3000} autohide bg={toast.variant} className="text-white shadow-lg border border-warning rounded-3 bg-dark">
                    <Toast.Header className="bg-dark text-warning border-warning fw-bold">
                        <strong className="me-auto fs-6">{toast.variant === 'success' ? '🚀 Thành công' : '⚠️ Cảnh báo'}</strong>
                    </Toast.Header>
                    <Toast.Body className="fs-6 text-white">{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>

            <Card className="luxury-card h-100">
                <Card.Body className="p-4 position-relative z-10">
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <h5 className="mb-0 fw-bold text-uppercase d-flex align-items-center text-white">
                            <FaShoppingBag className="me-2 text-warning" /> Danh Sách
                        </h5>

                        <div className="d-flex gap-2 align-items-center flex-wrap">
                            <InputGroup style={{ maxWidth: '220px' }}>
                                <InputGroup.Text className="bg-transparent text-warning border-warning rounded-start-pill"><FaSearch /></InputGroup.Text>
                                <Form.Control type="text" placeholder="Tìm tên SP..." className="dark-input border-warning rounded-end-pill" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                            </InputGroup>
                            
                            <Form.Control type="number" placeholder="Từ giá..." className="dark-input rounded-pill px-3" style={{ maxWidth: '120px' }} value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }} />
                            <Form.Control type="number" placeholder="Đến giá..." className="dark-input rounded-pill px-3" style={{ maxWidth: '120px' }} value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }} />

                            <Button variant="warning" className="rounded-pill fw-bold text-dark px-4 ms-2 shadow-sm" onClick={handleOpenAdd}>
                                <FaPlus className="me-2 mb-1" /> Thêm Mới
                            </Button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '400px' }}>
                            <Spinner animation="border" variant="warning" style={{ width: '4rem', height: '4rem' }} />
                            <h6 className="text-warning mt-4 tracking-widest text-uppercase" style={{ letterSpacing: '3px' }}>ĐANG TẢI KHO HÀNG...</h6>
                        </div>
                    ) : (
                        <>
                            <Table responsive hover className="luxury-table align-middle text-center">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Ảnh</th>
                                        <th className="text-start">Tên SP</th>
                                        <th>Giá</th>
                                        <th>Kho</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length > 0 ? (
                                        currentItems.map((p, index) => (
                                            <ProductItem 
                                                key={p.id} 
                                                product={p} 
                                                index={indexOfFirst + index + 1} 
                                                handleDelete={handleDelete} 
                                                handleShowEdit={handleOpenEdit} 
                                            />
                                        ))
                                    ) : (
                                        <tr><td colSpan="6" className="text-center py-5 text-white-50 fw-bold">Không tìm thấy sản phẩm</td></tr>
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

            <ProductForm 
                show={showFormModal} 
                handleClose={() => setShowFormModal(false)} 
                productData={selectedProduct} 
                refreshData={fetchProducts} 
                showNotification={showNotification}
                productsList={products}
            />
        </>
    );
};

export default ProductList;