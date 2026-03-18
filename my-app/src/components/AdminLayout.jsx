import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { 
  FaChartPie, FaCut, FaShoppingBag, FaUsers, 
  FaFileInvoiceDollar, FaSignOutAlt, FaUserCircle, FaBell, FaCrown 
} from 'react-icons/fa';
import axios from 'axios';

const AdminLayout = () => {
  const navigate = useNavigate();
  // Khởi tạo state để chứa thông tin Admin
  const [adminInfo, setAdminInfo] = useState({ fullName: 'Loading...', role: '' });

  useEffect(() => {
    // 1. Lấy thông tin user đã lưu lúc Login từ localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedUser || !storedUser.id) {
      // Nếu không có thông tin đăng nhập, đá về trang login ngay
      navigate('/login');
      return;
    }

    // 2. Gọi API để lấy thông tin mới nhất của Admin này
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${storedUser.id}`);
        setAdminInfo(response.data);
      } catch (error) {
        console.error("Lỗi khi gọi API Admin:", error);
        // Nếu lỗi API, dùng tạm tên từ localStorage
        setAdminInfo(storedUser);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="luxury-admin-layout">
      {/* 1. TOP NAVBAR PREMIUM - LOGO TUYỆT MỸ */}
      <Navbar bg="dark" variant="dark" className="main-navbar shadow-lg px-4 py-2 sticky-top border-bottom border-warning border-opacity-25">
        <Navbar.Brand className="brand-logo-wrapper d-flex align-items-center">
          <div className="hexagon-container me-3">
            <div className="hexagon-neon-glow"></div>
            <div className="hexagon-inner">
              <FaCut className="logo-scissors-master" />
            </div>
          </div>
          
          <div className="brand-text-stack">
            <div className="brand-main">BARBER</div>
            <div className="brand-sub gold-shimmer-text">Management</div>
          </div>
        </Navbar.Brand>
        
        <Navbar.Collapse className="justify-content-end">
          <div className="d-flex align-items-center me-4">
             <div className="notification-wrapper me-4">
            
                <Badge bg="warning" className="notif-dot"></Badge>
             </div>
             
             {/* PHẦN HIỂN THỊ THÔNG TIN ADMIN TỪ API */}
             <div className="user-profile-section d-none d-md-flex align-items-center pe-3 border-end border-secondary border-opacity-50 me-3">
                <div className="text-end me-3">
                  {/* FULL NAME ĐƯỢC ĐỔ TỪ API TẠI ĐÂY */}
                  <div className="text-white fw-bold small text-uppercase tracking-wider">
                    {adminInfo.fullName}
                  </div>
                  <div className="text-warning extra-small fw-bold tracking-widest text-uppercase">
                    {adminInfo.role === 'admin' ? 'Supreme Admin' : 'Staff Member'}
                  </div>
                </div>
                <div className="avatar-gold-border">
                    <FaUserCircle size={35} className="text-warning" />
                </div>
             </div>

             <Button variant="outline-warning" className="logout-btn-premium rounded-pill px-4 fw-bold" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Thoát
             </Button>
          </div>
        </Navbar.Collapse>
      </Navbar>

      <div className="layout-main-body">
        <Row className="g-0 flex-nowrap">
          {/* 2. SIDEBAR LUXURY DARK */}
          <Col md={2} className="sidebar-column p-0">
            <div className="sidebar-glass-effect pt-4 px-3">
              <div className="sidebar-label-gold mt-4">BẢNG ĐIỀU KHIỂN</div>
              <Nav className="flex-column gap-2 sidebar-nav-list">
                <Nav.Link as={NavLink} to="/dashboard" className="nav-link-luxury">
                  <FaChartPie className="nav-item-icon" /> <span>Tổng quan</span>
                </Nav.Link>
                <Nav.Link as={NavLink} to="/service" className="nav-link-luxury">
                  <FaCut className="nav-item-icon" /> <span>Dịch vụ Barber</span>
                </Nav.Link>
                <Nav.Link as={NavLink} to="/product" className="nav-link-luxury">
                  <FaShoppingBag className="nav-item-icon" /> <span>Sản phẩm bán</span>
                </Nav.Link>
                <Nav.Link as={NavLink} to="/customer" className="nav-link-luxury">
                  <FaUsers className="nav-item-icon" /> <span>Khách hàng</span>
                </Nav.Link>
                <Nav.Link as={NavLink} to="/order" className="nav-link-luxury">
                  <FaFileInvoiceDollar className="nav-item-icon" /> <span>Đơn hàng</span>
                </Nav.Link>
                <Nav.Link as={NavLink} to="/report" className="nav-link-luxury">
                  <FaChartPie className="nav-item-icon" /> <span>Báo cáo</span>
                </Nav.Link>
              </Nav>
              
              <div className="mt-auto mb-4 px-2">
              </div>
            </div>
          </Col>

          {/* 3. DYNAMIC CONTENT AREA */}
          <Col md={10} className="content-area-viewport p-4">
            <div className="led-frame-content h-100 shadow-2xl">
                <div className="led-light-runner"></div>
                <div className="content-canvas h-100">
                   <Outlet />
                </div>
            </div>
          </Col>
        </Row>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;700;900&display=swap');

        .luxury-admin-layout {
          font-family: 'Montserrat', sans-serif;
          background-color: #0d0d0d;
          min-height: 100vh;
          overflow: hidden;
        }

        .main-navbar { 
          background-color: #1a1a1a !important; 
          height: 80px; 
          z-index: 1060;
          border-bottom: 1px solid #333;
        }

        /* LOGO & BRAND TUYỆT MỸ */
        .hexagon-container { position: relative; width: 55px; height: 55px; display: flex; align-items: center; justify-content: center; }
        .hexagon-neon-glow {
          position: absolute; width: 100%; height: 100%;
          background: conic-gradient(from 0deg, transparent, #ffc107, #fff, #ffc107, transparent 40%);
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
          animation: rotate-neon 4s linear infinite;
        }
        .hexagon-inner {
          position: absolute; width: 90%; height: 90%; background: #0a0a0a;
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
          display: flex; align-items: center; justify-content: center; z-index: 2;
        }
        .logo-scissors-master { color: #ffc107; font-size: 1.5rem; transition: 0.5s; }
        @keyframes rotate-neon { 100% { transform: rotate(1turn); } }

        .brand-text-stack { display: flex; flex-direction: column; line-height: 1; }
        .brand-main { color: #fff; font-weight: 200; font-size: 1.5rem; letter-spacing: 6px; }
        .gold-shimmer-text {
          background: linear-gradient(90deg, #ffc107 0%, #ffc107 45%, #fff 50%, #ffc107 55%, #ffc107 100%);
          background-size: 200% auto; -webkit-background-clip: text;
          -webkit-text-fill-color: transparent; animation: shimmer-text 3s infinite linear;
          font-weight: 900; font-size: 1.8rem; letter-spacing: 2px;
        }
        @keyframes shimmer-text { to { background-position: 200% center; } }

        /* SIDEBAR & NAV */
        .sidebar-column { 
          background: #1a1a1a; 
          height: calc(100vh - 80px); 
          border-right: 1px solid #333;
        }
        .sidebar-glass-effect { 
          background: #1a1a1a; 
          height: 100%; 
          display: flex; 
          flex-direction: column; 
        }
        .sidebar-label-gold { 
          color: #ffc107; 
          font-size: 0.75rem; 
          font-weight: 700; 
          letter-spacing: 2px; 
          margin-bottom: 20px; 
          padding-left: 10px;
          text-transform: uppercase;
        }

        .nav-link-luxury {
          color: #fff !important; 
          display: flex; 
          align-items: center; 
          padding: 12px 15px !important;
          border-radius: 8px !important; 
          transition: 0.3s; 
          text-decoration: none; 
          font-weight: 400;
          margin-bottom: 2px;
        }
        .nav-item-icon { 
          margin-right: 12px; 
          color: #ffc107; 
          font-size: 1rem; 
          opacity: 0.8;
        }
        .nav-link-luxury:hover {
          background-color: #ffc107 !important;
          color: #000 !important;
        }
        .nav-link-luxury:hover .nav-item-icon {
          color: #000 !important;
          opacity: 1;
        }
        .nav-link-luxury.active {
          background-color: #ffc107 !important;
          color: #000 !important;
        }
        .nav-link-luxury.active .nav-item-icon {
          color: #000 !important;
          opacity: 1;
        }

        /* CONTENT LED RUNNER */
        .content-area-viewport { 
          background: #0d0d0d; 
          height: calc(100vh - 80px); 
          overflow-y: auto; 
        }
        .led-frame-content { 
          position: relative; 
          border-radius: 12px; 
          overflow: hidden; 
          padding: 1px; 
          background: transparent;
        }
        .content-canvas { 
          background: #0d0d0d; 
          border-radius: 12px; 
          position: relative; 
          z-index: 2; 
          overflow: auto; 
          padding: 20px;
        }

        .notification-wrapper { position: relative; cursor: pointer; }
        .notif-dot { position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; border-radius: 50%; border: 2px solid #0a0a0a; }
        .avatar-gold-border { border: 2px solid #ffc107; border-radius: 50%; padding: 2px; box-shadow: 0 0 15px rgba(255, 193, 7, 0.3); }

        .extra-small { font-size: 0.65rem; }
        .logout-btn-premium:hover { background: #fff !important; color: #000 !important; border-color: #fff !important; transform: scale(1.05); }

        /* Custom Scrollbar */
        .content-canvas::-webkit-scrollbar { width: 6px; }
        .content-canvas::-webkit-scrollbar-thumb { background: #ffc107; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminLayout;