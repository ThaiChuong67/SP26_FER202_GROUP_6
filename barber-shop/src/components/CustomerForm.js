import React, { useState, useEffect } from 'react';
import './Customers.css';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10,12}$/;

const CustomerForm = ({ customer, onSave, onCancel }) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || ''
      });
    } else {
      setForm({ name: '', phone: '', email: '' });
    }
    setErrors({});
  }, [customer]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim()) {
      errs.phone = 'Phone is required';
    } else if (!phoneRegex.test(form.phone.trim())) {
      errs.phone = 'Phone must be digits only, 10-12 characters';
    }
    if (form.email && !emailRegex.test(form.email.trim())) {
      errs.email = 'Email is not valid';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input className="form-control" name="name" value={form.name} onChange={handleChange} />
        {errors.name && <div className="error">{errors.name}</div>}
      </div>
      <div className="mb-3">
        <label className="form-label">Phone</label>
        <input className="form-control" name="phone" value={form.phone} onChange={handleChange} />
        {errors.phone && <div className="error">{errors.phone}</div>}
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input className="form-control" name="email" value={form.email} onChange={handleChange} />
        {errors.email && <div className="error">{errors.email}</div>}
      </div>
      <div className="d-flex justify-content-end">
        <button className="btn btn-primary me-2" type="submit">Save</button>
        <button className="btn btn-secondary" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default CustomerForm;
