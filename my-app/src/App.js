import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login'; // Đường dẫn tùy thuộc vào thư mục bạn lưu
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Service from './components/Service';
import Dashboard from './components/Dashboard';

// --- CÁC COMPONENT TẠM THỜI (PLACEHOLDER) ---
// Tạm thời tạo các component này để test. 
// Sau này các bạn khác (Quý, Khánh, Anh, Trâm) làm xong sẽ import file thật vào đây.


const Product = () => <h2>Trang Quản lý Sản phẩm (Đang phát triển)</h2>;
const Customer = () => <h2>Trang Quản lý Khách hàng (Đang phát triển)</h2>;
const Order = () => <h2>Trang Quản lý Đơn hàng (Đang phát triển)</h2>;

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
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;