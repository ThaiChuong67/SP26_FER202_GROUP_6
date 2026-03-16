import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

function AddOrder() {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [serviceId, setServiceId] = useState(null);
  const [productId, setProductId] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [productQty, setProductQty] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (services.length && serviceId === null) {
      setServiceId(services[0].id);
    }
  }, [services, serviceId]);

  useEffect(() => {
    if (products.length && productId === null) {
      setProductId(products[0].id);
    }
  }, [products, productId]);

  useEffect(() => {
    if (customers.length && customerId === null) {
      setCustomerId(customers[0].id);
    }
  }, [customers, customerId]);

  const selectedService = services.find((s) => s.id === Number(serviceId));
  const selectedProduct = products.find((p) => p.id === Number(productId));

  const servicePrice = selectedService?.price || 0;
  const productPrice = selectedProduct?.price || 0;

  const totalPrice = useMemo(
    () => servicePrice + productPrice * (productQty || 0),
    [servicePrice, productPrice, productQty]
  );

  const createOrder = () => {
    if (!customerId) {
      setMessage("Please select a customer.");
      return;
    }

    if (!selectedService) {
      setMessage("Please select a service.");
      return;
    }

    if (!selectedProduct) {
      setMessage("Please select a product.");
      return;
    }

    if (!Number.isInteger(productQty) || productQty < 1) {
      setMessage("Quantity must be a positive integer.");
      return;
    }

    const order = {
      customerId: Number(customerId),
      serviceId: Number(serviceId),
      productId: Number(productId),
      productQty: Number(productQty),
      totalPrice,
      date: new Date().toISOString(),
    };

    axios
      .post("http://localhost:3001/orders", order)
      .then(() => {
        setMessage("Order created successfully.");
        setProductQty(1);
      })
      .catch((err) => {
        console.error("Failed to create order", err);
        setMessage("Unable to create order. Please try again.");
      });
  };

  return (
    <div>
      <h2>Create Order</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="mb-3">
        <label className="form-label">Customer</label>
        <select
          className="form-select"
          value={customerId ?? ""}
          onChange={(e) => setCustomerId(e.target.value)}
        >
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.phone})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Service</label>
        <select
          className="form-select"
          value={serviceId ?? ""}
          onChange={(e) => setServiceId(e.target.value)}
        >
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} - {s.price.toLocaleString()} VND
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Product</label>
        <select
          className="form-select"
          value={productId ?? ""}
          onChange={(e) => setProductId(e.target.value)}
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} - {p.price.toLocaleString()} VND (in stock: {p.quantity})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Product Quantity</label>
        <input
          type="number"
          className="form-control"
          min="1"
          value={productQty}
          onChange={(e) => setProductQty(Number(e.target.value))}
        />
      </div>

      <h4>Total Price: {totalPrice.toLocaleString()} VND</h4>

      <button className="btn btn-primary" onClick={createOrder}>
        Create Order
      </button>
    </div>
  );
}

export default AddOrder;
