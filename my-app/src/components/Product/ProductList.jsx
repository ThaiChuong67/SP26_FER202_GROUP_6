import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Pagination, Form, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import { FaBoxOpen, FaSearch } from 'react-icons/fa';
// 1. IMPORT THƯ VIỆN SWEETALERT2 GIỐNG BÊN SERVICE
import Swal from 'sweetalert2';
import ProductItem from './ProductItem';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState({ id: '', name: '', price: '', quantity: '', image: '', description: '' });
  const [originalId, setOriginalId] = useState('');

  // 2. CẤU HÌNH GIAO DIỆN THÔNG BÁO XÓA PREMIUM
  const premiumSwal = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-dark btn-lg px-5 fw-bold text-warning border-warning shadow-sm mx-2',
        cancelButton: 'btn btn-outline-secondary btn-lg px-5 fw-bold mx-2',
        popup: 'bg-dark text-white rounded-4 border border-warning shadow-lg',
        title: 'text-warning fw-bold',
    },
    buttonsStyling: false
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/products');
      setProducts(res.data);
    } catch (error) { console.error("Lỗi:", error); }
  };

  // 3. CẬP NHẬT HÀM XÓA: Giao diện xịn xò, logic giữ nguyên
  const handleDelete = async (id) => {
    // Tìm tên sản phẩm để in ra thông báo cho đẹp
    const productToDelete = products.find(p => p.id === id);
    const productName = productToDelete ? productToDelete.name : 'sản phẩm này';

    premiumSwal.fire({
      title: 'XÓA SẢN PHẨM?',
      html: `Bạn có chắc chắn muốn xóa sản phẩm <b class="text-warning">${productName}</b> vĩnh viễn?`,
      icon: 'warning',
      iconColor: '#dc3545',
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-trash-alt me-2"></i> XÓA NGAY',
      cancelButtonText: 'HỦY',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Logic gọi API xóa giữ nguyên
          await axios.delete(`http://localhost:5000/products/${id}`);
          fetchProducts();
          
          // Thông báo xóa thành công
          premiumSwal.fire({
            title: 'ĐÃ XÓA!',
            text: 'Sản phẩm đã được xóa khỏi hệ thống.',
            icon: 'success',
            iconColor: '#ffc107',
            timer: 1500,
            showConfirmButton: false
          });
        } catch (error) {
          console.error("Lỗi xóa:", error);
          premiumSwal.fire('Lỗi!', 'Không thể xóa sản phẩm. Vui lòng thử lại.', 'error');
        }
      }
    });
  };

  const handleShowEdit = (product) => {
    setOriginalId(product.id); setEditProduct(product); setShowEditModal(true);
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditProduct({ ...editProduct, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/products/${originalId}`, {
        ...editProduct, price: Number(editProduct.price), quantity: Number(editProduct.quantity)
      });
      setShowEditModal(false); fetchProducts();
    } catch (error) { alert('Lỗi cập nhật!'); }
  };

  const filtered = products.filter(p => {
    const min = minPrice ? parseInt(minPrice) : 0;
    const max = maxPrice ? parseInt(maxPrice) : Infinity;
    return p.price >= min && p.price <= max;
  }).sort((a, b) => {
    return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
  });

  const indexOfLast = currentPage * productsPerPage;
  const currentItems = filtered.slice(indexOfLast - productsPerPage, indexOfLast);
  const totalPages = Math.ceil(filtered.length / productsPerPage);

  return (
    <>
      <Card className="led-border shadow-lg border-0 rounded-4 overflow-hidden h-100">
        <Card.Header className="bg-dark text-warning py-3 border-0 d-flex justify-content-between align-items-center flex-wrap gap-3">
          <h5 className="mb-0 fw-bold text-uppercase d-flex align-items-center" style={{ letterSpacing: '1px' }}>
            <FaBoxOpen className="me-2" /> Danh Sách Sản Phẩm
          </h5>
          <div className="d-flex gap-2">
            <Form.Control size="sm" type="number" placeholder="Giá từ..." className="border-dark" onChange={(e) => {setMinPrice(e.target.value); setCurrentPage(1);}} />
            <Form.Control size="sm" type="number" placeholder="Đến giá..." className="border-dark" onChange={(e) => {setMaxPrice(e.target.value); setCurrentPage(1);}} />
          </div>
        </Card.Header>
        
        <Card.Body className="p-0 bg-white">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="bg-light text-dark">
              <tr className="border-bottom border-warning border-2 text-center">
                <th>ID</th><th>Ảnh</th><th>Tên SP</th><th>Giá</th><th>Kho</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map(p => <ProductItem key={p.id} product={p} handleDelete={handleDelete} handleShowEdit={handleShowEdit} />)
              ) : (
                <tr><td colSpan="6" className="text-center py-4 text-muted fw-bold">Trống</td></tr>
              )}
            </tbody>
          </Table>

          <div className="p-3 d-flex justify-content-center">
             <Pagination className="mb-0">
               {[...Array(totalPages > 0 ? totalPages : 1)].map((_, i) => (
                 <Pagination.Item key={i+1} active={i+1 === currentPage} onClick={() => setCurrentPage(i+1)}>{i+1}</Pagination.Item>
               ))}
             </Pagination>
          </div>
        </Card.Body>
      </Card>

      {/* Modal Cập Nhật */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton className="bg-dark text-warning border-bottom border-warning">
          <Modal.Title className="fw-bold text-uppercase">Sửa Sản Phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">ID</Form.Label>
              <Form.Control required type="text" value={editProduct.id} onChange={(e) => setEditProduct({...editProduct, id: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Tên SP</Form.Label>
              <Form.Control required type="text" value={editProduct.name} onChange={(e) => setEditProduct({...editProduct, name: e.target.value})} />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3"><Form.Label className="fw-bold">Giá</Form.Label><Form.Control type="number" value={editProduct.price} onChange={(e) => setEditProduct({...editProduct, price: e.target.value})} /></Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3"><Form.Label className="fw-bold">Kho</Form.Label><Form.Control type="number" value={editProduct.quantity} onChange={(e) => setEditProduct({...editProduct, quantity: e.target.value})} /></Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Đổi ảnh</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleEditImageUpload} />
              {editProduct.image && <img src={editProduct.image} alt="preview" className="mt-2 rounded" style={{width: '60px', height: '60px'}} />}
            </Form.Group>
            <Button variant="warning" type="submit" className="w-100 fw-bold border-dark">Lưu Thay Đổi</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductList;