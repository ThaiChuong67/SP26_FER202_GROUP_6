import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', duration: '', description: '' });
  const [editId, setEditId] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATE NGHIỆP VỤ (Yêu cầu bắt buộc)
    if (Number(formData.price) <= 0) {
      alert("Lỗi: Giá dịch vụ phải lớn hơn 0!");
      return;
    }
    if (Number(formData.duration) <= 0) {
      alert("Lỗi: Thời gian thực hiện phải lớn hơn 0 phút!");
      return;
    }

    alert("Validate thành công, chuẩn bị gọi API...");
    // Tạm dừng ở đây, API thêm/sửa sẽ làm ở commit sau
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:3000/services');
      setServices(response.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) {
      try {
        await axios.delete(`http://localhost:3000/services/${id}`);
        fetchServices(); // Tải lại danh sách sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Quản lý Dịch vụ Barber</h2>

      {/* ĐÂY LÀ PHẦN FORM VỪA ĐƯỢC THÊM VÀO */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '10px', border: '1px solid black' }}>
        <h3>{editId ? 'Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}</h3>
        <input type="text" name="name" placeholder="Tên dịch vụ" value={formData.name} onChange={handleInputChange} required style={{ marginRight: '5px' }} />
        <input type="number" name="price" placeholder="Giá (VNĐ)" value={formData.price} onChange={handleInputChange} required style={{ marginRight: '5px' }} />
        <input type="number" name="duration" placeholder="Thời gian (Phút)" value={formData.duration} onChange={handleInputChange} required style={{ marginRight: '5px' }} />
        <input type="text" name="description" placeholder="Mô tả" value={formData.description} onChange={handleInputChange} required style={{ marginRight: '5px' }} />
        <button type="submit">{editId ? 'Cập nhật' : 'Thêm mới'}</button>
      </form>

      <table border="1" width="100%" cellPadding="10">
        <thead>
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
              <td>{srv.price}</td>
              <td>{srv.duration}</td>
              <td>{srv.description}</td>
              <td>
                <button style={{ marginRight: '5px' }}>Sửa</button>
                <button onClick={() => handleDelete(srv.id)} style={{ color: 'red' }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceManager;