import React from 'react';
// Import 2 component bạn vừa tạo (Nhớ kiểm tra lại đường dẫn cho đúng với thư mục của bạn)
import ProductForm from './components/Product/ProductForm';
import ProductList from './components/Product/ProductList';

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>
        Hệ Thống Quản Lý Tiệm Barber
      </h1>
      
      <div style={{ padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '5px', marginBottom: '20px' }}>
        <strong>Lưu ý:</strong> Đây là giao diện test tạm thời cho Module Product của Quốc Khánh.
      </div>

      {/* Hiển thị Form thêm sản phẩm và Upload ảnh */}
      <section style={{ marginBottom: '40px' }}>
        <ProductForm />
      </section>

      <hr style={{ border: '1px solid #ddd', marginBottom: '40px' }} />

      {/* Hiển thị Danh sách sản phẩm (kèm Filter, Pagination, Trạng thái) */}
      <section>
        <ProductList />
      </section>
    </div>
  );
}

export default App;