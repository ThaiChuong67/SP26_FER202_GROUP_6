import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function MainLayout() {
  const linkClass = ({ isActive }) =>
    "nav-link text-white" + (isActive ? " active" : "");

  return (
    <div className="d-flex vh-100">
      <aside className="bg-dark text-white p-3" style={{ width: 220 }}>
        <div className="mb-4">
          <h5 className="mb-1">Barber Admin</h5>
        </div>

        <nav className="nav flex-column">
          <NavLink to="/orders/create" className={linkClass}>
            Create Order
          </NavLink>
          <NavLink to="/orders/list" className={linkClass}>
            Order List
          </NavLink>
          <NavLink to="/orders/report" className={linkClass}>
            Report
          </NavLink>
          <hr className="border-secondary" />
          <NavLink to="/services" className={linkClass}>
            Services
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/customers" className={linkClass}>
            Customers
          </NavLink>
        </nav>
      </aside>

      <main className="flex-grow-1 bg-light">
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
