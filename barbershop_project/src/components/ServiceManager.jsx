import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceManager = () => {
  const [services, setServices] = useState([]);

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
                <button>Sửa</button>
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