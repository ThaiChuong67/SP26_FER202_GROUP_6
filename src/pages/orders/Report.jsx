import React,{useEffect,useState} from "react";
import axios from "axios";

function Report(){

const [orders,setOrders]=useState([]);

useEffect(()=>{

axios.get("http://localhost:3001/orders")
.then(res=>setOrders(res.data));

},[]);

const totalRevenue = orders.reduce(
(sum,o)=> sum + o.totalPrice,0
);

return(

<div>

<h2>Revenue Report</h2>

<h3>Total Revenue: {totalRevenue}</h3>

<h3>Total Orders: {orders.length}</h3>

</div>

);

}

export default Report;