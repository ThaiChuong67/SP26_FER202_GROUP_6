import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import CustomersPage from './components/CustomersPage';

function App() {
  return (
    <Router>
      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Barber Shop</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/customers">Customers</Link>
                </li>
                {/* add more top links as needed */}
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <div className="d-flex">
        <aside className="bg-light border-end sidebar">
          <div className="p-3">
            <h5>Menu</h5>
            <Link className="d-block mb-2" to="/">Home</Link>
            <Link className="d-block mb-2" to="/customers">Customers</Link>
            {/* future links: Services, Products, Orders, Dashboard */}
          </div>
        </aside>
        <main className="flex-grow-1 p-3">
          <Routes>
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/" element={<h1>Welcome to Barber Shop</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
