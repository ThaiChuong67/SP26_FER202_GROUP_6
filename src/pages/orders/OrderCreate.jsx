import React, {useEffect,useState} from "react";
import axios from "axios";

function OrderCreate(){

const [services,setServices]=useState([]);
const [products,setProducts]=useState([]);
const [customers,setCustomers]=useState([]);

const [selectedCustomerId,setSelectedCustomerId]=useState("");
const [selectedServiceId,setSelectedServiceId]=useState("");
const [selectedProductId,setSelectedProductId]=useState("");

const [servicePrice,setServicePrice]=useState(0);
const [productPrice,setProductPrice]=useState(0);

const totalPrice = servicePrice + productPrice;

useEffect(()=>{

axios.get("http://localhost:3001/services")
.then(res=>setServices(res.data));

axios.get("http://localhost:3001/products")
.then(res=>setProducts(res.data));

axios.get("http://localhost:3001/customers")
.then(res=>setCustomers(res.data));

},[]);

const handleService = (e)=>{
const serviceId = e.target.value;
setSelectedServiceId(serviceId);

if (!serviceId) {
setServicePrice(0);
return;
}

const service = services.find(s=>String(s.id)===serviceId);
setServicePrice(service ? service.price : 0);
};

const handleProduct = (e)=>{
const productId = e.target.value;
setSelectedProductId(productId);

if (!productId) {
setProductPrice(0);
return;
}

const product = products.find(p=>String(p.id)===productId);
setProductPrice(product ? product.price : 0);
};

const createOrder = ()=>{
if (!selectedCustomerId) {
alert("Please select a customer.");
return;
}

if (!selectedServiceId) {
alert("Please select a service.");
return;
}

const order = {
customerId: Number(selectedCustomerId),
serviceId: Number(selectedServiceId),
productId: selectedProductId ? Number(selectedProductId) : null,
totalPrice,
date: new Date().toISOString()
};

axios.post("http://localhost:3001/orders",order)
.then(()=>{
alert("Order created");
setSelectedCustomerId("");
setSelectedServiceId("");
setSelectedProductId("");
setServicePrice(0);
setProductPrice(0);
});
};

return(

<div className="container py-4">
  <div className="card">
    <div className="card-body">
      <h2 className="card-title mb-4">Create Order</h2>

      <div className="mb-3">
        <label className="form-label">Customer</label>
        <select
          className="form-select"
          value={selectedCustomerId}
          onChange={e=>setSelectedCustomerId(e.target.value)}
        >
          <option value="">Select Customer</option>
          {customers.map(c=>(
            <option key={c.id} value={c.id}>
              {c.name} - {c.phone}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Service</label>
        <select
          className="form-select"
          value={selectedServiceId}
          onChange={handleService}
        >
          <option value="">Select Service</option>
          {services.map(s=>(
            <option key={s.id} value={s.id}>
              {s.name} - {s.price}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Product (optional)</label>
        <select
          className="form-select"
          value={selectedProductId}
          onChange={handleProduct}
        >
          <option value="">Select Product</option>
          {products.map(p=>(
            <option key={p.id} value={p.id}>
              {p.name} - {p.price}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <h5>Total Price: <span className="fw-bold">{totalPrice}</span></h5>
      </div>

      <button className="btn btn-primary" onClick={createOrder}>
        Create Order
      </button>
    </div>
  </div>
</div>

);

}

export default OrderCreate;