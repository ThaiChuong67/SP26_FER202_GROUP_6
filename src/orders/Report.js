import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

function Report() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error("Failed to load orders", err);
      });
  }, []);

  const reportByDay = useMemo(() => {
    const map = {};
    orders.forEach((order) => {
      const day = order.date ? order.date.slice(0, 10) : "Unknown";
      if (!map[day]) {
        map[day] = { revenue: 0, count: 0 };
      }
      map[day].revenue += order.totalPrice || 0;
      map[day].count += 1;
    });

    return Object.entries(map)
      .map(([day, data]) => ({ day, ...data }))
      .sort((a, b) => (a.day < b.day ? 1 : -1));
  }, [orders]);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
    [orders]
  );

  return (
    <div>
      <h2>Revenue Report</h2>

      <div className="mb-3">
        <strong>Total Revenue:</strong> {totalRevenue.toLocaleString()} VND
      </div>
      <div className="mb-3">
        <strong>Total Orders:</strong> {orders.length}
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Date</th>
            <th>Orders</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {reportByDay.map((row) => (
            <tr key={row.day}>
              <td>{row.day}</td>
              <td>{row.count}</td>
              <td>{row.revenue.toLocaleString()} VND</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Report;
