import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { FaPlus, FaSave } from 'react-icons/fa';

const ProductForm = () => {
  const [product, setProduct] = useState({ name: '', price: '', quantity: '', image: '', description: '' });

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProduct({ ...product, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Gọi API lấy danh sách hiện có để tìm ra ID lớn nhất
      const res = await axios.get('http://localhost:5000/products');
      const currentProducts = res.data;
      
      // Lọc ra các ID hợp lệ, tìm giá trị Lớn nhất và cộng thêm 1
      const validIds = currentProducts.map(p => Number(p.id)).filter(id => !isNaN(id));
      const nextId = validIds.length > 0 ? (Math.max(...validIds) + 1).toString() : "1";

      // 2. Gán ID mới tính được vào dữ liệu chuẩn bị gửi đi
      const newProduct = {
        id: nextId,
        name: product.name,
        price: Number(product.price),
        quantity: Number(product.quantity),
        image: product.image,
        description: product.description || ""
      };
      
      // 3. Gửi sản phẩm lên hệ thống
      await axios.post('http://localhost:5000/products', newProduct);
      alert('Thêm sản phẩm thành công!');
      window.location.reload(); 
    } catch (error) {
      console.error("Lỗi:", error);
      alert('Đã xảy ra lỗi khi kết nối!');
    }
  };

  return (
    <Card className="led-border shadow-lg border-0 rounded-4 sticky-top overflow-hidden" style={{ top: '20px' }}>
      <Card.Header className="bg-dark text-warning py-3 border-0">
        <h5 className="mb-0 fw-bold text-uppercase d-flex align-items-center" style={{ letterSpacing: '1px' }}>
          <FaPlus className="me-2" /> Thêm Sản Phẩm Mới
        </h5>
      </Card.Header>
      <Card.Body className="p-4 bg-white">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold text-muted">Tên sản phẩm</Form.Label>
            <Form.Control required type="text" className="border-2 border-dark" placeholder="Nhập tên..." value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} />
          </Form.Group>
          
          <Row className="g-2 mb-3">
            <Col xs={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-muted">Giá (VNĐ)</Form.Label>
                <Form.Control required type="number" min="1" className="border-2 border-dark" value={product.price} onChange={(e) => setProduct({...product, price: e.target.value})} />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-muted">Số lượng</Form.Label>
                <Form.Control required type="number" min="0" className="border-2 border-dark" value={product.quantity} onChange={(e) => setProduct({...product, quantity: e.target.value})} />
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold text-muted">Ảnh sản phẩm</Form.Label>
            <Form.Control type="file" accept="image/*" className="border-2 border-dark" onChange={handleUpload} />
            {product.image && (
              <div className="mt-2 text-center">
                <img src={product.image} alt="preview" className="rounded border border-warning" style={{width: '100px', height: '100px', objectFit: 'cover'}} />
              </div>
            )}
          </Form.Group>
          
          <Button variant="warning" type="submit" className="w-100 fw-bold border border-dark py-2 text-uppercase shadow-sm">
            <FaSave className="me-2 mb-1" /> Lưu Sản Phẩm
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ProductForm;