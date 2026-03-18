import React from 'react';
import { Container, Badge } from 'react-bootstrap';
import { FaShoppingBag } from 'react-icons/fa';
import ProductList from './ProductList';

const Product = () => {
  return (
    <Container className="py-4 px-lg-5 dashboard-supreme-wrapper" style={{ maxWidth: '1400px' }}>
      <div className="mb-5">
          <div className="d-flex align-items-center">
              <div className="master-hexagon-icon me-4"><FaShoppingBag /></div>
              <div>
                  <h1 className="text-white fw-900 display-4 mb-0 tracking-tight">QUẢN LÝ <span className="gold-gradient-text">SẢN PHẨM</span></h1>
                  <div className="d-flex align-items-center mt-2">
                      <Badge bg="warning" text="dark" className="me-2 px-3">STORE</Badge>
                      <span className="text-white-50 small tracking-widest uppercase">Kho hàng & Vật phẩm</span>
                  </div>
              </div>
          </div>
      </div>

      <ProductList />

      {/* --- CSS DÙNG CHUNG CỦA HỆ THỐNG LUXURY --- */}
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

export default Product;