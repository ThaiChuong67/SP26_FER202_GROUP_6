import React,{useEffect,useState} from "react";
import axios from "axios";

function OrderList(){

const [orders,setOrders]=useState([]);
const [services,setServices]=useState([]);
const [products,setProducts]=useState([]);
const [customers,setCustomers]=useState([]);

useEffect(()=>{

axios.get("http://localhost:3001/orders")
.then(res=>setOrders(res.data));

axios.get("http://localhost:3001/services")
.then(res=>setServices(res.data));

axios.get("http://localhost:3001/products")
.then(res=>setProducts(res.data));

axios.get("http://localhost:3001/customers")
.then(res=>setCustomers(res.data));

},[]);

const deleteOrder = (id)=>{

axios.delete(`http://localhost:3001/orders/${id}`)
.then(()=>{

setOrders(orders.filter(o=>o.id!==id));

});

};

const getName = (list, id) => {
const item = list.find(i=>i.id===id);
return item ? item.name : "-";
};

return(

<div>

<h2>Order List</h2>

<table border="1">

<thead>

<tr>
<th>ID</th>
<th>Customer</th>
<th>Service</th>
<th>Product</th>
<th>Date</th>
<th>Total Price</th>
<th>Action</th>
</tr>

</thead>

<tbody>

{orders.map(o=>(

<tr key={o.id}>

<td>{o.id}</td>
<td>{getName(customers, o.customerId)}</td>
<td>{getName(services, o.serviceId)}</td>
<td>{o.productId ? getName(products, o.productId) : "(none)"}</td>
<td>{o.date ? new Date(o.date).toLocaleString() : "-"}</td>
<td>{o.totalPrice}</td>

<td>

<button onClick={()=>deleteOrder(o.id)}>
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