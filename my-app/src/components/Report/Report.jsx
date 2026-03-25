import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChartPie, FaBolt, FaDownload, FaArrowUp, FaDollarSign, FaShoppingCart } from 'react-icons/fa';

// Component chính cho trang báo cáo hệ thống
const Report = () => {
  // State để lưu trữ dữ liệu từ API
  const [orders, setOrders] = useState([]); // Danh sách đơn hàng
  const [services, setServices] = useState([]); // Danh sách dịch vụ
  const [products, setProducts] = useState([]); // Danh sách sản phẩm
  const [customers, setCustomers] = useState([]); // Danh sách khách hàng

  // State cho bộ lọc khoảng thời gian
  const [dateRange, setDateRange] = useState({
    startDate: '', // Ngày bắt đầu
    endDate: '' // Ngày kết thúc
  });

  // State cho dữ liệu báo cáo đã xử lý
  const [reportData, setReportData] = useState({
    totalRevenue: 0, // Tổng doanh thu
    totalOrders: 0, // Tổng số đơn hàng
    totalCustomers: 0, // Tổng số khách hàng (không còn dùng)
    topServices: [], // Top dịch vụ bán chạy
    topProducts: [], // Top sản phẩm bán chạy
    revenueByDate: [] // Doanh thu theo ngày
  });

  // State cho bộ lọc nhanh
  const [quickFilter, setQuickFilter] = useState('');

  // useEffect để fetch dữ liệu khi component được mount
  useEffect(() => {
    fetchData();
  }, []);

  // useEffect để tính toán lại báo cáo khi dữ liệu thay đổi
  useEffect(() => {
    calculateReportData();
  }, [orders, services, products, customers, dateRange]);

  // Hàm fetch dữ liệu từ API JSON Server
  const fetchData = async () => {
    try {
      // Gọi song song nhiều API để tăng performance
      const [ordersRes, servicesRes, productsRes, customersRes] = await Promise.all([
        axios.get('http://localhost:5000/orders'), // Lấy danh sách đơn hàng
        axios.get('http://localhost:5000/services'), // Lấy danh sách dịch vụ
        axios.get('http://localhost:5000/products'), // Lấy danh sách sản phẩm
        axios.get('http://localhost:5000/customers') // Lấy danh sách khách hàng
      ]);

      // Cập nhật state với dữ liệu từ API
      setOrders(ordersRes.data);
      setServices(servicesRes.data);
      setProducts(productsRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Hàm tính toán các chỉ số báo cáo từ dữ liệu thô
  const calculateReportData = () => {
    let filteredOrders = orders;

    // Lọc đơn hàng theo khoảng thời gian nếu có chỉ định
 if (dateRange.startDate && dateRange.endDate) {
      filteredOrders = orders.filter(order => {
        return order.date >= dateRange.startDate && order.date <= dateRange.endDate;
      });
    }

    // Tính tổng doanh thu từ các đơn hàng đã lọc
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    // Tính tổng số đơn hàng
    const totalOrders = filteredOrders.length;

    // Tính số khách hàng duy nhất (không còn hiển thị nhưng vẫn tính toán)
    const uniqueCustomers = new Set(filteredOrders.map(order => order.customerId));
    const totalCustomers = uniqueCustomers.size;

    // Tìm top 5 dịch vụ bán chạy nhất
    const serviceCount = {};
    filteredOrders.forEach(order => {
  const serviceId = order.serviceId;
      serviceCount[serviceId] = (serviceCount[serviceId] || 0) + 1;
    });

    // Xử lý dữ liệu top dịch vụ
    const topServices = Object.entries(serviceCount)
      .map(([serviceId, count]) => {
        const service = services.find(s => s.id === serviceId);
        return {
   name: service ? service.name : 'Unknown', // Tên dịch vụ
          count: count, // Số lượt sử dụng
          revenue: filteredOrders
            .filter(order => order.serviceId === serviceId)
            .reduce((sum, order) => sum + (order.totalPrice || 0), 0) // Doanh thu từ dịch vụ này
        };
      })
      .sort((a, b) => b.count - a.count) // Sắp xếp theo số lượt giảm dần
      .slice(0, 5); // Lấy top 5

    // Tìm top 5 sản phẩm bán chạy nhất
    const productCount = {};
    filteredOrders.forEach(order => {
      if (order.productId) {
  productCount[order.productId] = (productCount[order.productId] || 0) + 1;
      }
    });

    // Xử lý dữ liệu top sản phẩm
    const topProducts = Object.entries(productCount)
      .map(([productId, count]) => {
        const product = products.find(p => p.id === productId);
        return {
          name: product ? product.name : 'Unknown', // Tên sản phẩm
          count: count, // Số lượt bán
          revenue: filteredOrders
            .filter(order => order.productId === productId)
            .reduce((sum, order) => sum + (product?.price || 0), 0) // Doanh thu từ sản phẩm này
        };
      })
      .sort((a, b) => b.count - a.count) // Sắp xếp theo số lượt giảm dần
      .slice(0, 5); // Lấy top 5

    // Tính doanh thu theo từng ngày
    const revenueByDate = {};
    filteredOrders.forEach(order => {
      const date = order.date;
      revenueByDate[date] = (revenueByDate[date] || 0) + (order.totalPrice || 0);
    });

    // Sắp xếp doanh thu theo ngày tăng dần
    const sortedRevenueByDate = Object.entries(revenueByDate)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Cập nhật state với dữ liệu đã tính toán
    setReportData({
      totalRevenue,
      totalOrders,
      totalCustomers,
      topServices,
      topProducts,
      revenueByDate: sortedRevenueByDate
    });
  };

  // Hàm xử lý khi thay đổi bộ lọc ngày tháng
  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
    setQuickFilter(''); // Reset bộ lọc nhanh khi chọn ngày thủ công
  };

  // Hàm xử lý bộ lọc nhanh (Hôm nay, 7 ngày, 30 ngày)
  const handleQuickFilter = (filter) => {
    const today = new Date();
    let startDate = '';
    let endDate = today.toISOString().split('T')[0];

    switch (filter) {
      case 'today': {
        // Lọc cho hôm nay
        startDate = endDate;
        break;
      }
      case '7days': {
        // Lọc 7 ngày gần nhất
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        startDate = sevenDaysAgo.toISOString().split('T')[0];
        break;
      }
      case '30days': {
        // Lọc 30 ngày gần nhất
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        startDate = thirtyDaysAgo.toISOString().split('T')[0];
        break;
      }
      default:
        // Không lọc
        startDate = '';
        endDate = '';
    }

    // Cập nhật state với khoảng thời gian đã chọn
    setDateRange({
      startDate,
      endDate
    });
    setQuickFilter(filter);
  };

  // Hàm định dạng tiền tệ theo chuẩn Việt Nam
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  // Hàm định dạng ngày tháng theo chuẩn Việt Nam (dd/mm)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  // Hàm xuất báo cáo ra file text
  const exportReport = () => {
    try {
      // Tạo chuỗi mô tả khoảng thời gian
      const timeRangeText = dateRange.startDate
        ? `Từ ${dateRange.startDate} đến ${dateRange.endDate || 'hiện tại'}`
        : 'Từ đầu đến Hiện tại';

      // Tạo nội dung báo cáo
      const reportText = `
BÁO CÁO DOANH THU TIỆM BARBER
Khoảng thời gian: ${timeRangeText}

TỔNG QUAN:
- Tổng doanh thu: ${reportData.totalRevenue.toLocaleString()} VNĐ
- Tổng đơn hàng: ${reportData.totalOrders}
- Tổng khách hàng: ${reportData.totalCustomers}

DỊCH VỤ BÁN CHẠY NHẤT:
${reportData.topServices.map((service, index) =>
        `${index + 1}. ${service.name} - ${service.count} lượt - ${service.revenue.toLocaleString()} VNĐ`
      ).join('\n')}

SẢN PHẨM BÁN CHẠY NHẤT:
${reportData.topProducts.map((product, index) =>
        `${index + 1}. ${product.name} - ${product.count} lượt - ${product.revenue.toLocaleString()} VNĐ`
      ).join('\n')}

DOANH THU THEO NGÀY:
${reportData.revenueByDate.map(item =>
        `${item.date}: ${item.revenue.toLocaleString()} VNĐ`
      ).join('\n')}
    `;

      // Tạo file và tải về
      const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bao-cao-doanh-thu-${new Date().toISOString().split('T')[0]}.txt`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      console.log('Report exported successfully!');
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Có lỗi xảy ra khi xuất báo cáo!');
    }
  };

  // Render UI component
  return (
    <div className="report-management">
      {/* Header của trang báo cáo */}
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">
            <FaChartPie className="title-icon" />
            BÁO CÁO HỆ THỐNG
          </h1>
          <div className="live-badge">
            <FaBolt className="pulse-icon" />
          </div>
        </div>
      </div>

      {/* Bộ lọc khoảng thời gian */}
      <div className="date-filter">
        <h3>Khoảng thời gian</h3>

        {/* Các nút bộ lọc nhanh */}
        <div className="quick-filters">
          <button
            className={`quick-filter-btn ${quickFilter === 'today' ? 'active' : ''}`}
            onClick={() => handleQuickFilter('today')}
          >
            Hôm nay
          </button>
          <button
            className={`quick-filter-btn ${quickFilter === '7days' ? 'active' : ''}`}
            onClick={() => handleQuickFilter('7days')}
          >
            7 ngày
          </button>
          <button
            className={`quick-filter-btn ${quickFilter === '30days' ? 'active' : ''}`}
            onClick={() => handleQuickFilter('30days')}
          >
            30 ngày
          </button>
          <button
            className={`quick-filter-btn ${quickFilter === 'custom' ? 'active' : ''}`}
            onClick={() => { setQuickFilter('custom'); setDateRange({ startDate: '', endDate: '' }); }}
          >
            Tùy chọn
          </button>
        </div>

        {/* Input chọn ngày tùy chỉnh */}
        {(quickFilter === 'custom' || (!quickFilter && (dateRange.startDate || dateRange.endDate))) && (
          <div className="date-inputs">
            <div className="date-range-row">
              <div className="form-group">
                <label>Từ ngày</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                />
              </div>
              <span className="arrow-separator">→</span>
              <div className="form-group">
                <label>Đến ngày</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Các thẻ thống kê tổng quan */}
      <div className="summary-cards">
        {/* Thẻ doanh thu (quan trọng nhất) */}
        <div className="summary-card revenue-card">
          <div className="card-header">
            <div className="card-icon revenue-icon">
              <FaDollarSign />
            </div>
            <h3>Doanh thu</h3>
          </div>
          <div className="card-value">{formatCurrency(reportData.totalRevenue)} VNĐ</div>
          <div className="card-trend positive">
            <FaArrowUp /> +15% so với tháng trước
          </div>
        </div>

        {/* Container cho các thẻ còn lại */}
        <div className="other-cards">
          {/* Thẻ đơn hàng */}
          <div className="summary-card orders-card">
            <div className="card-header">
              <div className="card-icon orders-icon">
                <FaShoppingCart />
              </div>
              <h3>Đơn hàng</h3>
            </div>
            <div className="card-value">{reportData.totalOrders}</div>
            <div className="card-subtitle">đơn</div>
            <div className="card-description">Tăng trưởng ổn định</div>
          </div>

          {/* Thẻ dịch vụ */}
          <div className="summary-card services-card">
            <div className="card-header">
              <div className="card-icon services-icon">
                <FaChartPie />
              </div>
              <h3>Dịch vụ</h3>
            </div>
            <div className="card-value">{services.length}</div>
            <div className="card-subtitle">dịch vụ</div>
          </div>

          {/* Thẻ sản phẩm */}
          <div className="summary-card products-card">
            <div className="card-header">
              <div className="card-icon products-icon">
                <FaDollarSign />
              </div>
              <h3>Sản phẩm</h3>
            </div>
            <div className="card-value">{products.length}</div>
            <div className="card-subtitle">sản phẩm</div>
          </div>
        </div>
      </div>

      {/* Nút xuất báo cáo */}
      <div className="export-section">
        <button className="btn-export" onClick={exportReport}>
          <FaDownload /> Xuất báo cáo
        </button>
      </div>

      {/* Các biểu đồ và danh sách top */}
      <div className="charts-section">
        {/* Top 5 dịch vụ bán chạy */}
        <div className="chart-container">
          <h3>Top 5 Dịch Vụ Bán Chạy</h3>
          <div className="top-list">
            {reportData.topServices.map((service, index) => (
              <div key={index} className="top-item">
                <span className="rank">#{index + 1}</span>
                <div className="item-info">
                  <h4>{service.name}</h4>
                  <p>{service.count} lượt sử dụng | {formatCurrency(service.revenue)} VNĐ</p>
                </div>
              </div>
            ))}
            {reportData.topServices.length === 0 && (
              <p className="no-data">Chưa có dữ liệu dịch vụ</p>
            )}
          </div>
        </div>

        {/* Top 5 sản phẩm bán chạy */}
        <div className="chart-container">
          <h3>Top 5 Sản Phẩm Bán Chạy</h3>
          <div className="top-list">
            {reportData.topProducts.map((product, index) => (
              <div key={index} className="top-item">
                <span className="rank">#{index + 1}</span>
                <div className="item-info">
                  <h4>{product.name}</h4>
                  <p>{product.count} lượt | {formatCurrency(product.revenue)} VNĐ</p>
                </div>
              </div>
            ))}
            {reportData.topProducts.length === 0 && (
              <p className="no-data">Chưa có dữ liệu sản phẩm</p>
            )}
          </div>
        </div>
      </div>

      {/* Doanh thu theo ngày */}
      <div className="revenue-timeline">
        <h3>Doanh thu theo ngày</h3>
        <div className="timeline">
          {reportData.revenueByDate.map((item, index) => (
            <div key={index} className="timeline-item">
              <span className="date">{formatDate(item.date)}</span>
              <span className="revenue">{formatCurrency(item.revenue)} VNĐ</span>
            </div>
          ))}
          {reportData.revenueByDate.length === 0 && (
            <p className="no-data">Chưa có dữ liệu doanh thu</p>
          )}
        </div>
      </div>

      {/* CSS styles cho component */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;700;900&display=swap');

        /* Styles chính cho container */
        .report-management {
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

        /* Badge dữ liệu thời gian thực */
        .live-badge {
          background: linear-gradient(135deg, #ffc107, #ff9800);
          color: #000;
          padding: 8px 16px;
          border-radius: 25px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: pulse 2s infinite;
        }

        .pulse-icon {
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }

        /* Styles cho bộ lọc ngày tháng */
        .date-filter {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 30px;
        }

        .date-filter h3 {
          color: #ffc107;
          margin-top: 0;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Nút bộ lọc nhanh */
        .quick-filters {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .quick-filter-btn {
          background: #2a2a2a;
          color: #ccc;
          border: 1px solid #444;
          border-radius: 20px;
          padding: 8px 16px;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 500;
        }

        .quick-filter-btn:hover {
          background: #333;
          color: #fff;
          border-color: #ffc107;
        }

        .quick-filter-btn.active {
          background: #ffc107;
          color: #000;
          border-color: #ffc107;
        }

        /* Input ngày tháng */
        .date-inputs {
          margin-top: 15px;
        }

        .date-range-row {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .arrow-separator {
          color: #ffc107;
          font-size: 1.2rem;
          font-weight: bold;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-group label {
          font-weight: 500;
          color: #ffc107;
        }

        .form-group input {
          padding: 8px;
          border: 1px solid #333;
          border-radius: 6px;
          background: #0d0d0d;
          color: #fff;
        }

        /* Styles cho các thẻ thống kê */
        .summary-cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }

        .summary-card {
          background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          position: relative;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .summary-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(255, 193, 7, 0.2);
          border-color: #ffc107;
        }

        /* Styles đặc biệt cho thẻ doanh thu */
        .revenue-card {
          background: linear-gradient(135deg, #ffc107 0%, #ffb347 50%, #ff9800 100%);
          color: #000;
          position: relative;
          overflow: hidden;
        }

        .revenue-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }

        .revenue-card .card-header {
          position: relative;
          z-index: 2;
        }

        .revenue-card .card-header h3 {
          color: #000;
          font-size: 1.2rem;
          font-weight: 800;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .revenue-card .card-value {
          color: #000;
          font-size: 2.8rem;
          font-weight: 900;
          position: relative;
          z-index: 2;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .revenue-card .card-trend {
          color: #000;
          background: rgba(0,0,0,0.1);
          padding: 8px 12px;
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          position: relative;
          z-index: 2;
        }

        /* Container cho các thẻ khác */
        .other-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        /* Header của thẻ */
        .card-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .card-header h3 {
          color: #fff;
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Icon của thẻ */
        .card-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .revenue-icon {
          background: rgba(0, 0, 0, 0.2);
          color: #000;
          font-size: 1.5rem;
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 20px rgba(0,0,0,0.2);
          }
          50% { 
            transform: scale(1.05);
            box-shadow: 0 0 30px rgba(0,0,0,0.3);
          }
        }

        .orders-icon {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: #fff;
        }

        .services-icon {
          background: linear-gradient(135deg, #6f42c1, #5a32a3);
          color: #fff;
        }

        .products-icon {
          background: linear-gradient(135deg, #28a745, #1e7e34);
          color: #fff;
        }

        /* Nội dung thẻ */
        .card-value {
          font-size: 2.2rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 8px;
          line-height: 1;
        }

        .card-subtitle {
          color: #ccc;
          font-size: 0.9rem;
          margin-bottom: 10px;
        }

        .card-description {
          color: #999;
          font-size: 0.8rem;
        }

        .card-trend {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .card-trend.positive {
          color: #28a745;
        }

        /* Nút xuất báo cáo */
        .export-section {
          text-align: right;
          margin-bottom: 30px;
        }

        .btn-export {
          background: #ffc107;
          color: #000;
          border: none;
          border-radius: 25px;
          padding: 12px 25px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.9rem;
        }

        .btn-export:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3);
        }

        /* Container cho biểu đồ */
        .charts-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .chart-container {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 20px;
        }

        .chart-container h3 {
          color: #ffc107;
          margin-top: 0;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Danh sách top */
        .top-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .top-item {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .rank {
          background: #ffc107;
          color: #000;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }

        .item-info {
          flex: 1;
        }

        .item-info h4 {
          margin: 0 0 5px 0;
          color: #fff;
          font-size: 16px;
        }

        .item-info p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        /* Timeline doanh thu */
        .revenue-timeline {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 20px;
        }

        .revenue-timeline h3 {
          color: #ffc107;
          margin-top: 0;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .timeline {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: none;
          overflow-y: visible;
        }

        .timeline-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: linear-gradient(135deg, #0d0d0d, #1a1a1a);
          border-radius: 8px;
          border-left: 3px solid #ffc107;
          transition: all 0.3s;
        }

        .timeline-item:hover {
          background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
          transform: translateX(5px);
        }

        .timeline-item .date {
          font-weight: 600;
          color: #fff;
        }

        .timeline-item .revenue {
          color: #28a745;
          font-weight: bold;
          font-size: 1.1rem;
        }

        /* Thông báo không có dữ liệu */
        .no-data {
          text-align: center;
          color: #666;
          font-style: italic;
          padding: 20px;
        }

        /* Responsive cho mobile */
        @media (max-width: 768px) {
          .charts-section {
            grid-template-columns: 1fr;
          }
          
          .summary-cards {
            grid-template-columns: 1fr;
          }
          
          .revenue-card {
            grid-column: span 1;
          }
          
          .other-cards {
            grid-template-columns: 1fr;
          }
          
          .date-range-row {
            flex-direction: column;
            align-items: stretch;
          }
          
          .arrow-separator {
            display: none;
          }

          .quick-filters {
            justify-content: center;
          }

          .export-section {
            text-align: center;
          }

          .page-header {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Report;
