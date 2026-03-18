import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChartPie, FaBolt, FaDownload, FaArrowUp, FaDollarSign, FaShoppingCart, FaUsers } from 'react-icons/fa';

const Report = () => {
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: ''
  });
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    topServices: [],
    topProducts: [],
    revenueByDate: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calculateReportData();
  }, [orders, services, products, customers, dateRange]);

  const fetchData = async () => {
    try {
      const [ordersRes, servicesRes, productsRes, customersRes] = await Promise.all([
        axios.get('http://localhost:5000/orders'),
        axios.get('http://localhost:5000/services'),
        axios.get('http://localhost:5000/products'),
        axios.get('http://localhost:5000/customers')
      ]);

      setOrders(ordersRes.data);
      setServices(servicesRes.data);
      setProducts(productsRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const calculateReportData = () => {
    let filteredOrders = orders;

    // Filter by date range if specified
    if (dateRange.startDate && dateRange.endDate) {
      filteredOrders = orders.filter(order => {
        const orderDateTime = `${order.date} ${order.orderTime || '00:00'}`;
        const startDateTime = `${dateRange.startDate} ${dateRange.startTime || '00:00'}`;
        const endDateTime = `${dateRange.endDate} ${dateRange.endTime || '23:59'}`;
        
        return orderDateTime >= startDateTime && orderDateTime <= endDateTime;
      });
    }

    // Calculate total revenue
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    // Calculate total orders
    const totalOrders = filteredOrders.length;

    // Calculate unique customers
    const uniqueCustomers = new Set(filteredOrders.map(order => order.customerId));
    const totalCustomers = uniqueCustomers.size;

    // Find top services
    const serviceCount = {};
    filteredOrders.forEach(order => {
      const serviceId = order.serviceId;
      serviceCount[serviceId] = (serviceCount[serviceId] || 0) + 1;
    });

    const topServices = Object.entries(serviceCount)
      .map(([serviceId, count]) => {
        const service = services.find(s => s.id === serviceId);
        return {
          name: service ? service.name : 'Unknown',
          count: count,
          revenue: filteredOrders
            .filter(order => order.serviceId === serviceId)
            .reduce((sum, order) => sum + (order.totalPrice || 0), 0)
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Find top products
    const productCount = {};
    filteredOrders.forEach(order => {
      if (order.productId) {
        productCount[order.productId] = (productCount[order.productId] || 0) + 1;
      }
    });

    const topProducts = Object.entries(productCount)
      .map(([productId, count]) => {
        const product = products.find(p => p.id === productId);
        return {
          name: product ? product.name : 'Unknown',
          count: count,
          revenue: filteredOrders
            .filter(order => order.productId === productId)
            .reduce((sum, order) => sum + (product?.price || 0), 0)
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Revenue by date
    const revenueByDate = {};
    filteredOrders.forEach(order => {
      const date = order.date;
      revenueByDate[date] = (revenueByDate[date] || 0) + (order.totalPrice || 0);
    });

    const sortedRevenueByDate = Object.entries(revenueByDate)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setReportData({
      totalRevenue,
      totalOrders,
      totalCustomers,
      topServices,
      topProducts,
      revenueByDate: sortedRevenueByDate
    });
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const exportReport = () => {
    try {
      const timeRangeText = dateRange.startDate && dateRange.startTime
        ? `Từ ${dateRange.startDate} ${dateRange.startTime} đến ${dateRange.endDate || 'hiện tại'} ${dateRange.endTime || ''}`
        : 'Từ đầu đến Hiện tại';

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

  return (
    <div className="report-management">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">
            <FaChartPie className="title-icon" />
            EXECUTIVE REPORT
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

      <div className="date-filter">
        <h3>
          {dateRange.startDate && dateRange.startTime 
            ? `Từ ${dateRange.startDate} ${dateRange.startTime} đến ${dateRange.endDate || 'hiện tại'} ${dateRange.endTime || ''}`
            : 'Lọc theo khoảng thời gian'
          }
        </h3>
        <div className="date-inputs">
          <div className="form-group">
            <label>Từ ngày:</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Từ giờ:</label>
            <input
              type="time"
              value={dateRange.startTime}
              onChange={(e) => handleDateRangeChange('startTime', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Đến ngày:</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Đến giờ:</label>
            <input
              type="time"
              value={dateRange.endTime}
              onChange={(e) => handleDateRangeChange('endTime', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card main-card">
          <div className="card-header">
            <h3>TỔNG DOANH THU HỆ THỐNG</h3>
            <div className="card-icon">
              <FaDollarSign />
            </div>
          </div>
          <div className="card-value">{reportData.totalRevenue.toLocaleString()}</div>
          <div className="card-subtitle">VND</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '75%'}}></div>
          </div>
          <div className="card-trend positive">
            <FaArrowUp /> +15% vs Last Month
          </div>
        </div>

        <div className="summary-card">
          <div className="card-header">
            <h3>TỔNG ĐƠN HÀNG</h3>
            <div className="card-icon">
              <FaShoppingCart />
            </div>
          </div>
          <div className="card-value">{reportData.totalOrders}</div>
          <div className="card-subtitle">đơn hàng</div>
          <div className="card-description">Tăng trưởng ổn định trong quý 1</div>
        </div>

        <div className="summary-card">
          <div className="card-header">
            <h3>DỊCH VỤ</h3>
            <div className="card-icon">
              <FaChartPie />
            </div>
          </div>
          <div className="card-value">{services.length}</div>
          <div className="card-subtitle">dịch vụ</div>
        </div>

        <div className="summary-card">
          <div className="card-header">
            <h3>SẢN PHẨM</h3>
            <div className="card-icon">
              <FaDollarSign />
            </div>
          </div>
          <div className="card-value">{products.length}</div>
          <div className="card-subtitle">sản phẩm</div>
        </div>

        <div className="summary-card">
          <div className="card-header">
            <h3>KHÁCH HÀNG VIP</h3>
            <div className="card-icon">
              <FaUsers />
            </div>
          </div>
          <div className="card-value">{reportData.totalCustomers}</div>
          <div className="card-subtitle">khách hàng</div>
        </div>
      </div>

      <div className="export-section">
        <button className="btn-export" onClick={exportReport}>
          <FaDownload /> Xuất Báo Cáo
        </button>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3>Top 5 Dịch Vụ Bán Chạy</h3>
          <div className="top-list">
            {reportData.topServices.map((service, index) => (
              <div key={index} className="top-item">
                <span className="rank">#{index + 1}</span>
                <div className="item-info">
                  <h4>{service.name}</h4>
                  <p>{service.count} lượt • {service.revenue.toLocaleString()} VNĐ</p>
                </div>
              </div>
            ))}
            {reportData.topServices.length === 0 && (
              <p className="no-data">Chưa có dữ liệu dịch vụ</p>
            )}
          </div>
        </div>

        <div className="chart-container">
          <h3>Top 5 Sản Phẩm Bán Chạy</h3>
          <div className="top-list">
            {reportData.topProducts.map((product, index) => (
              <div key={index} className="top-item">
                <span className="rank">#{index + 1}</span>
                <div className="item-info">
                  <h4>{product.name}</h4>
                  <p>{product.count} lượt • {product.revenue.toLocaleString()} VNĐ</p>
                </div>
              </div>
            ))}
            {reportData.topProducts.length === 0 && (
              <p className="no-data">Chưa có dữ liệu sản phẩm</p>
            )}
          </div>
        </div>
      </div>

      <div className="revenue-timeline">
        <h3>Doanh Thu Theo Ngày</h3>
        <div className="timeline">
          {reportData.revenueByDate.map((item, index) => (
            <div key={index} className="timeline-item">
              <span className="date">{item.date}</span>
              <span className="revenue">{item.revenue.toLocaleString()} VNĐ</span>
            </div>
          ))}
          {reportData.revenueByDate.length === 0 && (
            <p className="no-data">Chưa có dữ liệu doanh thu</p>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;700;900&display=swap');

        .report-management {
          font-family: 'Montserrat', sans-serif;
          color: #fff;
        }

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

        .date-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .date-inputs {
            grid-template-columns: 1fr;
          }
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

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .summary-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 20px;
          position: relative;
        }

        .main-card {
          grid-column: span 2;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .card-header h3 {
          color: #fff;
          margin: 0;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .card-icon {
          width: 40px;
          height: 40px;
          background: #ffc107;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
        }

        .card-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 5px;
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

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #333;
          border-radius: 3px;
          margin-bottom: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #ffc107;
          border-radius: 3px;
        }

        .card-trend {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
        }

        .card-trend.positive {
          color: #28a745;
        }

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
          background: #fff;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3);
        }

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
          max-height: 300px;
          overflow-y: auto;
        }

        .timeline-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: #0d0d0d;
          border-radius: 6px;
        }

        .timeline-item .date {
          font-weight: 500;
          color: #fff;
        }

        .timeline-item .revenue {
          color: #28a745;
          font-weight: bold;
        }

        .no-data {
          text-align: center;
          color: #666;
          font-style: italic;
          padding: 20px;
        }

        @media (max-width: 768px) {
          .charts-section {
            grid-template-columns: 1fr;
          }
          
          .summary-cards {
            grid-template-columns: 1fr;
          }
          
          .main-card {
            grid-column: span 1;
          }
          
          .date-inputs {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Report;
