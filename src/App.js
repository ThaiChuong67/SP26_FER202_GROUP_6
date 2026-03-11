import OrderCreate from "./pages/orders/OrderCreate";
import OrderList from "./pages/orders/OrderList";
import Report from "./pages/orders/Report";

function App(){

return(

<div className="container py-4">
  <OrderCreate />
  <hr />
  <OrderList />
  <hr />
  <Report />
</div>

);

}

export default App;