import React, { useEffect, useState } from "react";
import axios from "axios";

const initialForm = { id: null, name: "", price: "", duration: "", description: "" };

export default function ServiceList() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    axios.get("http://localhost:3001/services").then((res) => setServices(res.data));
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
    if (!form.price || Number(form.price) <= 0) return "Price must be greater than 0.";
    if (!form.duration || Number(form.duration) <= 0) return "Duration must be greater than 0.";
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
      price: Number(form.price),
      duration: Number(form.duration),
      description: form.description.trim(),
    };

    const request = isEditing
      ? axios.put(`http://localhost:3001/services/${form.id}`, payload)
      : axios.post("http://localhost:3001/services", payload);

    request.then(() => {
      load();
      resetForm();
    });
  };

  const startEdit = (service) => {
    setForm({
      id: service.id,
      name: service.name,
      price: service.price,
      duration: service.duration,
      description: service.description || "",
    });
    setIsEditing(true);
    setError("");
  };

  const deleteItem = (id) => {
    if (!window.confirm("Delete this service?")) return;
    axios.delete(`http://localhost:3001/services/${id}`).then(() => load());
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-5">
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title">{isEditing ? "Edit Service" : "Add Service"}</h4>
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
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
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
              <h4 className="card-title">Service List</h4>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Duration</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s) => (
                      <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>{s.name}</td>
                        <td>{s.price}</td>
                        <td>{s.duration}</td>
                        <td>{s.description}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(s)}>
                            Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => deleteItem(s.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {services.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-3">
                          No services found.
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
