import React, { useEffect, useState } from "react";
import axios from "axios";

function Report(){

  const [orders,setOrders]=useState([]);

  useEffect(()=>{

    axios.get("http://localhost:3001/orders")
      .then(res=>setOrders(res.data));

  },[]);

  const totalRevenue = orders.reduce(
    (sum,order)=> sum + order.totalPrice,0
  );

  return(

    <div>

      <h2>Revenue Report</h2>

      <h3>Total Revenue: {totalRevenue}</h3>

      <p>Total Orders: {orders.length}</p>

    </div>

  );

}

export default Report;