import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 
    try {
      // Gọi API lấy toàn bộ danh sách users thay vì lọc trên URL
      const response = await axios.get('http://localhost:5000/users');
      const users = response.data;

      // Dùng hàm find của JavaScript để đối chiếu tài khoản & mật khẩu tuyệt đối
      const foundUser = users.find(
        (u) => u.username === username && u.password === password
      );

      if (foundUser) {
        // Nếu tìm thấy, lưu thông tin và đẩy vào trang trong
        localStorage.setItem('user', JSON.stringify(foundUser));
        navigate('/dashboard');
      } else {
        setError('Sai tài khoản hoặc mật khẩu!');
      }
    } catch (err) {
      setError('Lỗi kết nối đến máy chủ!');
      console.error(err);
    }
  };

  return (
    // Container fluid chiếm toàn màn hình (vh-100) và căn giữa nội dung
    <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="shadow-lg p-3" style={{ width: '400px', borderRadius: '15px' }}>
        <Card.Body>
          <h2 className="text-center mb-4 fw-bold">💈 Barber Login</h2>
          
          {/* Hiện thông báo lỗi nếu có */}
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Tên đăng nhập</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Nhập username..." 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">Mật khẩu</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Nhập password..." 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </Form.Group>

            <Button variant="dark" type="submit" className="w-100 py-2 fw-bold fs-5">
              Đăng Nhập
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;