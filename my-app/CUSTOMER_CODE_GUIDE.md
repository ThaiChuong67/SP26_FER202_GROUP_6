# 📋 Customer Component - Code Guide (Hướng dẫn Code)

## 🎯 **Tổng quan Component (Component Overview)**
- **File:** `src/components/Customer/Customer.jsx`
- **Mục đích:** Quản lý khách hàng (CRUD, tìm kiếm, phân trang, xuất CSV)
- **Framework:** React với Bootstrap 5
- **API:** `http://localhost:5000/customers`

---

## 🔍 **CÁC PHẦN CODE CHÍNH (MAIN CODE SECTIONS)**

### 📂 **1. IMPORTS & DECLARATION (Nhập khẩu & Khai báo)**
```javascript
// Dòng 1-5: Imports cần thiết (Required imports)
import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Button, Modal, Form, InputGroup, Table, Card, Pagination } from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaUser, FaEye, FaFileExport, FaCheckSquare, FaSquare } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

// Dòng 7: Component declaration (Khai báo component)
const Customer = () => {
```

### 🗂️ **2. STATE MANAGEMENT (Quản lý trạng thái)** (Dòng 8-22)
```javascript
// Dòng 8-22: Tất cả state variables (Tất cả biến trạng thái)
const [customers, setCustomers] = useState([]); // Danh sách khách hàng (Customer list)
const [loading, setLoading] = useState(false); // Loading state (Trạng thái tải)
const [modalVisible, setModalVisible] = useState(false); // Modal thêm/sửa (Add/Edit modal)
const [detailModalVisible, setDetailModalVisible] = useState(false); // Modal chi tiết (Details modal)
const [editingCustomer, setEditingCustomer] = useState(null); // Khách hàng đang sửa (Editing customer)
const [selectedCustomer, setSelectedCustomer] = useState(null); // Khách hàng đang xem (Selected customer)
const [searchQuery, setSearchQuery] = useState(''); // Từ khóa tìm kiếm (Search keyword)
const [formData, setFormData] = useState({ name: '', phone: '', email: '' }); // Form data (Dữ liệu form)
const [selectedCustomers, setSelectedCustomers] = useState([]); // Bulk selection (Chọn hàng loạt)
const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại (Current page)
const [itemsPerPage, setItemsPerPage] = useState(10); // Item/trang (Items per page)
const [sortField, setSortField] = useState('id'); // Trường sắp xếp (Sort field)
const [sortDirection, setSortDirection] = useState('asc'); // Chiều sắp xếp (Sort direction)
const [formErrors, setFormErrors] = useState({}); // Lỗi form (Form errors)
```

### ⚙️ **3. CONFIGURATION (Cấu hình)** (Dòng 24-30)
```javascript
// Dòng 24-30: SweetAlert configuration (Cấu hình SweetAlert)
const premiumSwal = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-warning btn-lg px-5 fw-bold rounded-3 shadow-sm text-dark ms-3',
    cancelButton: 'btn btn-outline-light btn-lg px-4 fw-bold rounded-3'
  },
  buttonsStyling: false
});
```

### 🌐 **4. API FUNCTIONS (Hàm API)** (Dòng 32-44)
```javascript
// Dòng 32-44: Fetch customers từ API (Lấy dữ liệu khách hàng từ API)
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
```

### ✅ **5. VALIDATION FUNCTIONS (Hàm kiểm tra)** (Dòng 46-58)
```javascript
// Dòng 46-52: Email validation (Kiểm tra email)
const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

// Dòng 54-58: Phone validation (Kiểm tra số điện thoại)
const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]+$/;
  return phoneRegex.test(phone);
};
```

### 📝 **6. FORM HANDLERS (Xử lý form)** (Dòng 60-130)
```javascript
// Dòng 60-130: Handle form submit với validation (Xử lý gửi form với kiểm tra)
const handleSubmit = async (e) => {
  // Validation logic (Logic kiểm tra)
  // API call (Gọi API)
  // Error handling (Xử lý lỗi)
};

// Dòng 230-260: Handle input change với validation (Xử lý thay đổi input với kiểm tra)
const handleInputChange = (e) => {
  // Phone number validation (Kiểm tra SĐT)
  // Email validation (Kiểm tra email)  
  // Name validation (Kiểm tra tên)
};
```

