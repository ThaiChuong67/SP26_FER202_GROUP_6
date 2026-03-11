import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import MainLayout from "./layout/MainLayout";
import Login from "./pages/Login";
import OrderCreate from "./pages/orders/OrderCreate";
import OrderList from "./pages/orders/OrderList";
import Report from "./pages/orders/Report";
import ServiceList from "./pages/services/ServiceList";
import ProductList from "./pages/products/ProductList";
import CustomerList from "./pages/customers/CustomerList";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="orders/create" replace />} />
            <Route path="orders/create" element={<OrderCreate />} />
            <Route path="orders/list" element={<OrderList />} />
            <Route path="orders/report" element={<Report />} />
            <Route path="services" element={<ServiceList />} />
            <Route path="products" element={<ProductList />} />
            <Route path="customers" element={<CustomerList />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;