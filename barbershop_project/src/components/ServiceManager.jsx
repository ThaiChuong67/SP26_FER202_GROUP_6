import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Dọn dẹp Clean Code: Gom link API thành 1 biến dùng chung
const API_URL = 'http://localhost:3000/services';

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', duration: '', description: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(API_URL);
      setServices(response.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ép kiểu giá trị để kiểm tra Validate chính xác
    const priceNum = Number(formData.price);
    const durationNum = Number(formData.duration);

    if (priceNum <= 0) {
      alert("Lỗi: Giá dịch vụ phải lớn hơn 0!");
      return;
    }
    if (durationNum <= 0) {
      alert("Lỗi: Thời gian thực hiện phải lớn hơn 0 phút!");
      return;
    }

    // Tối ưu hóa dữ liệu đẩy lên DB: Ép kiểu Số để tránh lỗi cộng chuỗi sau này
    const payload = {
      ...formData,
      price: priceNum,
      duration: durationNum
    };

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, payload);
        alert("Cập nhật dịch vụ thành công!");
      } else {
        await axios.post(API_URL, payload);
        alert("Thêm dịch vụ mới thành công!");
      }
      
      // Xóa trắng form và refresh danh sách
      setFormData({ name: '', price: '', duration: '', description: '' });
      setEditId(null);
      fetchServices();
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
    }
  };

  const handleEdit = (srv) => {
    setEditId(srv.id);
    setFormData({ name: srv.name, price: srv.price, duration: srv.duration, description: srv.description });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchServices();
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Quản lý Dịch vụ Barber</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '10px', border: '1px solid black' }}>
        <h3>{editId ? 'Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}</h3>
        <input type="text" name="name" placeholder="Tên dịch vụ" value={formData.name} onChange={handleInputChange} required style={{ marginRight: '5px' }} />
        <input type="number" name="price" placeholder="Giá (VNĐ)" value={formData.price} onChange={handleInputChange} required style={{ marginRight: '5px' }} />
        <input type="number" name="duration" placeholder="Thời gian (Phút)" value={formData.duration} onChange={handleInputChange} required style={{ marginRight: '5px' }} />
        <input type="text" name="description" placeholder="Mô tả" value={formData.description} onChange={handleInputChange} required style={{ marginRight: '5px' }} />
        
        <button type="submit" style={{ marginRight: '5px', cursor: 'pointer' }}>
          {editId ? 'Lưu Cập Nhật' : 'Thêm mới'}
        </button>
        
        {editId && (
          <button type="button" onClick={() => { setEditId(null); setFormData({ name: '', price: '', duration: '', description: '' }) }} style={{ cursor: 'pointer' }}>
            Hủy
          </button>
        )}
      </form>

      <table border="1" width="100%" cellPadding="10" style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th>ID</th>
            <th>Tên Dịch Vụ</th>
            <th>Giá (VNĐ)</th>
            <th>Thời gian (Phút)</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {services.map((srv) => (
            <tr key={srv.id}>
              <td>{srv.id}</td>
              <td>{srv.name}</td>
              <td>{srv.price.toLocaleString()}</td> {/* Thêm toLocaleString để số tiền hiển thị đẹp hơn: 80,000 */}
              <td>{srv.duration}</td>
              <td>{srv.description}</td>
              <td>
                <button type="button" onClick={() => handleEdit(srv)} style={{ color: 'blue', marginRight: '5px', cursor: 'pointer' }}>Sửa</button>
                <button type="button" onClick={() => handleDelete(srv.id)} style={{ color: 'red', cursor: 'pointer' }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceManager;