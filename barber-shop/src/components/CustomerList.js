import React, { useState, useEffect } from 'react';
import { getCustomers, deleteCustomer } from '../services/customerService';
import './Customers.css';

const CustomerList = ({ onEdit }) => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCustomers(query);
      setCustomers(res.data);
    } catch (err) {
      setError('Unable to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearch(q);
    fetchCustomers(q);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await deleteCustomer(id);
      fetchCustomers(search);
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="customer-page">
      <h2 className="text-center mb-4">Customers</h2>
      <div className="d-flex justify-content-between mb-2">
        <button className="btn btn-primary" onClick={() => onEdit(null)}>Add new</button>
        <div className="d-flex gap-2 w-50">
          <input
            className="form-control"
            type="text"
            placeholder="Search by phone"
            value={search}
            onChange={handleSearchChange}
          />
          <button className="btn btn-outline-secondary" onClick={() => fetchCustomers(search)}>Refresh</button>
        </div>
      </div>
      {loading && <p>Loading customers...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && customers.length === 0 && <p>No customers found.</p>}
      {customers.length > 0 && (
        <table className="table table-striped">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
                <td>
                  <button className="btn btn-sm btn-secondary me-1" onClick={() => onEdit(c)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerList;
