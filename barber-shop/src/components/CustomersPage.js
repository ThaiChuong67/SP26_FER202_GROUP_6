import React, { useState } from 'react';
import CustomerList from './CustomerList';
import CustomerForm from './CustomerForm';
import { addCustomer, updateCustomer } from '../services/customerService';

const CustomersPage = () => {
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSave = async (customer) => {
    try {
      if (editingCustomer && editingCustomer.id) {
        await updateCustomer(editingCustomer.id, customer);
      } else {
        await addCustomer(customer);
      }
      setEditingCustomer(null);
      // force refresh list by bumping key
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert('Failed to save customer');
    }
  };

  const handleEdit = (cust) => {
    setEditingCustomer(cust);
  };

  const handleCancel = () => {
    setEditingCustomer(null);
  };

  return (
    <div className="customer-page">
      {editingCustomer !== null ? (
        <CustomerForm customer={editingCustomer} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <CustomerList key={refreshKey} onEdit={handleEdit} />
      )}
    </div>
  );
};

export default CustomersPage;
