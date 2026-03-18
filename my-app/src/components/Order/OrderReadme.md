# Order Management Component - Kim Trâm

## 📋 Mô tả chức năng

Component Order quản lý toàn bộ hoạt động đơn hàng của tiệm barber, bao gồm:

### 🔥 Tính năng chính:
1. **Tạo đơn hàng mới** - Chọn khách hàng, dịch vụ, sản phẩm (tùy chọn)
2. **Tự động tính tổng tiền** - totalPrice = service.price + product.price (nếu có)
3. **Hiển thị danh sách đơn hàng** - Với thông tin chi tiết
4. **Chỉnh sửa đơn hàng** - Cập nhật thông tin đơn hàng
5. **Xóa đơn hàng** - Xóa đơn hàng không cần thiết
6. **Tìm kiếm đơn hàng** - Theo tên khách hàng, dịch vụ, ngày

## 🏗️ Cấu trúc Component

### State quản lý:
```javascript
const [orders, setOrders] = useState([]);           // Danh sách đơn hàng
const [customers, setCustomers] = useState([]);     // Danh sách khách hàng  
const [services, setServices] = useState([]);       // Danh sách dịch vụ
const [products, setProducts] = useState([]);       // Danh sách sản phẩm
const [showForm, setShowForm] = useState(false);    // Hiển thị form
const [editingOrder, setEditingOrder] = useState(null); // Đơn hàng đang sửa
const [searchTerm, setSearchTerm] = useState('');   // Từ khóa tìm kiếm
```

### Form state:
```javascript
const [formData, setFormData] = useState({
  customerId: '',    // ID khách hàng (bắt buộc)
  serviceId: '',    // ID dịch vụ (bắt buộc)  
  productId: '',    // ID sản phẩm (tùy chọn)
  date: new Date().toISOString().split('T')[0] // Ngày tạo
});
```

## 🎯 Business Rules đã implement:

1. **Validation:**
   - Khách hàng là bắt buộc
   - Dịch vụ là bắt buộc  
   - Sản phẩm là tùy chọn
   - Email phải đúng format (đã có ở Customer component)

2. **Auto Calculate:**
   ```javascript
   const calculateTotalPrice = () => {
     let total = 0;
     const service = services.find(s => s.id === formData.serviceId);
     if (service) total += service.price;
     const product = products.find(p => p.id === formData.productId);
     if (product) total += product.price;
     return total;
   };
   ```

3. **API Calls:**
   - `GET /orders` - Lấy danh sách đơn hàng
   - `POST /orders` - Tạo đơn hàng mới
   - `PUT /orders/:id` - Cập nhật đơn hàng
   - `DELETE /orders/:id` - Xóa đơn hàng

## 🎨 UI Features:

### Form tạo/sửa đơn hàng:
- Dropdown chọn khách hàng (hiển thị tên + phone)
- Dropdown chọn dịch vụ (hiển thị tên + giá)
- Dropdown chọn sản phẩm (có lựa chọn "Không chọn")
- Input chọn ngày
- Display tổng tiền tự động tính

### Danh sách đơn hàng:
- Table hiển thị: ID, Khách hàng, Dịch vụ, Sản phẩm, Tổng tiền, Ngày
- Nút Sửa/Xóa cho mỗi đơn hàng
- Search bar tìm kiếm theo nhiều tiêu chí

### Responsive Design:
- Mobile-friendly layout
- Modal form cho màn hình nhỏ
- Scroll table cho dữ liệu nhiều

## 🔧 Demo khi trình bày:

Khi demo, Kim Trâm sẽ trình bày:

1. **"Đây là component Order tôi phụ trách"**
   - File: `src/components/Order/Order.jsx`

2. **"Đây là các state chính"**
   - `orders` - lưu danh sách đơn hàng
   - `formData` - lưu thông tin form
   - `editingOrder` - kiểm soát mode tạo/sửa

3. **"Đây là props tôi nhận"**
   - Không có props (component độc lập)

4. **"Đây là API calls"**
   - `axios.get('http://localhost:3000/orders')`
   - `axios.post('http://localhost:3000/orders')`
   - `axios.put('http://localhost:3000/orders/:id')`
   - `axios.delete('http://localhost:3000/orders/:id')`

5. **"Đây là logic xử lý"**
   - Auto calculate totalPrice
   - Validation form
   - Search functionality
   - CRUD operations

6. **"Đây là business rules tôi implement"**
   - Order bắt buộc có Service
   - totalPrice = service.price + product.price
   - Validate required fields

## 🚀 Cách sử dụng:

1. **Tạo đơn hàng:**
   - Click "Tạo Đơn hàng Mới"
   - Chọn khách hàng từ dropdown
   - Chọn dịch vụ (bắt buộc)
   - Chọn sản phẩm (tùy chọn)
   - Chọn ngày
   - Xem tổng tiền tự động tính
   - Click "Tạo Đơn hàng"

2. **Sửa đơn hàng:**
   - Click "Sửa" trong danh sách
   - Form sẽ tự động điền thông tin
   - Chỉnh sửa và click "Cập Nhật"

3. **Xóa đơn hàng:**
   - Click "Xóa" trong danh sách
   - Confirm dialog
   - Click OK để xóa

4. **Tìm kiếm:**
   - Nhập vào search bar
   - Tự động lọc theo tên KH, dịch vụ, ngày

## 🎯 Thành tựu của Kim Trâm:

✅ **CRUD Order hoàn chỉnh**  
✅ **Auto calculate totalPrice**  
✅ **Form validation**  
✅ **Search & Filter**  
✅ **Responsive UI**  
✅ **Business Rules implementation**  
✅ **Report component**  
✅ **Business Analysis features**
