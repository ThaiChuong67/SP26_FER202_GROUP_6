import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';

const ProductForm = ({ refresh }) => {
  const [product, setProduct] = useState({ name: '', price: '', quantity: '', image: '', description: '' });

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProduct({ ...product, image: reader.result });
      reader.readAsDataURL(file); // Convert sang Base64 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:4000/products', {
      ...product, price: Number(product.price), quantity: Number(product.quantity)
    });
    alert('Thêm thành công!');
    setProduct({ name: '', price: '', quantity: '', image: '', description: '' });
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm border-0">
        <Card.Body>
          <h4 className="mb-4">Thêm Sản Phẩm Mới</h4>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên sản phẩm</Form.Label>
                  <Form.Control required type="text" value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá (VNĐ)</Form.Label>
                  <Form.Control required type="number" min="1" value={product.price} onChange={(e) => setProduct({...product, price: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Số lượng</Form.Label>
                  <Form.Control required type="number" min="0" value={product.quantity} onChange={(e) => setProduct({...product, quantity: e.target.value})} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Ảnh sản phẩm</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleUpload} />
              {product.image && <img src={product.image} alt="preview" className="mt-2 rounded" style={{width: '80px'}} />}
            </Form.Group>
            <Button variant="success" type="submit" className="w-100">Lưu Sản Phẩm</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductForm;