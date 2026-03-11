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

<div className="container py-4">
  <div className="card">
    <div className="card-body">
      <h2 className="card-title mb-4">Revenue Report</h2>

      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card bg-light">
            <div className="card-body">
              <h5 className="card-title">Totals</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Total Revenue: <strong>{totalRevenue}</strong></li>
                <li className="list-group-item">Total Orders: <strong>{orders.length}</strong></li>
                <li className="list-group-item">Total Services: <strong>{services.length}</strong></li>
                <li className="list-group-item">Total Products: <strong>{products.length}</strong></li>
                <li className="list-group-item">Total Customers: <strong>{customers.length}</strong></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card bg-light">
            <div className="card-body">
              <h5 className="card-title">Best Sellers</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Best Selling Service: <strong>{bestService}</strong></li>
                <li className="list-group-item">Best Selling Product: <strong>{bestProduct}</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

);

}

export default Report;