### 🗑️ **7. CRUD HANDLERS (Xử lý CRUD)** (Dòng 132-171)
```javascript
// Dòng 132-156: Handle delete khách hàng (Xử lý xóa khách hàng)
const handleDelete = async (id) => {
  // SweetAlert confirmation (Xác nhận SweetAlert)
  // DELETE API call (Gọi API DELETE)
};

// Dòng 158-163: Handle edit khách hàng (Xử lý sửa khách hàng)
const handleEdit = (customer) => {
  // Set editing customer (Đặt khách hàng đang sửa)
  // Open modal (Mở modal)
};

// Dòng 165-171: Handle add new khách hàng (Xử lý thêm khách hàng mới)
const handleAdd = () => {
  // Reset form (Reset lại form)
  // Open modal (Mở modal)
};
```

### 🔍 **8. SEARCH & SORT (Tìm kiếm & Sắp xếp)** (Dòng 173-187)
```javascript
// Dòng 173-177: Enhanced search handlers (Xử lý tìm kiếm nâng cao)
const handleSearchChange = (value) => {
  setSearchQuery(value);
};

// Dòng 179-187: Handle sort sắp xếp dữ liệu (Xử lý sắp xếp dữ liệu)
const handleSort = (field) => {
  // Toggle sort direction (Đảo chiều sắp xếp)
  // Set sort field (Đặt trường sắp xếp)
};
```

### 📊 **9. DATA PROCESSING (Xử lý dữ liệu)** (Dòng 189-227)
```javascript
// Dòng 189-198: Enhanced search functionality (Chức năng tìm kiếm nâng cao)
const filteredCustomers = useMemo(() => {
  // Filter by name OR phone (Lọc theo tên HOẶC SĐT)
}, [customers, searchQuery]);

// Dòng 200-217: Sort customers (Sắp xếp khách hàng)
const sortedCustomers = useMemo(() => {
  // Sort by field and direction (Sắp xếp theo trường và chiều)
}, [filteredCustomers, sortField, sortDirection]);

// Dòng 221-225: Pagination (Phân trang)
const paginatedCustomers = useMemo(() => {
  // Slice data for current page (Cắt dữ liệu cho trang hiện tại)
}, [sortedCustomers, currentPage, itemsPerPage]);
```

### 🔄 **10. BULK OPERATIONS (Thao tác hàng loạt)** (Dòng 270-377)
```javascript
// Dòng 270-275: Handle view details (Xử lý xem chi tiết)
const handleViewDetails = (customer) => {
  // Set selected customer (Đặt khách hàng được chọn)
  // Show detail modal (Hiển thị modal chi tiết)
};

// Dòng 277-307: Handle bulk delete (Xử lý xóa hàng loạt)
const handleBulkDelete = async () => {
  // Delete multiple customers (Xóa nhiều khách hàng)
};

// Dòng 309-316: Handle select all (Xử lý chọn tất cả)
const handleSelectAll = () => {
  // Select/deselect all on page (Chọn/bỏ chọn tất cả trên trang)
};

// Dòng 370-377: Handle select individual (Xử lý chọn từng cái)
const handleSelectCustomer = (id) => {
  // Toggle individual selection (Chuyển đổi lựa chọn cá nhân)
};
```

### 📤 **11. EXPORT FUNCTIONS (Hàm xuất)** (Dòng 318-372)
```javascript
// Dòng 318-340: Handle export CSV với confirmation (Xử lý xuất CSV với xác nhận)
const handleExportCSV = () => {
  // SweetAlert confirmation (Xác nhận SweetAlert)
  // Call performExportCSV (Gọi hàm xuất CSV)
};

// Dòng 342-372: Perform actual CSV export (Thực hiện xuất CSV thực tế)
const performExportCSV = () => {
  // Convert data to CSV (Chuyển dữ liệu sang CSV)
  // Download file (Tải file)
};
```

### ⚡ **12. EFFECTS (Hiệu ứng)** (Dòng 379-388)
```javascript
// Dòng 379-383: Initial data fetch (Lấy dữ liệu ban đầu)
useEffect(() => {
  fetchCustomers();
}, []);

// Dòng 385-388: Reset pagination when filters change (Reset phân trang khi bộ lọc thay đổi)
useEffect(() => {
  setCurrentPage(1);
}, [searchQuery, itemsPerPage]);
```

### 🎨 **13. RENDER UI (Hiển thị giao diện)** (Dòng 390-855)
```javascript
// Dòng 390-534: CSS Styles (Kiểu CSS)
// Dòng 536-695: Main container với header, search, table (Container chính với header, tìm kiếm, bảng)
// Dòng 697-782: Add/Edit Modal (Modal thêm/sửa)
// Dòng 784-855: Customer Details Modal (Modal chi tiết khách hàng)
```

---

## 🎯 **CÁC CHỨC NĂNG CHÍNH (MAIN FEATURES)**

