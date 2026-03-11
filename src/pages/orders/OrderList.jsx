import React,{useEffect,useState} from "react";
import axios from "axios";

function OrderList(){

const [orders,setOrders]=useState([]);

useEffect(()=>{

axios.get("http://localhost:3001/orders")
.then(res=>setOrders(res.data));

},[]);

const deleteOrder = (id)=>{

axios.delete(`http://localhost:3001/orders/${id}`)
.then(()=>{

setOrders(orders.filter(o=>o.id!==id));

});

};

return(

<div>

<h2>Order List</h2>

<table border="1">

<thead>

<tr>
<th>ID</th>
<th>Total Price</th>
<th>Action</th>
</tr>

</thead>

<tbody>

{orders.map(o=>(

<tr key={o.id}>

<td>{o.id}</td>
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