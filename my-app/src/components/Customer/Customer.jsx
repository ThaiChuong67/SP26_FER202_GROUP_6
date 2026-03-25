import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Button, Modal, Form, InputGroup, Table, Card, Pagination } from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaUser, FaEye, FaFileExport, FaCheckSquare, FaSquare } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

const Customer = () => {
  // ============= STATE MANAGEMENT =============
  const [customers, setCustomers] = useState([]); // Danh sách khách hàng từ API
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [modalVisible, setModalVisible] = useState(false); // Modal thêm/sửa khách hàng
  const [detailModalVisible, setDetailModalVisible] = useState(false); // Modal xem chi tiết
  const [editingCustomer, setEditingCustomer] = useState(null); // Khách hàng đang sửa
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Khách hàng đang xem chi tiết
  const [searchQuery, setSearchQuery] = useState(''); // Từ khóa tìm kiếm
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' }); // Dữ liệu form
  const [selectedCustomers, setSelectedCustomers] = useState([]); // Danh sách khách hàng đã chọn (bulk operations)
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage, setItemsPerPage] = useState(10); // Số item mỗi trang
  const [sortField, setSortField] = useState('id'); // Trường đang sắp xếp
  const [sortDirection, setSortDirection] = useState('asc'); // Chiều sắp xếp (asc/desc)
  const [formErrors, setFormErrors] = useState({}); // Lỗi form validation

  const premiumSwal = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-warning btn-lg px-5 fw-bold rounded-3 shadow-sm text-dark ms-3',
      cancelButton: 'btn btn-outline-light btn-lg px-4 fw-bold rounded-3'
    },
    buttonsStyling: false
  });

  // ============= API FUNCTIONS =============
  // Fetch customers từ API
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/customers');
      setCustomers(response.data);
    } catch (error) {
      premiumSwal.fire('Lỗi!', 'Lỗi khi tải danh sách khách hàng', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ============= VALIDATION FUNCTIONS =============
  // Email validation regex - chỉ cho phép ký tự hợp lệ
  const validateEmail = (email) => {
    // Chỉ cho phép letters, numbers, @, ., -, _ 
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  // Phone validation - chỉ cho phép số
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]+$/;
    return phoneRegex.test(phone);
  };

  // ============= FORM HANDLERS =============
  // Handle form submit với enhanced validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setFormErrors({});
    
    const errors = {};
    
    // Validate tên khách hàng
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Tên khách hàng phải có ít nhất 2 ký tự!';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Tên khách hàng không được quá 100 ký tự!';
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      errors.email = 'Email không đúng định dạng!';
    }

    // Validate phone - chỉ cho phép số và độ dài 10-11
    if (!validatePhone(formData.phone)) {
      errors.phone = 'Số điện thoại chỉ được chứa ký tự số!';
    } else if (formData.phone.length < 10 || formData.phone.length > 11) {
      errors.phone = 'Số điện thoại phải có 10-11 chữ số!';
    }

    // If there are errors, set them and return
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Kiểm tra trùng số điện thoại và email khi thêm mới
    if (!editingCustomer) {
      const existingCustomerByPhone = customers.find(customer => customer.phone === formData.phone);
      if (existingCustomerByPhone) {
        errors.phone = 'Số điện thoại này đã tồn tại trong hệ thống!';
      }

      const existingCustomerByEmail = customers.find(customer => customer.email === formData.email);
      if (existingCustomerByEmail) {
        errors.email = 'Email này đã tồn tại trong hệ thống!';
      }
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
    }

    try {
      if (editingCustomer) {
        // Update existing customer
        await axios.put(`http://localhost:5000/customers/${editingCustomer.id}`, formData);
        premiumSwal.fire('Thành công!', 'Cập nhật khách hàng thành công!', 'success');
      } else {
        // Add new customer
        await axios.post('http://localhost:5000/customers', formData);
        premiumSwal.fire('Thành công!', 'Thêm khách hàng thành công!', 'success');
      }
      
      setModalVisible(false);
      setEditingCustomer(null);
      setFormData({ name: '', phone: '', email: '' });
      setFormErrors({});
      fetchCustomers();
    } catch (error) {
      premiumSwal.fire('Lỗi!', 'Lỗi khi lưu khách hàng', 'error');
    }
  };

  // Handle delete khách hàng
  const handleDelete = async (id) => {
    const customer = customers.find(c => c.id === id);
    
    premiumSwal.fire({
      title: 'Xác nhận xóa?',
      html: `Bạn có chắc chắn muốn xóa khách hàng <strong>${customer?.name || ''}</strong>?<br><small>Số điện thoại: ${customer?.phone || ''}</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý Xóa',
      cancelButtonText: 'Hủy bỏ',
      background: '#1a1a1a',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/customers/${id}`);
          premiumSwal.fire('Đã xóa!', 'Khách hàng đã được xóa thành công.', 'success');
          fetchCustomers();
        } catch (error) {
          premiumSwal.fire('Lỗi!', 'Lỗi khi xóa khách hàng', 'error');
        }
      }
    });
  };

  // Handle edit khách hàng
  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setModalVisible(true);
  };

  // Handle add new khách hàng
  const handleAdd = () => {
    setEditingCustomer(null);
    setFormData({ name: '', phone: '', email: '' });
    setFormErrors({});
    setModalVisible(true);
  };

  // ============= SEARCH & SORT =============
  // Enhanced search handlers - tìm kiếm theo tên hoặc SĐT
  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  // Handle sort sắp xếp dữ liệu
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // ============= DATA PROCESSING =============
  // Enhanced search functionality - lọc khách hàng theo từ khóa
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const query = searchQuery.toLowerCase();
      const matchesPhone = customer.phone.includes(searchQuery);
      const matchesName = customer.name.toLowerCase().includes(query);
      return matchesPhone || matchesName;
    });
  }, [customers, searchQuery]);

  // Sort customers - sắp xếp dữ liệu đã lọc
  const sortedCustomers = useMemo(() => {
    return [...filteredCustomers].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredCustomers, sortField, sortDirection]);

  // Pagination - phân trang dữ liệu
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedCustomers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);

  // ============= VALIDATION & INPUT =============
  // Handle input change with validation - xử lý input với validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Nếu là phone field, chỉ cho phép nhập số
    if (name === 'phone') {
      if (value === '' || validatePhone(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } 
    // Nếu là email field, chỉ cho phép ký tự hợp lệ
    else if (name === 'email') {
      // Cho phép nhập ký tự hợp lệ cho email
      const validEmailChars = /^[a-zA-Z0-9@._%+-]*$/;
      if (value === '' || validEmailChars.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
    // Nếu là name field, chỉ cho phép letters và khoảng trắng
    else if (name === 'name') {
      // Cho phép nhập letters, spaces, và ký tự tiếng Việt
      const validNameChars = /^[a-zA-ZàáạảãăằắẳẵằẳấâầấậẫẫêềếệễễôồốổỗỗơờớởỡỡùúủũũưừứửữựỳýỷỹỵĂÂÊÔƠƯĐ\s]*$/;
      if (value === '' || validNameChars.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // ============= BULK OPERATIONS =============
  // Handle view details - xem chi tiết khách hàng
  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setDetailModalVisible(true);
  };

  // Handle bulk delete - xóa hàng loạt khách hàng
  const handleBulkDelete = async () => {
    if (selectedCustomers.length === 0) {
      premiumSwal.fire('Thông báo!', 'Vui lòng chọn ít nhất một khách hàng để xóa.', 'info');
      return;
    }

    premiumSwal.fire({
      title: 'Xác nhận xóa hàng loạt?',
      html: `Bạn có chắc chắn muốn xóa <strong>${selectedCustomers.length}</strong> khách hàng đã chọn?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý Xóa',
      cancelButtonText: 'Hủy bỏ',
      background: '#1a1a1a',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Promise.all(
            selectedCustomers.map(id => axios.delete(`http://localhost:5000/customers/${id}`))
          );
          premiumSwal.fire('Đã xóa!', `Đã xóa thành công ${selectedCustomers.length} khách hàng.`, 'success');
          setSelectedCustomers([]);
          fetchCustomers();
        } catch (error) {
          premiumSwal.fire('Lỗi!', 'Lỗi khi xóa khách hàng', 'error');
        }
      }
    });
  };

  // Handle select all - chọn tất cả khách hàng trên trang
  const handleSelectAll = () => {
    if (selectedCustomers.length === paginatedCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(paginatedCustomers.map(customer => customer.id));
    }
  };

  // ============= EXPORT FUNCTIONS =============
  // Handle export CSV - xuất dữ liệu ra file CSV
  const handleExportCSV = () => {
    if (sortedCustomers.length === 0) {
      premiumSwal.fire('Thông báo!', 'Không có dữ liệu để xuất.', 'info');
      return;
    }

    premiumSwal.fire({
      title: 'Xác nhận xuất CSV?',
      html: `Bạn có chắc chắn muốn xuất <strong>${sortedCustomers.length}</strong> khách hàng ra file CSV?<br><small>Dữ liệu sẽ bao gồm các khách hàng đã lọc và sắp xếp hiện tại.</small>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý Xuất',
      cancelButtonText: 'Hủy bỏ',
      background: '#1a1a1a',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        performExportCSV();
      }
    });
  };

  // Perform the actual CSV export - thực hiện xuất CSV
  const performExportCSV = () => {
    const dataToExport = sortedCustomers.map(customer => ({
      ID: customer.id,
      'Họ và tên': customer.name,
      'Số điện thoại': customer.phone,
      'Email': customer.email
    }));

    // Convert to CSV
    const headers = Object.keys(dataToExport[0] || {});
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(row => 
        headers.map(header => `"${row[header]}"`).join(',')
      )
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    premiumSwal.fire('Thành công!', `Đã xuất thành công ${sortedCustomers.length} khách hàng ra file CSV.`, 'success');
  };

  // Handle select individual - chọn/bỏ chọn một khách hàng
  const handleSelectCustomer = (id) => {
    setSelectedCustomers(prev => 
      prev.includes(id) 
        ? prev.filter(customerId => customerId !== id)
        : [...prev, id]
    );
  };

  // ============= EFFECTS =============
  // Initial data fetch
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;700;900&display=swap');

        .customer-wrapper { font-family: 'Montserrat', sans-serif; background: transparent; }
        
        /* LUXURY CARD BASE */
        .luxury-card {
          background: rgba(15, 15, 15, 0.6) !important;
          backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 35px !important; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .luxury-card:hover { transform: translateY(-5px); border-color: rgba(255, 193, 7, 0.3) !important; box-shadow: 0 20px 40px rgba(0,0,0,0.6) !important; }

        .label-vip { color: rgba(255,255,255,0.3); font-size: 0.7rem; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; }
        
        /* Dark Input Styles */
        .dark-input {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: #fff !important;
          border-radius: 25px !important;
          padding: 12px 20px !important;
          transition: all 0.3s ease !important;
        }
        .dark-input:focus {
          background: rgba(255,255,255,0.08) !important;
          border-color: #ffc107 !important;
          box-shadow: 0 0 15px rgba(255, 193, 7, 0.2) !important;
          color: #fff !important;
        }
        .dark-input::placeholder { color: rgba(255,255,255,0.4) !important; }

        /* Luxury Table */
        .luxury-table {
          background: transparent !important;
          color: #fff !important;
        }
        .luxury-table thead th {
          background: rgba(255,255,255,0.05) !important;
          color: #ffc107 !important;
          border: none !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
          font-size: 0.85rem !important;
          padding: 15px !important;
        }
        .luxury-table tbody td {
          background: rgba(255,255,255,0.02) !important;
          color: rgba(255,255,255,0.8) !important;
          border: 1px solid rgba(255,255,255,0.05) !important;
          padding: 15px !important;
          vertical-align: middle !important;
        }
        .luxury-table tbody tr:hover td {
          background: rgba(255,255,255,0.06) !important;
          color: #fff !important;
        }

        /* Button Styles */
        .btn-warning {
          background: linear-gradient(135deg, #ffc107, #ffca2c) !important;
          border: none !important;
          color: #000 !important;
          font-weight: 700 !important;
          border-radius: 25px !important;
          padding: 12px 25px !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3) !important;
        }
        .btn-warning:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px rgba(255, 193, 7, 0.5) !important;
          background: linear-gradient(135deg, #ffca2c, #ffc107) !important;
        }

        .btn-outline-primary {
          border-color: #ffc107 !important;
          color: #ffc107 !important;
          background: transparent !important;
          border-radius: 20px !important;
          padding: 8px 15px !important;
          transition: all 0.3s ease !important;
        }
        .btn-outline-primary:hover {
          background: #ffc107 !important;
          color: #000 !important;
          transform: scale(1.05) !important;
        }

        .btn-outline-danger {
          border-color: #dc3545 !important;
          color: #dc3545 !important;
          background: transparent !important;
          border-radius: 20px !important;
          padding: 8px 15px !important;
          transition: all 0.3s ease !important;
        }
        .btn-outline-danger:hover {
          background: #dc3545 !important;
          color: #fff !important;
          transform: scale(1.05) !important;
        }

        /* Modal Dark Theme */
        .modal-content {
          background: #0d0d0d !important;
          border: 1px solid rgba(255, 193, 7, 0.3) !important;
          border-radius: 25px !important;
        }
        .modal-header {
          background: transparent !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .modal-title {
          color: #ffc107 !important;
          font-weight: 700 !important;
        }
        .btn-close {
          filter: invert(1) !important;
        }

        /* Input Group */
        .input-group-text {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: #ffc107 !important;
          border-radius: 25px 0 0 25px !important;
          border-right: none !important;
        }
        .dark-input {
          border-left: none !important;
          border-radius: 0 25px 25px 0 !important;
        }

        /* MODAL STYLES */
        .modal.show {
          display: block !important;
          z-index: 9999 !important;
        }
        
        .modal-backdrop.show {
          z-index: 9998 !important;
        }

        .modal-content {
          z-index: 10000 !important;
          position: relative !important;
        }
      `}</style>

      <Container fluid className="customer-wrapper">
        <Row>
          <Col>
            <Card className="luxury-card h-100">
              <Card.Body className="p-4 position-relative z-10">
                {/* Header với tìm kiếm và các nút action */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0 fw-bold text-uppercase d-flex align-items-center text-white">
                    <FaUser className="me-2 text-warning" /> Quản lý Khách hàng
                  </h5>

                  <div className="d-flex gap-2 align-items-center">
                    <InputGroup style={{ width: '450px' }}>
                      <InputGroup.Text><FaSearch /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc số điện thoại"
                        className="dark-input"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                      />
                    </InputGroup>
                    
                    <Button variant="outline-primary" onClick={handleExportCSV}>
                      <FaFileExport className="me-2" /> Xuất CSV
                    </Button>
                    
                    <Button variant="warning" onClick={handleAdd}>
                      <FaPlus className="me-2 mb-1" /> Thêm khách hàng
                    </Button>
                  </div>
                </div>

                  {/* Bulk Actions - hành động hàng loạt */}
                {selectedCustomers.length > 0 && (
                  <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-warning bg-opacity-10 rounded-3">
                    <div className="text-white">
                      <span className="me-3 text-white">Đã chọn {selectedCustomers.length} khách hàng</span>
                      <Button variant="outline-danger" size="sm" onClick={handleBulkDelete}>
                        <FaTrash className="me-2" />Xóa đã chọn
                      </Button>
                    </div>
                    <Button variant="outline-secondary" size="sm" onClick={() => setSelectedCustomers([])}>
                      <span className="text-white">Bỏ chọn</span>
                    </Button>
                  </div>
                )}

                  {/* Customers Table - bảng dữ liệu khách hàng */}
                {loading ? (
                  <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '400px' }}>
                    <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <h6 className="text-warning mt-4 tracking-widest text-uppercase" style={{ letterSpacing: '3px' }}>ĐANG TẢI DỮ LIỆU...</h6>
                  </div>
                ) : (
                  <>
                  <Table responsive hover className="luxury-table align-middle">
                    <thead>
                      <tr>
                        <th style={{ width: '50px' }}>
                          <Button variant="link" className="text-warning p-0" onClick={handleSelectAll}>
                            {selectedCustomers.length === paginatedCustomers.length && paginatedCustomers.length > 0 ? 
                              <FaCheckSquare /> : <FaSquare />}
                          </Button>
                        </th>
                        <th>ID</th>
                        <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                          Họ và tên {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th>Số điện thoại</th>
                        <th>Email</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCustomers.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-5 text-white-50 fw-bold">
                            {(searchQuery) ? 'Không tìm thấy khách hàng' : 'Chưa có dữ liệu khách hàng'}
                          </td>
                        </tr>
                      ) : (
                        paginatedCustomers.map((customer) => (
                          <tr key={customer.id}>
                            <td>
                              <Button variant="link" className="text-warning p-0" onClick={() => handleSelectCustomer(customer.id)}>
                                {selectedCustomers.includes(customer.id) ? <FaCheckSquare /> : <FaSquare />}
                              </Button>
                            </td>
                            <td className="fw-bold text-warning">#{customer.id}</td>
                            <td className="fw-semibold">{customer.name}</td>
                            <td>{customer.phone}</td>
                            <td>{customer.email}</td>
                            <td>
                              <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleViewDetails(customer)}>
                                <FaEye />
                              </Button>
                              <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(customer)}>
                                <FaEdit />
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => handleDelete(customer.id)}>
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>

                  {/* Pagination controls - điều khiển phân trang */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="text-warning fw-bold" style={{ fontSize: '16px' }}>
                          Hiển thị {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, sortedCustomers.length)} của {sortedCustomers.length} khách hàng
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-warning fw-bold" style={{ fontSize: '16px' }}>Hiển thị:</span>
                          <Form.Select 
                            value={itemsPerPage} 
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            style={{ width: '80px' }}
                            className="dark-input"
                          >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                          </Form.Select>
                        </div>
                      </div>
                      <Pagination className="mb-0">
                        <Pagination.Prev 
                          disabled={currentPage === 1} 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        />
                        {[...Array(totalPages)].map((_, index) => (
                          <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </Pagination.Item>
                        ))}
                        <Pagination.Next 
                          disabled={currentPage === totalPages} 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        />
                      </Pagination>
                    </div>
                  )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Add/Edit Modal - modal thêm/sửa khách hàng */}
        <Modal show={modalVisible} onHide={() => {
          setModalVisible(false);
          setEditingCustomer(null);
          setFormData({ name: '', phone: '', email: '' });
          setFormErrors({});
        }}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingCustomer ? 'Sửa khách hàng' : 'Thêm khách hàng mới'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="label-vip text-uppercase">Họ và tên</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên khách hàng"
                  className={`dark-input ${formErrors.name ? 'is-invalid' : ''}`}
                  required
                />
                {formErrors.name && (
                  <div className="invalid-feedback d-block text-danger">
                    {formErrors.name}
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="label-vip text-uppercase">Số điện thoại</Form.Label>
                <Form.Control
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  className={`dark-input ${formErrors.phone ? 'is-invalid' : ''}`}
                  required
                />
                {formErrors.phone && (
                  <div className="invalid-feedback d-block text-danger">
                    {formErrors.phone}
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="label-vip text-uppercase">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                  className={`dark-input ${formErrors.email ? 'is-invalid' : ''}`}
                  required
                />
                {formErrors.email && (
                  <div className="invalid-feedback d-block text-danger">
                    {formErrors.email}
                  </div>
                )}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setModalVisible(false);
              setEditingCustomer(null);
              setFormData({ name: '', phone: '', email: '' });
              setFormErrors({});
            }}>
              Hủy
            </Button>
            <Button variant="warning" onClick={handleSubmit}>
              {editingCustomer ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Customer Details Modal - modal xem chi tiết khách hàng */}
        <Modal show={detailModalVisible} onHide={() => setDetailModalVisible(false)} size="lg" style={{ zIndex: 9999 }}>
          <Modal.Header className="bg-dark border-warning">
            <Modal.Title className="text-warning fw-bold">
              <FaUser className="me-2" />Chi tiết khách hàng
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark">
            {selectedCustomer && (
              <div className="p-3">
                <div className="row">
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="text-warning fw-bold small mb-2 d-block">
                        ID Khách hàng
                      </label>
                      <div className="text-white fs-5">#{selectedCustomer.id}</div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="text-warning fw-bold small mb-2 d-block">
                        Họ và tên
                      </label>
                      <div className="text-white fs-5">{selectedCustomer.name}</div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="text-warning fw-bold small mb-2 d-block">
                          Số điện thoại
                        </label>
                        <div className="text-white fs-5">{selectedCustomer.phone}</div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label className="text-warning fw-bold small mb-2 d-block">
                          Email
                        </label>
                        <div className="text-white fs-5">{selectedCustomer.email}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="bg-dark border-warning">
            <Button variant="secondary" onClick={() => setDetailModalVisible(false)}>
              Đóng
            </Button>
            <Button variant="warning" onClick={() => {
              setDetailModalVisible(false);
              handleEdit(selectedCustomer);
            }}>
              <FaEdit className="me-2" />Sửa thông tin
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default Customer;
