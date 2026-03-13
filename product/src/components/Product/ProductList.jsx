import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Pagination, Form, Row, Col, Card, Container } from 'react-bootstrap';
import ProductItem from './ProductItem';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5; // Số SP mỗi trang 

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:4000/products');
    setProducts(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xác nhận xóa?')) {
      await axios.delete(`http://localhost:4000/products/${id}`);
      fetchProducts();
    }
  };

  // Logic Filter theo giá 
  const filtered = products.filter(p => {
    const min = minPrice ? parseInt(minPrice) : 0;
    const max = maxPrice ? parseInt(maxPrice) : Infinity;
    return p.price >= min && p.price <= max;
  });

  // Logic Pagination 
  const indexOfLast = currentPage * productsPerPage;
  const currentItems = filtered.slice(indexOfLast - productsPerPage, indexOfLast);
  const totalPages = Math.ceil(filtered.length / productsPerPage);

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header as="h5" className="bg-dark text-white">Danh Sách Sản Phẩm</Card.Header>
        <Card.Body>
          {/* Bộ lọc giá */}
          <Row className="mb-4 g-3 align-items-center">
            <Col md="auto"><strong>Lọc theo giá:</strong></Col>
            <Col md={3}>
              <Form.Control type="number" placeholder="Từ..." onChange={(e) => {setMinPrice(e.target.value); setCurrentPage(1);}} />
            </Col>
            <Col md={3}>
              <Form.Control type="number" placeholder="Đến..." onChange={(e) => {setMaxPrice(e.target.value); setCurrentPage(1);}} />
            </Col>
          </Row>

          <Table hover responsive>
            <thead className="table-light">
              <tr className="text-center">
                <th>ID</th><th>Ảnh</th><th>Tên</th><th>Giá</th><th>Trạng thái</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(p => <ProductItem key={p.id} product={p} handleDelete={handleDelete} />)}
            </tbody>
          </Table>

          {/* Pagination */}
          <Pagination className="justify-content-center mt-4">
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item key={i+1} active={i+1 === currentPage} onClick={() => setCurrentPage(i+1)}>
                {i+1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductList;