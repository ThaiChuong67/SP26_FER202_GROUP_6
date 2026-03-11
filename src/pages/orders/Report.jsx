import React,{useEffect,useState} from "react";
import axios from "axios";

function Report(){

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

const totalRevenue = orders.reduce((sum,o)=> sum + o.totalPrice,0);

const countById = (items, key) => {
return items.reduce((acc,item)=>{
if (!item[key]) return acc;
acc[item[key]] = (acc[item[key]] || 0) + 1;
return acc;
}, {});
};

const topItem = (counts, list) => {
const entries = Object.entries(counts);
if (!entries.length) return "-";
const [bestId] = entries.reduce((best, current) => current[1] > best[1] ? current : best);
const found = list.find(i=>String(i.id)===String(bestId));
return found ? found.name : "-";
};

const serviceCounts = countById(orders, "serviceId");
const productCounts = countById(orders, "productId");

const bestService = topItem(serviceCounts, services);
const bestProduct = topItem(productCounts, products);

return(

<div>

<h2>Revenue Report</h2>

<h3>Total Revenue: {totalRevenue}</h3>

<h3>Total Orders: {orders.length}</h3>

<h3>Total Services: {services.length}</h3>
<h3>Total Products: {products.length}</h3>
<h3>Total Customers: {customers.length}</h3>

<h3>Best Selling Service: {bestService}</h3>
<h3>Best Selling Product: {bestProduct}</h3>

</div>

);

}

export default Report;