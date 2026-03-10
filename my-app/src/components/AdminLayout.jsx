import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user'); // Xóa phiên đăng nhập
    navigate('/login'); // Đẩy ra ngoài
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: '250px', background: '#333', color: '#fff', padding: '20px' }}>
        <h2>Barber Admin</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><NavLink to="/dashboard" style={{ color: 'white' }}>Dashboard</NavLink></li>
          <li><NavLink to="/service" style={{ color: 'white' }}>Service</NavLink></li>
          <li><NavLink to="/product" style={{ color: 'white' }}>Product</NavLink></li>
          <li><NavLink to="/customer" style={{ color: 'white' }}>Customer</NavLink></li>
          <li><NavLink to="/order" style={{ color: 'white' }}>Order</NavLink></li>
        </ul>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Navbar ở trên cùng */}
        <div style={{ padding: '15px', background: '#eee', textAlign: 'right' }}>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>

        <div style={{ padding: '20px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;