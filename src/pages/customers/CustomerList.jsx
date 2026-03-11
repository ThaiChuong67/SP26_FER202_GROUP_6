import React, { useEffect, useState } from "react";
import axios from "axios";

const initialForm = { id: null, name: "", phone: "", email: "" };

const emailIsValid = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [searchPhone, setSearchPhone] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    axios.get("http://localhost:3001/customers").then((res) => setCustomers(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setIsEditing(false);
    setError("");
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.phone.trim()) return "Phone is required.";
    if (!form.email.trim() || !emailIsValid(form.email)) return "Email is invalid.";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
    };

    const request = isEditing
      ? axios.put(`http://localhost:3001/customers/${form.id}`, payload)
      : axios.post("http://localhost:3001/customers", payload);

    request.then(() => {
      load();
      resetForm();
    });
  };

  const startEdit = (customer) => {
    setForm({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
    });
    setIsEditing(true);
    setError("");
  };

  const deleteItem = (id) => {
    if (!window.confirm("Delete this customer?")) return;
    axios.delete(`http://localhost:3001/customers/${id}`).then(() => load());
  };

  const filtered = customers.filter((c) =>
    c.phone.toLowerCase().includes(searchPhone.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-5">
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title">{isEditing ? "Edit Customer" : "Add Customer"}</h4>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-control"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit">
                    {isEditing ? "Save" : "Add"}
                  </button>
                  {isEditing && (
                    <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="card-title">Customer List</h4>
                <div className="w-50">
                  <input
                    className="form-control"
                    placeholder="Search by phone"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.name}</td>
                        <td>{c.phone}</td>
                        <td>{c.email}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => startEdit(c)}
                          >
                            Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => deleteItem(c.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-3">
                          No customers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
