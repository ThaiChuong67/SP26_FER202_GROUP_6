import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import OrderCreate from "./pages/orders/OrderCreate";
import OrderList from "./pages/orders/OrderList";
import Report from "./pages/orders/Report";
import ServiceList from "./pages/services/ServiceList";
import ProductList from "./pages/products/ProductList";
import CustomerList from "./pages/customers/CustomerList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="orders/create" replace />} />
            <Route path="orders/create" element={<OrderCreate />} />
            <Route path="orders/list" element={<OrderList />} />
            <Route path="orders/report" element={<Report />} />
            <Route path="services" element={<ServiceList />} />
            <Route path="products" element={<ProductList />} />
            <Route path="customers" element={<CustomerList />} />
          </Route>

          <Route path="*" element={<Navigate to="/orders/create" replace />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;