### 🔍 **TÌM KIẾM (SEARCH)**
- **Code:** `handleSearchChange` (Dòng 173-177)
- **Logic:** Tìm theo tên HOẶC SĐT (Search by name OR phone)
- **UI:** Search bar ở header (Thanh tìm kiếm ở header)

### 📊 **PHÂN TRANG (PAGINATION)**
- **Code:** `paginatedCustomers` (Dòng 221-225)
- **Logic:** Slice data theo trang (Cắt dữ liệu theo trang)
- **UI:** Bootstrap Pagination component

### 🔄 **SẮP XẾP (SORTING)**
- **Code:** `handleSort` (Dòng 179-187)
- **Logic:** Chỉ sắp xếp theo tên (Only sort by name)
- **UI:** Click header "Họ và tên" (Click on "Họ và tên" header)

### ✏️ **THÊM/SỬA (ADD/EDIT)**
- **Code:** `handleSubmit` (Dòng 60-130)
- **Logic:** Form validation + API call (Kiểm tra form + Gọi API)
- **UI:** Modal với form fields (Modal với các trường form)

### 🗑️ **XÓA (DELETE)**
- **Code:** `handleDelete` (Dòng 132-156)
- **Logic:** SweetAlert confirmation + DELETE API (Xác nhận SweetAlert + API DELETE)
- **UI:** Button trash icon (Nút icon thùng rác)

### 👁️ **XEM CHI TIẾT (VIEW DETAILS)**
- **Code:** `handleViewDetails` (Dòng 270-275)
- **Logic:** Set selected customer + show modal (Đặt khách hàng được chọn + hiển thị modal)
- **UI:** Modal với thông tin đầy đủ (Modal với đầy đủ thông tin)

### 📦 **BULK OPERATIONS (Thao tác hàng loạt)**
- **Code:** `handleBulkDelete` (Dòng 277-307)
- **Logic:** Xóa nhiều khách hàng (Delete multiple customers)
- **UI:** Checkbox + bulk actions bar (Checkbox + thanh hành động hàng loạt)

### 📤 **XUẤT CSV (CSV EXPORT)**
- **Code:** `handleExportCSV` (Dòng 318-372)
- **Logic:** Convert data to CSV + download (Chuyển dữ liệu sang CSV + tải)
- **UI:** Button "Xuất CSV" (Nút "Xuất CSV")

---

## 🔧 **CÁC HÀM HỮU ÍCH (USEFUL FUNCTIONS)**

### 🎯 **Để tìm nhanh (For quick search):**
- **Ctrl+F** "STATE MANAGEMENT" → State variables (Biến trạng thái)
- **Ctrl+F** "API FUNCTIONS" → API calls (Lệnh gọi API)
- **Ctrl+F** "FORM HANDLERS" → Form logic (Logic form)
- **Ctrl+F** "BULK OPERATIONS" → Bulk actions (Hành động hàng loạt)
- **Ctrl+F** "EXPORT FUNCTIONS" → CSV export (Xuất CSV)

### 🐛 **Debug tips (Mẹo gỡ lỗi):**
- **Loading issues (Vấn đề tải):** Check `fetchCustomers` (Dòng 32-44)
- **Form errors (Lỗi form):** Check `formErrors` state (Dòng 22)
- **Search not working (Tìm kiếm không hoạt động):** Check `handleSearchChange` (Dòng 173-177)
- **Pagination issues (Vấn đề phân trang):** Check `paginatedCustomers` (Dòng 221-225)
- **Modal not showing (Modal không hiển thị):** Check `modalVisible` state (Dòng 11)

### 🔄 **Flow (Luồng hoạt động):**
1. **Component mount (Component được gắn)** → `fetchCustomers()` → Load data (Tải dữ liệu)
2. **User search (Người dùng tìm kiếm)** → `handleSearchChange()` → Filter data (Lọc dữ liệu)
3. **User sort (Người dùng sắp xếp)** → `handleSort()` → Sort data (Sắp xếp dữ liệu)  
4. **User paginate (Người dùng phân trang)** → `setCurrentPage()` → Show page (Hiển thị trang)
5. **User CRUD (Người dùng CRUD)** → Form handlers → API calls → Refresh data (Làm mới dữ liệu)

---

## 📞 **LIÊN HỆ (CONTACT)**
- **File location (Vị trí file):** `src/components/Customer/Customer.jsx`
- **API endpoint:** `http://localhost:5000/customers`
- **Dependencies (Phụ thuộc):** React, Bootstrap 5, Axios, SweetAlert2

**Last updated (Cập nhật lần cuối):** 26/03/2026
