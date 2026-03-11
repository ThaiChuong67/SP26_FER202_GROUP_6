import React, {useEffect,useState} from "react";
import axios from "axios";

function OrderCreate(){

const [services,setServices]=useState([]);
const [products,setProducts]=useState([]);

const [servicePrice,setServicePrice]=useState(0);
const [productPrice,setProductPrice]=useState(0);

const totalPrice = servicePrice + productPrice;

useEffect(()=>{

axios.get("http://localhost:3001/services")
.then(res=>setServices(res.data));

axios.get("http://localhost:3001/products")
.then(res=>setProducts(res.data));

},[]);

const handleService = (e)=>{

const price = Number(e.target.value);
setServicePrice(price);

};

const handleProduct = (e)=>{

const price = Number(e.target.value);
setProductPrice(price);

};

const createOrder = ()=>{

const order = {
servicePrice,
productPrice,
totalPrice
};

axios.post("http://localhost:3001/orders",order)
.then(()=>alert("Order created"));

};

return(

<div>

<h2>Create Order</h2>

<select onChange={handleService}>

<option>Select Service</option>

{services.map(s=>(

<option key={s.id} value={s.price}>
{s.name} - {s.price}
</option>

))}

</select>

<br/>

<select onChange={handleProduct}>

<option>Select Product</option>

{products.map(p=>(

<option key={p.id} value={p.price}>
{p.name} - {p.price}
</option>

))}

</select>

<h3>Total Price: {totalPrice}</h3>

<button onClick={createOrder}>
Create Order
</button>

</div>

);

}

export default OrderCreate;