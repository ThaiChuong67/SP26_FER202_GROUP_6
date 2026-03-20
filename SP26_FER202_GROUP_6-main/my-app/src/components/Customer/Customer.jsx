import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Form, InputGroup, Table, Card } from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchPhone, setSearchPhone] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  const premiumSwal = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-warning btn-lg px-5 fw-bold rounded-3 shadow-sm text-dark ms-3',
      cancelButton: 'btn btn-outline-light btn-lg px-4 fw-bold rounded-3'
    },
    buttonsStyling: false
  });

  // Fetch customers from API
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

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Email validation regex - chỉ cho phép ký tự hợp lệ
  const validateEmail = (email) => {
    // Chỉ cho phép letters, numbers, @, ., -, _ 
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate tên khách hàng
    if (!formData.name || formData.name.trim().length < 2) {
      premiumSwal.fire('Lỗi!', 'Tên khách hàng phải có ít nhất 2 ký tự!', 'error');
      return;
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      premiumSwal.fire('Lỗi!', 'Email không đúng định dạng!', 'error');
      return;
    }

    // Validate phone - chỉ cho phép số và độ dài 10-11
    if (!validatePhone(formData.phone)) {
      premiumSwal.fire('Lỗi!', 'Số điện thoại chỉ được chứa ký tự số!', 'error');
      return;
    }

    if (formData.phone.length < 10 || formData.phone.length > 11) {
      premiumSwal.fire('Lỗi!', 'Số điện thoại phải có 10-11 chữ số!', 'error');
      return;
    }

    // Kiểm tra trùng số điện thoại và email khi thêm mới
    if (!editingCustomer) {
      const existingCustomerByPhone = customers.find(customer => customer.phone === formData.phone);
      if (existingCustomerByPhone) {
        premiumSwal.fire('Lỗi!', 'Số điện thoại này đã tồn tại trong hệ thống!', 'error');
        return;
      }

      const existingCustomerByEmail = customers.find(customer => customer.email === formData.email);
      if (existingCustomerByEmail) {
        premiumSwal.fire('Lỗi!', 'Email này đã tồn tại trong hệ thống!', 'error');
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
      fetchCustomers();
    } catch (error) {
      premiumSwal.fire('Lỗi!', 'Lỗi khi lưu khách hàng', 'error');
    }
  };

  // Handle delete
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

  // Handle edit
  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setModalVisible(true);
  };

  // Handle add new
  const handleAdd = () => {
    setEditingCustomer(null);
    setFormData({ name: '', phone: '', email: '' });
    setModalVisible(true);
  };

  // Handle search input change - chỉ cho phép số
  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (value === '' || validatePhone(value)) {
      setSearchPhone(value);
    }
  };

  // Filter customers by phone
  const filteredCustomers = customers.filter(customer =>
    customer.phone.includes(searchPhone)
  );

  // Phone validation - chỉ cho phép số
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]+$/;
    return phoneRegex.test(phone);
  };

  // Handle input change with validation
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
      `}</style>

      <Container fluid className="customer-wrapper">
        <Row>
          <Col>
            <Card className="luxury-card h-100">
              <Card.Body className="p-4 position-relative z-10">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                  <h5 className="mb-0 fw-bold text-uppercase d-flex align-items-center text-white">
                    <FaUser className="me-2 text-warning" /> Quản lý Khách hàng
                  </h5>

                  <div className="d-flex gap-2 align-items-center">
                    <InputGroup style={{ width: '320px' }}>
                      <InputGroup.Text><FaSearch /></InputGroup.Text>
                      <Form.Control
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Tìm kiếm theo số điện thoại"
                        className="dark-input"
                        value={searchPhone}
                        onChange={handleSearchChange}
                      />
                    </InputGroup>
                    
                    <Button variant="warning" onClick={handleAdd}>
                      <FaPlus className="me-2 mb-1" /> Thêm khách hàng
                    </Button>
                  </div>
                </div>

                {/* Customers Table */}
                {loading ? (
                  <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '400px' }}>
                    <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <h6 className="text-warning mt-4 tracking-widest text-uppercase" style={{ letterSpacing: '3px' }}>ĐANG TẢI DỮ LIỆU...</h6>
                  </div>
                ) : (
                  <Table responsive hover className="luxury-table align-middle">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Họ và tên</th>
                        <th>Số điện thoại</th>
                        <th>Email</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-5 text-white-50 fw-bold">
                            {searchPhone ? 'Không tìm thấy khách hàng' : 'Chưa có dữ liệu khách hàng'}
                          </td>
                        </tr>
                      ) : (
                        filteredCustomers.map((customer) => (
                          <tr key={customer.id}>
                            <td className="fw-bold text-warning">#{customer.id}</td>
                            <td className="fw-semibold">{customer.name}</td>
                            <td>{customer.phone}</td>
                            <td>{customer.email}</td>
                            <td>
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
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Add/Edit Modal */}
        <Modal show={modalVisible} onHide={() => {
          setModalVisible(false);
          setEditingCustomer(null);
          setFormData({ name: '', phone: '', email: '' });
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
                  className="dark-input"
                  required
                />
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
                  className="dark-input"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="label-vip text-uppercase">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                  className="dark-input"
                  required
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setModalVisible(false);
              setEditingCustomer(null);
              setFormData({ name: '', phone: '', email: '' });
            }}>
              Hủy
            </Button>
            <Button variant="warning" onClick={handleSubmit}>
              {editingCustomer ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default Customer;
