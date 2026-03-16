import axios from 'axios';

const API_URL = 'http://localhost:3000/customers'; // assuming JSON Server runs here

export const getCustomers = (query = '') => {
  // allow search by phone with ?phone_like=
  const url = query ? `${API_URL}?phone_like=${encodeURIComponent(query)}` : API_URL;
  return axios.get(url);
};

export const addCustomer = (customer) => {
  return axios.post(API_URL, customer);
};

export const updateCustomer = (id, customer) => {
  return axios.put(`${API_URL}/${id}`, customer);
};

export const deleteCustomer = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
