import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login'; // Đường dẫn tùy thuộc vào thư mục bạn lưu
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Service from './components/Service';
import Dashboard from './components/Dashboard';
import Product from './components/Product/Product';
import Order from './components/Order/Order';
import Report from './components/Report/Report';

import Customer from './components/Customer/Customer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Mặc định vào thẳng app sẽ đẩy qua trang login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Tuyến đường công khai (Public Route) */}
        <Route path="/login" element={<Login />} />

        {/* Các tuyến đường cần bảo vệ (Protected Routes) */}
        <Route element={<ProtectedRoute />}>
          {/* Lồng AdminLayout để hiển thị Sidebar & Navbar cho tất cả các trang con */}
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/service" element={<Service />} />
            <Route path="/product" element={<Product />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/order" element={<Order />} />
            <Route path="/report" element={<Report />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;