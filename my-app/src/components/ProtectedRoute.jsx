import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Kiểm tra xem đã lưu thông tin đăng nhập trong máy chưa
  const isAuthenticated = localStorage.getItem('user');

  // Nếu chưa có, đẩy về /login. Nếu có, cho đi tiếp vào các component con (Outlet)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;