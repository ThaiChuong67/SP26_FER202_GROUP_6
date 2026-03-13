import React, { useEffect, useState } from "react";
import axios from "axios";

function OrderList() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error("Failed to load orders", err);
      });
  }, []);

  const deleteOrder = (id) => {
    axios
      .delete(`http://localhost:3001/orders/${id}`)
      .then(() => {
        setOrders(orders.filter((o) => o.id !== id));
      })
      .catch((err) => {
        console.error("Failed to delete order", err);
      });
  };

  return (

    <div>

      <h2>Order List</h2>

      <table border="1">

        <thead>
          <tr>
            <th>Service</th>
            <th>Product</th>
            <th>Total Price</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {orders.map(order => (

            <tr key={order.id}>
              <td>{order.serviceId}</td>
              <td>{order.productId}</td>
              <td>{order.totalPrice}</td>

              <td>
                <button onClick={() => deleteOrder(order.id)}>
                  Delete
                </button>
              </td>
            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default OrderList;