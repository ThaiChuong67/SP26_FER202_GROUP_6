import React,{useEffect,useState} from "react";
import axios from "axios";

function OrderList(){

const [orders,setOrders]=useState([]);
const [services,setServices]=useState([]);
const [products,setProducts]=useState([]);
const [customers,setCustomers]=useState([]);
const [error,setError]=useState(null);

useEffect(()=>{
  const load = async () => {
    try {
      const [oRes, sRes, pRes, cRes] = await Promise.all([
        axios.get("http://localhost:3001/orders"),
        axios.get("http://localhost:3001/services"),
        axios.get("http://localhost:3001/products"),
        axios.get("http://localhost:3001/customers"),
      ]);

      setOrders(oRes.data);
      setServices(sRes.data);
      setProducts(pRes.data);
      setCustomers(cRes.data);
    } catch (err) {
      console.error("Failed to load data", err);
      setError(err);
    }
  };

  load();
}, []);

const deleteOrder = (id)=>{
  axios.delete(`http://localhost:3001/orders/${id}`)
    .then(()=>{
      setOrders(orders.filter(o=>o.id!==id));
    })
    .catch((err) => {
      console.error("Failed to delete order", err);
      setError(err);
    });
};

const getName = (list, id) => {
const item = list.find(i=>i.id===id);
return item ? item.name : "-";
};

return(

<div className="container py-4">
  <div className="card">
    <div className="card-body">
      <h2 className="card-title mb-4">Order List</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          Unable to load orders: {error.message || "Network error"}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
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
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={()=>deleteOrder(o.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

);

}

export default OrderList;