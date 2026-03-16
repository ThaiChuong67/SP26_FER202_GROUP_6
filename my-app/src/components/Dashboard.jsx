import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Badge, ProgressBar } from 'react-bootstrap';
import { 
  FaChartLine, FaCut, FaShoppingBag, FaUsers, 
  FaFileInvoiceDollar, FaMoneyBillWave, FaCrown, FaStar, FaGem, FaBolt, FaArrowUp 
} from 'react-icons/fa';

const Dashboard = () => {
  const [data, setData] = useState({ services: [], products: [], customers: [], orders: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [srvRes, prodRes, custRes, ordRes] = await Promise.all([
          axios.get('http://localhost:5000/services'),
          axios.get('http://localhost:5000/products'),
          axios.get('http://localhost:5000/users'), 
          axios.get('http://localhost:5000/orders')
        ]);
        setData({ services: srvRes.data, products: prodRes.data, customers: custRes.data, orders: ordRes.data });
      } catch (error) {
        console.error("Lỗi fetch Dashboard:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };
    fetchAllData();
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = data.orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);
    const bestService = data.services[0]?.name || "Premium Haircut";
    const bestProduct = data.products[0]?.name || "Barber Wax Gold";
    return {
      totalServices: data.services.length,
      totalProducts: data.products.length,
      totalCustomers: data.customers.length,
      totalOrders: data.orders.length,
      revenue: totalRevenue,
      bestService,
      bestProduct
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-black">
        <Spinner animation="border" variant="warning" style={{width: '4rem', height: '4rem'}} />
        <h5 className="text-warning mt-4 tracking-widest">ĐANG KHỞI TẠO HỆ THỐNG VIP...</h5>
      </div>
    );
  }

  return (
    <Container fluid className="dashboard-supreme-wrapper py-4 px-lg-5">
      
      {/* --- PHẦN 1: HEADER NGHỆ THUẬT --- */}
      <div className="dashboard-hero-section mb-5">
        <Row className="align-items-center">
          <Col md={8}>
            <div className="d-flex align-items-center">
                <div className="master-hexagon-icon me-4">
                    <FaGem />
                </div>
                <div>
                    <h1 className="text-white fw-900 display-4 mb-0 tracking-tight">EXECUTIVE <span className="gold-gradient-text">REPORT</span></h1>
                    <div className="d-flex align-items-center mt-2">
                        <Badge bg="warning" text="dark" className="me-2 px-3">LIVE DATA</Badge>
                        <span className="text-white-50 small tracking-widest uppercase">Cập nhật hệ thống: {new Date().toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>
            </div>
          </Col>
          <Col md={4} className="text-end d-none d-md-block">
             <div className="system-health-card">
                <FaBolt className="text-warning me-2" />
                <span className="text-white fw-bold">SYSTEM STATUS: <span className="text-success">STABLE</span></span>
             </div>
          </Col>
        </Row>
      </div>

      {/* --- PHẦN 2: BỐ CỤC DỮ LIỆU THÔNG MINH --- */}
      <Row className="g-4">
        
        {/* DOANH THU & ĐƠN HÀNG (Dòng 1 - Tiêu điểm) */}
        <Col lg={8}>
          <Card className="luxury-card main-revenue-card h-100">
            <Card.Body className="p-5 position-relative overflow-hidden">
                <div className="card-decoration-circle"></div>
                <div className="position-relative z-10">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <span className="label-vip">TỔNG DOANH THU HỆ THỐNG</span>
                        <FaArrowUp className="text-success fs-4 animate-bounce" />
                    </div>
                    <h1 className="display-1 fw-900 text-white shimmer-text mb-2">
                        {stats.revenue.toLocaleString()}<small className="fs-3 ms-2 text-warning">VND</small>
                    </h1>
                    <div className="mt-4 d-flex align-items-center">
                        <div className="progress-led-container flex-grow-1 me-3">
                            <div className="progress-led-bar" style={{width: '85%'}}></div>
                        </div>
                        <span className="text-warning fw-bold">+15% vs Last Month</span>
                    </div>
                </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="luxury-card total-order-card h-100 text-center">
            <Card.Body className="d-flex flex-column justify-content-center p-4">
                <div className="icon-circle-glow mx-auto mb-4">
                    <FaFileInvoiceDollar />
                </div>
                <span className="label-vip">TỔNG ĐƠN HÀNG</span>
                <h1 className="display-3 fw-900 text-white mt-2">{stats.totalOrders}</h1>
                <p className="text-white-50 small mt-3">Tăng trưởng ổn định trong quý 1</p>
            </Card.Body>
          </Card>
        </Col>

        {/* 3 THÔNG SỐ PHỤ (Dòng 2) */}
        <Col md={4}>
          <Card className="luxury-card mini-stat-card">
            <Card.Body className="d-flex align-items-center p-4">
                <div className="mini-icon-box gold me-4"><FaCut /></div>
                <div>
                    <span className="label-vip">DỊCH VỤ</span>
                    <h2 className="text-white fw-bold mb-0">{stats.totalServices}</h2>
                </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="luxury-card mini-stat-card">
            <Card.Body className="d-flex align-items-center p-4">
                <div className="mini-icon-box silver me-4"><FaShoppingBag /></div>
                <div>
                    <span className="label-vip">SẢN PHẨM</span>
                    <h2 className="text-white fw-bold mb-0">{stats.totalProducts}</h2>
                </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="luxury-card mini-stat-card">
            <Card.Body className="d-flex align-items-center p-4">
                <div className="mini-icon-box gold me-4"><FaUsers /></div>
                <div>
                    <span className="label-vip">KHÁCH HÀNG VIP</span>
                    <h2 className="text-white fw-bold mb-0">{stats.totalCustomers}</h2>
                </div>
            </Card.Body>
          </Card>
        </Col>

        {/* HALL OF FAME - BEST SELLERS (Dòng 3) */}
        <Col lg={6}>
            <div className="hall-of-fame-card h-100 p-1">
                <div className="inner-glow-content p-4 d-flex align-items-center">
                    <div className="rank-badge me-4">
                        <FaCrown />
                    </div>
                    <div className="flex-grow-1">
                        <span className="label-vip">DỊCH VỤ THƯỢNG HẠNG</span>
                        <h3 className="text-white fw-bold text-uppercase mt-1 shimmer-text">{stats.bestService}</h3>
                        <div className="d-flex gap-2 mt-2">
                             {[1,2,3,4,5].map(i => <FaStar key={i} className="text-warning small" />)}
                        </div>
                    </div>
                    <div className="text-end">
                        <div className="text-warning fw-900 fs-4">TOP 1</div>
                    </div>
                </div>
            </div>
        </Col>

        <Col lg={6}>
            <div className="hall-of-fame-card h-100 p-1">
                <div className="inner-glow-content p-4 d-flex align-items-center">
                    <div className="rank-badge silver me-4">
                        <FaStar />
                    </div>
                    <div className="flex-grow-1">
                        <span className="label-vip">SẢN PHẨM BÁN CHẠY</span>
                        <h3 className="text-white fw-bold text-uppercase mt-1 shimmer-text">{stats.bestProduct}</h3>
                        <Badge bg="light" text="dark" className="mt-2">HOT SELLER</Badge>
                    </div>
                    <div className="text-end">
                        <div className="text-white fw-900 fs-4">TOP 1</div>
                    </div>
                </div>
            </div>
        </Col>

      </Row>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;700;900&display=swap');

        .dashboard-supreme-wrapper { font-family: 'Montserrat', sans-serif; background: transparent; }
        .fw-900 { font-weight: 900; }
        .tracking-tight { letter-spacing: -3px; }
        .gold-gradient-text { 
          background: linear-gradient(90deg, #ffc107, #fff, #ffc107);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-size: 200% auto; animation: shimmer 4s infinite linear;
        }

        /* Icons & Decorations */
        .master-hexagon-icon {
          width: 70px; height: 70px; background: #ffc107; color: #000;
          display: flex; align-items: center; justify-content: center;
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
          font-size: 2rem; box-shadow: 0 0 30px rgba(255, 193, 7, 0.4);
        }

        .system-health-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
          padding: 12px 25px; border-radius: 50px; display: inline-flex; align-items: center;
        }

        /* LUXURY CARD BASE */
        .luxury-card {
          background: rgba(15, 15, 15, 0.6) !important;
          backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 35px !important; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .luxury-card:hover { transform: translateY(-12px); border-color: rgba(255, 193, 7, 0.3) !important; box-shadow: 0 20px 40px rgba(0,0,0,0.6) !important; }

        .label-vip { color: rgba(255,255,255,0.3); font-size: 0.7rem; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; }

        /* Main Revenue Card */
        .main-revenue-card { background: linear-gradient(135deg, #0a0a0a 0%, #1a1608 100%) !important; border-top: 4px solid #ffc107 !important; }
        .card-decoration-circle {
          position: absolute; width: 300px; height: 300px; background: radial-gradient(circle, rgba(255,193,7,0.05) 0%, transparent 70%);
          top: -100px; right: -100px; z-index: 1;
        }

        .shimmer-text { animation: shimmer-gold 3s infinite; }
        @keyframes shimmer-gold { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }

        /* Progress LED */
        .progress-led-container { height: 8px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
        .progress-led-bar { 
          height: 100%; background: linear-gradient(90deg, #ffc107, #fff, #ffc107); 
          background-size: 200% 100%; animation: led-flow 2s infinite linear; border-radius: 10px;
        }
        @keyframes led-flow { to { background-position: 200% 0; } }

        /* Icon Circles */
        .icon-circle-glow {
          width: 80px; height: 80px; background: rgba(255,193,7,0.1); border: 2px solid #ffc107;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          color: #ffc107; font-size: 2rem; box-shadow: 0 0 30px rgba(255, 193, 7, 0.2);
        }

        .mini-icon-box {
          width: 50px; height: 50px; border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;
        }
        .mini-icon-box.gold { background: #ffc107; color: #000; box-shadow: 0 0 15px rgba(255, 193, 7, 0.3); }
        .mini-icon-box.silver { background: #333; color: #fff; border: 1px solid #444; }

        /* HALL OF FAME CARDS */
        .hall-of-fame-card {
          background: linear-gradient(90deg, #ffc107, #ff9800, #ffc107);
          border-radius: 25px; background-size: 200% 100%; animation: led-flow 5s infinite linear;
        }
        .inner-glow-content { background: #0a0a0a; border-radius: 23px; height: 100%; width: 100%; }
        
        .rank-badge {
          width: 60px; height: 60px; background: rgba(255,193,7,0.1); border: 1px solid #ffc107;
          border-radius: 18px; display: flex; align-items: center; justify-content: center;
          color: #ffc107; font-size: 1.5rem;
        }
        .rank-badge.silver { border-color: #fff; color: #fff; background: rgba(255,255,255,0.05); }

        .animate-bounce { animation: bounce-custom 2s infinite; }
        @keyframes bounce-custom { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

        @keyframes shimmer { to { background-position: 200% center; } }
      `}</style>
    </Container>
  );
};

export default Dashboard;