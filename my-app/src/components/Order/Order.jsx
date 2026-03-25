import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFileInvoiceDollar, FaPlus, FaSearch, FaEdit, FaTrash, FaBolt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Pagination } from 'react-bootstrap';

// Component chính cho trang quản lý đơn hàng
const Order = () => {
  // State để lưu trữ dữ liệu từ API
  const [orders, setOrders] = useState([]); // Danh sách đơn hàng
  const [customers, setCustomers] = useState([]); // Danh sách khách hàng
  const [services, setServices] = useState([]); // Danh sách dịch vụ
  const [products, setProducts] = useState([]); // Danh sách sản phẩm
  const [showForm, setShowForm] = useState(false); // Hiển thị/ẩn form tạo đơn hàng
  const [editingOrder, setEditingOrder] = useState(null); // Đơn hàng đang được chỉnh sửa
  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;
  // State cho dữ liệu form
  const [formData, setFormData] = useState({
    customerId: '', // ID khách hàng được chọn
    serviceId: '', // ID dịch vụ được chọn
    productId: '', // ID sản phẩm được chọn
    date: new Date().toISOString().split('T')[0] // Ngày mặc định là hôm nay
  });

  // Cấu hình SweetAlert với style tùy chỉnh
  const premiumSwal = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-warning btn-lg px-5 fw-bold rounded-3 shadow-sm text-dark ms-3',
      cancelButton: 'btn btn-outline-light btn-lg px-4 fw-bold rounded-3'
    },
    buttonsStyling: false
  });

  // useEffect để fetch dữ liệu khi component được mount
  useEffect(() => {
    fetchData();
  }, []);

  // Hàm fetch dữ liệu từ API JSON Server
  const fetchData = async () => {
    try {
      // Gọi song song nhiều API để tăng performance
      const [ordersRes, customersRes, servicesRes, productsRes] = await Promise.all([
        axios.get('http://localhost:5000/orders'), // Lấy danh sách đơn hàng
        axios.get('http://localhost:5000/customers'), // Lấy danh sách khách hàng
        axios.get('http://localhost:5000/services'),
        axios.get('http://localhost:5000/products')
      ]);

      // Cập nhật state với dữ liệu từ API
      setOrders(ordersRes.data);
      setCustomers(customersRes.data);
      setServices(servicesRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Hàm tính tổng tiền đơn hàng (dịch vụ + sản phẩm)
  const calculateTotalPrice = () => {
    let total = 0;

    // Tìm và cộng giá dịch vụ
    const service = services.find(s => s.id === formData.serviceId);
    if (service) {
      total += service.price;
    }

    // Tìm và cộng giá sản phẩm (nếu có)
    const product = products.find(p => p.id === formData.productId);
    if (product) {
      total += product.price;
    }

    return total;
  };

  // Hàm xử lý submit form (tạo mới hoặc cập nhật đơn hàng)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form: phải có khách hàng và dịch vụ
    if (!formData.customerId || !formData.serviceId) {
      premiumSwal.fire('Lỗi!', 'Vui lòng chọn khách hàng và dịch vụ!', 'error');
      return;
    }

    // Chuẩn bị dữ liệu đơn hàng
    const orderData = {
      ...formData,
      id: editingOrder ? editingOrder.id : 'ORD' + Date.now().toString(36).slice(-8), // ID ngẫu nhiên cho đơn mới
      totalPrice: calculateTotalPrice(), // Tính tổng tiền
      date: formData.date || new Date().toISOString().split('T')[0] // Ngày đơn hàng
    };

    try {
      if (editingOrder) {
        // Cập nhật đơn hàng hiện có
        await axios.put(`http://localhost:5000/orders/${editingOrder.id}`, orderData);
        premiumSwal.fire('Thành công!', 'Cập nhật đơn hàng thành công!', 'success');
      } else {
        // Tạo đơn hàng mới
        await axios.post('http://localhost:5000/orders', orderData);
        premiumSwal.fire('Thành công!', 'Tạo đơn hàng thành công!', 'success');
      }

      // Reset form và fetch lại dữ liệu
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving order:', error);
      premiumSwal.fire('Lỗi!', 'Có lỗi xảy ra khi lưu đơn hàng!', 'error');
    }
  };

  // Hàm xử lý khi nhấn nút sửa
  const handleEdit = (order) => {
    // Đặt đơn hàng đang sửa và điền dữ liệu vào form
    setEditingOrder(order);
    setFormData({
      customerId: order.customerId,
      serviceId: order.serviceId,
      productId: order.productId || '',
      date: order.date
    });
    setShowForm(true); // Hiển thị form
  };

  // Hàm xử lý xóa đơn hàng
  const handleDelete = async (id) => {
    // Tìm thông tin đơn hàng để hiển thị trong dialog xác nhận
    const order = orders.find(o => o.id === id);
    const customerName = getCustomerName(order?.customerId);
    const serviceName = getServiceName(order?.serviceId);

    // Hiển thị dialog xác nhận xóa
    premiumSwal.fire({
      title: 'Xác nhận xóa?',
      html: `Bạn có chắc chắn muốn xóa đơn hàng <strong>#${order?.id || ''}</strong>?<br>
             <small>Khách hàng: ${customerName}</small><br>
             <small>Dịch vụ: ${serviceName}</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý Xóa',
      cancelButtonText: 'Hủy bỏ',
      background: '#1a1a1a',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Gọi API xóa đơn hàng
          await axios.delete(`http://localhost:5000/orders/${id}`);
          premiumSwal.fire('Đã xóa!', 'Đơn hàng đã được xóa thành công.', 'success');
          fetchData(); // Fetch lại dữ liệu
        } catch (error) {
          premiumSwal.fire('Lỗi!', 'Lỗi khi xóa đơn hàng', 'error');
        }
      }
    });
  };

  // Hàm reset form về trạng thái ban đầu
  const resetForm = () => {
    setFormData({
      customerId: '',
      serviceId: '',
      productId: '',
      date: new Date().toISOString().split('T')[0]
    });
    setEditingOrder(null); // Xóa trạng thái edit
    setShowForm(false); // Ẩn form
  };

  // Lọc đơn hàng theo từ khóa tìm kiếm
  const filteredOrders = orders.filter(order => {
    // Tìm thông tin khách hàng và dịch vụ
    const customer = customers.find(c => c.id === order.customerId);
    const service = services.find(s => s.id === order.serviceId);
    const searchLower = searchTerm.toLowerCase();

    // Kiểm tra xem từ khóa có trong tên khách hàng, tên dịch vụ, hoặc ngày không
    return (
      customer?.name.toLowerCase().includes(searchLower) ||
      service?.name.toLowerCase().includes(searchLower) ||
      order.date.includes(searchTerm)
    );
  });
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Hàm lấy tên khách hàng từ ID
  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown';
  };

  // Hàm lấy tên dịch vụ từ ID
  const getServiceName = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Unknown';
  };

  // Hàm lấy tên sản phẩm từ ID
  const getProductName = (productId) => {
    if (!productId) return 'Không có'; // Nếu không có sản phẩm
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown';
  };

  // Render UI component
  return (
    <div className="order-management">
      {/* Header của trang quản lý đơn hàng */}
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">
            <FaFileInvoiceDollar className="title-icon" />
            QUẢN LÝ ĐƠN HÀNG
          </h1>
          <div className="live-badge">LIVE DATA</div>
        </div>
        <div className="header-right">
          <span className="update-info">Cập nhật hệ thống: {new Date().toLocaleDateString('vi-VN')}</span>
          <div className="system-status">
            <FaBolt className="status-icon" />
            <span className="status-text">SYSTEM STATUS:</span>
            <span className="status-value stable">STABLE</span>
          </div>
        </div>
      </div>

      {/* Phần tìm kiếm và tạo đơn hàng mới */}
      <div className="order-actions">
        <div className="search-section">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button
          className="btn-create-order"
          onClick={() => setShowForm(true)}
        >
          <FaPlus /> Tạo Đơn hàng Mới
        </button>
      </div>

      {/* Form tạo/cập nhật đơn hàng (overlay) */}
      {showForm && (
        <div className="order-form-overlay">
          <div className="order-form">
            <h3>{editingOrder ? 'Cập Nhật Đơn hàng' : 'Tạo Đơn hàng Mới'}</h3>
            <form onSubmit={handleSubmit}>
              {/* Chọn khách hàng */}
              <div className="form-group">
                <label>Khách hàng:</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  required
                >
                  <option value="">-- Chọn khách hàng --</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chọn dịch vụ */}
              <div className="form-group">
                <label>Dịch vụ:</label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  required
                >
                  <option value="">-- Chọn dịch vụ --</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {service.price.toLocaleString()} VNĐ
                    </option>
                  ))}
                </select>
              </div>

              {/* Chọn sản phẩm (tùy chọn) */}
              <div className="form-group">
                <label>Sản phẩm (tùy chọn):</label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                >
                  <option value="">-- Không chọn sản phẩm --</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.price.toLocaleString()} VNĐ
                    </option>
                  ))}
                </select>
              </div>

              {/* Chọn ngày */}
              <div className="form-group">
                <label>Ngày:</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              {/* Hiển thị tổng tiền (read-only) */}
              <div className="form-group">
                <label>Tổng tiền:</label>
                <input
                  type="text"
                  value={`${calculateTotalPrice().toLocaleString()} VNĐ`}
                  readOnly
                  className="total-price-display"
                />
              </div>

              {/* Nút hành động */}
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingOrder ? 'Cập Nhật' : 'Tạo Đơn hàng'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Danh sách đơn hàng */}
      <div className="order-list">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Khách hàng</th>
                <th>Dịch vụ</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Ngày</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {/* Hiển thị danh sách đơn hàng đã lọc */}
              {currentOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{getCustomerName(order.customerId)}</td>
                  <td>{getServiceName(order.serviceId)}</td>
                  <td>{getProductName(order.productId)}</td>
                  <td>{order.totalPrice?.toLocaleString()} VNĐ</td>
                  <td>{order.date}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-warning rounded-circle btn-icon-pro"
                        style={{ width: '35px', height: '35px', display: 'inline-flex', alignItems: 'center', justify_content: 'center' }}
                        onClick={() => handleEdit(order)}
                      >
                        <FaEdit size={12} />
                      </button>

                      <button
                        className="btn btn-outline-danger rounded-circle btn-icon-pro"
                        style={{ width: '35px', height: '35px', display: 'inline-flex', alignItems: 'center', justify_content: 'center' }}
                        onClick={() => handleDelete(order.id)}
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="pt-4 d-flex justify-content-center">
            <Pagination className="pagination-luxury">
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        )}
        {/* Hiển thị thông báo khi không có dữ liệu */}
        {filteredOrders.length === 0 && (
          <div className="no-data">
            {searchTerm ? 'Không tìm thấy đơn hàng nào.' : 'Chưa có đơn hàng nào.'}
          </div>
        )}
      </div>

      {/* CSS styles cho component */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;700;900&display=swap');

        /* Styles chính cho container */
        .order-management {
          font-family: 'Montserrat', sans-serif;
          color: #fff;
        }

        /* Header styles */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #333;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #ffc107;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 15px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .title-icon {
          font-size: 2.5rem;
        }

        /* Badge live data */
        .live-badge {
          background: #ffc107;
          color: #000;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }

        .update-info {
          color: #ccc;
          font-size: 0.9rem;
        }

        /* System status */
        .system-status {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid #ffc107;
          border-radius: 25px;
          padding: 8px 20px;
        }

        .status-icon {
          color: #ffc107;
          font-size: 1rem;
        }

        .status-text {
          color: #fff;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .status-value {
          color: #28a745;
          font-weight: 700;
          font-size: 0.9rem;
        }

        /* Phần tìm kiếm và tạo đơn hàng */
        .order-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          gap: 20px;
        }

        /* Search section */
        .search-section {
          display: flex;
          align-items: center;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 25px;
          padding: 10px 20px;
          flex: 1;
          max-width: 400px;
        }

        .search-icon {
          color: #ffc107;
          margin-right: 10px;
          font-size: 1rem;
        }

        .search-input {
          background: transparent;
          border: none;
          color: #fff;
          outline: none;
          flex: 1;
          font-size: 0.9rem;
        }

        .search-input::placeholder {
          color: #666;
        }

        /* Nút tạo đơn hàng */
        .btn-create-order {
          background: #ffc107;
          color: #000;
          border: none;
          border-radius: 25px;
          padding: 12px 25px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.9rem;
        }

        .btn-create-order:hover {
          background: #fff;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3);
        }

        /* Form overlay */
        .order-form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        /* Form styles */
        .order-form {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 30px;
          width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .order-form h3 {
          color: #ffc107;
          margin-top: 0;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Form group styles */
        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #ffc107;
        }

        .form-group select,
        .form-group input {
          width: 100%;
          padding: 12px;
          background: #0d0d0d;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 0.9rem;
        }

        .form-group select:focus,
        .form-group input:focus {
          outline: none;
          border-color: #ffc107;
        }

        /* Total price display */
        .total-price-display {
          background: #0d0d0d;
          color: #28a745;
          font-weight: bold;
        }

        /* Form actions */
        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .form-actions button {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .form-actions button[type="submit"] {
          background: #ffc107;
          color: #000;
        }

        .form-actions button[type="button"] {
          background: #666;
          color: #fff;
        }

        /* Data table container */
        .data-table-container {
          background: #1a1a1a;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #333;
        }

        /* Data table styles */
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th,
        .data-table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #333;
        }

        .data-table th {
          background: #0d0d0d;
          font-weight: 600;
          color: #ffc107;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 1px;
        }

        .data-table td {
          color: #fff;
        }

        .data-table tr:hover {
          background: rgba(255, 193, 7, 0.1);
        }

        /* Action buttons */
        .btn-action {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          margin-right: 5px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .btn-edit {
          background: #ffc107;
          color: #000;
        }

        .btn-delete {
          background: #dc3545;
          color: #fff;
        }

        /* No data message */
        .no-data {
          text-align: center;
          padding: 40px;
          color: #666;
          font-style: italic;
        }
        .pagination-luxury { 
          display: inline-flex;
          border-radius: 12px;
          overflow: hidden; 
          border: 1px solid rgba(255, 193, 7, 0.2) !important;
          margin-top: 20px;
      }

      .pagination-luxury .page-link { 
          background: #0d0d0d !important; 
          color: #fff !important; 
          margin: 0 !important; 
          padding: 10px 20px !important;
          border: none !important;
          border-right: 1px solid rgba(255, 193, 7, 0.1) !important;
          border-radius: 0 !important;
          transition: all 0.3s;
      }

      .pagination-luxury .page-item:last-child .page-link {
          border-right: none !important;
      }

      .pagination-luxury .page-item.active .page-link { 
          background: #ffc107 !important; 
          color: #000 !important; 
          font-weight: 800 !important;
      }

      .pagination-luxury .page-link:hover:not(.active) { 
          background: rgba(255, 193, 7, 0.2) !important;
      }
      `}</style>
    </div>
  );
};

export default Order;
