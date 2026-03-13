import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Gọi xuống JSON Server (giả sử bạn cấu hình DB có mảng /users)
      const response = await axios.get(`http://localhost:3000/users?username=${username}&password=${password}`);

      if (response.data.length > 0) {
        // Đăng nhập thành công, lưu vào localStorage và vào Dashboard
        localStorage.setItem('user', JSON.stringify(response.data[0]));
        navigate('/dashboard');
      } else {
        alert('Sai tài khoản hoặc mật khẩu!');
      }
    } catch (error) {
      console.error("Lỗi khi kết nối đến server", error);
    }
  };

  return (
    <div style={{ width: '300px', margin: '100px auto', textAlign: 'center' }}>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px' }}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;