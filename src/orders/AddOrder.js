import React, { useState } from "react";
import axios from "axios";

function AddOrder() {

  const [servicePrice, setServicePrice] = useState(0);
  const [productPrice, setProductPrice] = useState(0);

  const totalPrice = servicePrice + productPrice;

  const createOrder = () => {

    const order = {
      serviceId: 1,
      productId: 1,
      totalPrice: totalPrice
    };

    axios
      .post("http://localhost:3001/orders", order)
      .then(() => alert("Order Created"))
      .catch((err) => {
        console.error("Failed to create order", err);
        alert("Unable to create order. Please try again.");
      });
  };

  return (

    <div>

      <h2>Create Order</h2>

      <button onClick={()=>setServicePrice(100000)}>
        Haircut
      </button>

      <button onClick={()=>setProductPrice(70000)}>
        Hair Wax
      </button>

      <h3>Total Price: {totalPrice}</h3>

      <button onClick={createOrder}>
        Create Order
      </button>

    </div>

  );
}

export default AddOrder;