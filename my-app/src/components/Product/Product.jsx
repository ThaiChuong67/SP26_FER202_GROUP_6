import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaShoppingBag } from 'react-icons/fa';
import ProductForm from './ProductForm';
import ProductList from './ProductList';

const Product = () => {
    return (
        <Container className="py-5" style={{ maxWidth: '1300px' }}>
            {/* Tiêu đề trang phong cách Luxury */}
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bolder text-uppercase d-flex justify-content-center align-items-center text-white"
                    style={{ letterSpacing: '5px', textShadow: '0 0 20px rgba(255,193,7,0.5)' }}>
                    <FaShoppingBag className="me-3 text-warning" style={{ filter: 'drop-shadow(0 0 8px rgba(255,193,7,0.8))' }} />
                    QUẢN LÝ <span className="ms-3 text-warning">SẢN PHẨM</span>
                </h1>
                <div className="bg-warning mx-auto rounded-pill" style={{ width: '120px', height: '4px', opacity: '0.8' }}></div>
            </div>

            {/* Bố cục Grid: Form bên trái (4 phần), List bên phải (8 phần) */}
            <Row className="g-4">
                <Col lg={4}>
                    <ProductForm />
                </Col>
                <Col lg={8}>
                    <ProductList />
                </Col>
            </Row>

            {/* CSS Hiệu ứng viền LED dùng chung cho cụm Product */}
            <style>{`
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
        .led-border:hover { transform: translateY(-5px); }
      `}</style>
        </Container>
    );
};

export default Product;