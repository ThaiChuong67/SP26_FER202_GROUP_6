import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Row, Col, Button, Card } from 'react-bootstrap';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Container fluid className="p-0 vh-100 d-flex flex-column">
      {/* 1. Navbar phía trên (Header) */}
      <Navbar bg="dark" variant="dark" className="px-4 shadow-sm">
        <Navbar.Brand className="fw-bold fs-4">💈 Barber Shop System</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Button variant="outline-light" size="sm" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Navbar.Collapse>
      </Navbar>

      {/* 2. Khu vực bên dưới Navbar gồm Sidebar và Content */}
      <Row className="flex-grow-1 m-0">
        
        {/* Sidebar bên trái */}
        <Col md={2} className="bg-white border-end pt-4 px-3 shadow-sm">
          <Nav className="flex-column gap-2">
            <Nav.Link as={NavLink} to="/dashboard" className="text-dark fw-medium fs-6 p-2 rounded">📊 Dashboard</Nav.Link>
            <Nav.Link as={NavLink} to="/service" className="text-dark fw-medium fs-6 p-2 rounded">💇 Dịch vụ</Nav.Link>
            <Nav.Link as={NavLink} to="/product" className="text-dark fw-medium fs-6 p-2 rounded">🧴 Sản phẩm</Nav.Link>
            <Nav.Link as={NavLink} to="/customer" className="text-dark fw-medium fs-6 p-2 rounded">👤 Khách hàng</Nav.Link>
            <Nav.Link as={NavLink} to="/order" className="text-dark fw-medium fs-6 p-2 rounded">🧾 Đơn hàng</Nav.Link>
          </Nav>
        </Col>

        {/* Khu vực nội dung chính bên phải */}
        <Col md={10} className="bg-light p-4">
          <Card className="border-0 shadow-sm h-100 p-4">
            {/* Các trang con sẽ được render tại đây */}
            <Outlet />
          </Card>
        </Col>

      </Row>
    </Container>
  );
};

export default AdminLayout;