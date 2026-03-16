import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editState, setEditState] = useState({
    customerId: null,
    serviceId: null,
    productId: null,
    productQty: 1,
  });

  const [message, setMessage] = useState("");

  const [filterDate, setFilterDate] = useState("");
  const [filterServiceId, setFilterServiceId] = useState("");
  const [filterCustomerId, setFilterCustomerId] = useState("");

  const filteredOrders = useMemo(() => {
    let list = orders;
    if (filterDate) {
      list = list.filter((o) => o.date?.slice(0, 10) === filterDate);
    }
    if (filterServiceId) {
      list = list.filter((o) => String(o.serviceId) === filterServiceId);
    }
    if (filterCustomerId) {
      list = list.filter((o) => String(o.customerId) === filterCustomerId);
    }
    return list;
  }, [orders, filterDate, filterServiceId, filterCustomerId]);

  const loadData = () => {
    axios
      .get("http://localhost:3001/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error("Failed to load orders", err);
      });

    axios
      .get("http://localhost:3001/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Failed to load services", err));

    axios
      .get("http://localhost:3001/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to load products", err));

    axios
      .get("http://localhost:3001/customers")
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error("Failed to load customers", err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshOrders = () => {
    axios
      .get("http://localhost:3001/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error("Failed to load orders", err);
      });
  };

  const startEdit = (order) => {
    setEditingId(order.id);
    setEditState({
      customerId: order.customerId,
      serviceId: order.serviceId,
      productId: order.productId,
      productQty: order.productQty || 1,
    });
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setMessage("");
  };

  const selectedService = services.find((s) => s.id === Number(editState.serviceId));
  const selectedProduct = products.find((p) => p.id === Number(editState.productId));

  const editTotal = useMemo(() => {
    const servicePrice = selectedService?.price || 0;
    const productPrice = selectedProduct?.price || 0;
    const qty = Number(editState.productQty) || 0;
    return servicePrice + productPrice * qty;
  }, [selectedService, selectedProduct, editState.productQty]);

  const saveEdit = () => {
    if (!editState.customerId) {
      setMessage("Please select a customer.");
      return;
    }

    if (!editState.serviceId) {
      setMessage("Please select a service.");
      return;
    }

    if (!editState.productId) {
      setMessage("Please select a product.");
      return;
    }

    if (!Number.isInteger(Number(editState.productQty)) || editState.productQty < 1) {
      setMessage("Quantity must be a positive integer.");
      return;
    }

    axios
      .put(`http://localhost:3001/orders/${editingId}`, {
        ...orders.find((o) => o.id === editingId),
        customerId: Number(editState.customerId),
        serviceId: Number(editState.serviceId),
        productId: Number(editState.productId),
        productQty: Number(editState.productQty),
        totalPrice: editTotal,
      })
      .then(() => {
        setMessage("Order updated.");
        setEditingId(null);
        refreshOrders();
      })
      .catch((err) => {
        console.error("Failed to update order", err);
        setMessage("Unable to update order. Please try again.");
      });
  };

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

  const findServiceName = (id) => services.find((s) => s.id === id)?.name || id;
  const findProductName = (id) => products.find((p) => p.id === id)?.name || id;
  const findCustomerName = (id) => customers.find((c) => c.id === id)?.name || id;

  return (
    <div>
      <h2>Order List</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="mb-3 row g-2">
        <div className="col-md-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Service</label>
          <select
            className="form-select"
            value={filterServiceId}
            onChange={(e) => setFilterServiceId(e.target.value)}
          >
            <option value="">All services</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Customer</label>
          <select
            className="form-select"
            value={filterCustomerId}
            onChange={(e) => setFilterCustomerId(e.target.value)}
          >
            <option value="">All customers</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-1 d-flex align-items-end">
          <button
            className="btn btn-secondary w-100"
            onClick={() => {
              setFilterDate("");
              setFilterServiceId("");
              setFilterCustomerId("");
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Date</th>
            <th>Service</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => {
            const isEditing = editingId === order.id;
            return (
              <tr key={order.id}>
                <td>
                  {isEditing ? (
                    <select
                      className="form-select"
                      value={editState.customerId}
                      onChange={(e) =>
                        setEditState((prev) => ({
                          ...prev,
                          customerId: Number(e.target.value),
                        }))
                      }
                    >
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    findCustomerName(order.customerId)
                  )}
                </td>
                <td>{order.date ? order.date.slice(0, 10) : "-"}</td>
                <td>
                  {isEditing ? (
                    <select
                      className="form-select"
                      value={editState.serviceId}
                      onChange={(e) =>
                        setEditState((prev) => ({
                          ...prev,
                          serviceId: Number(e.target.value),
                        }))
                      }
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    findServiceName(order.serviceId)
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <select
                      className="form-select"
                      value={editState.productId}
                      onChange={(e) =>
                        setEditState((prev) => ({
                          ...prev,
                          productId: Number(e.target.value),
                        }))
                      }
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    findProductName(order.productId)
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={editState.productQty}
                      onChange={(e) =>
                        setEditState((prev) => ({
                          ...prev,
                          productQty: Number(e.target.value),
                        }))
                      }
                    />
                  ) : (
                    order.productQty || 1
                  )}
                </td>
                <td>
                  {isEditing ? editTotal.toLocaleString() : order.totalPrice?.toLocaleString()}
                </td>
                <td>
                  {isEditing ? (
                    <>
                      <button className="btn btn-sm btn-success me-2" onClick={saveEdit}>
                        Save
                      </button>
                      <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => startEdit(order)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteOrder(order.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;
