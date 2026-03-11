import React, { useEffect, useState } from "react";
import axios from "axios";

const initialForm = {
  id: null,
  name: "",
  price: "",
  quantity: "",
  image: "",
  description: "",
};

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    axios.get("http://localhost:3001/products").then((res) => setProducts(res.data));
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
    if (!form.quantity || Number(form.quantity) < 0) return "Quantity must be 0 or greater.";
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
      quantity: Number(form.quantity),
      image: form.image.trim(),
      description: form.description.trim(),
    };

    const request = isEditing
      ? axios.put(`http://localhost:3001/products/${form.id}`, payload)
      : axios.post("http://localhost:3001/products", payload);

    request.then(() => {
      load();
      resetForm();
    });
  };

  const startEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      image: product.image || "",
      description: product.description || "",
    });
    setIsEditing(true);
    setError("");
  };

  const deleteItem = (id) => {
    if (!window.confirm("Delete this product?")) return;
    axios.delete(`http://localhost:3001/products/${id}`).then(() => load());
  };

  const filtered = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => {
      if (minPrice && Number(p.price) < Number(minPrice)) return false;
      if (maxPrice && Number(p.price) > Number(maxPrice)) return false;
      return true;
    });

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-5">
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title">{isEditing ? "Edit Product" : "Add Product"}</h4>
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
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Image URL</label>
                  <input
                    className="form-control"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
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
          <div className="card mb-3">
            <div className="card-body">
              <div className="row g-2">
                <div className="col">
                  <input
                    className="form-control"
                    placeholder="Search by name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Min price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Product List</h4>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td>{p.price}</td>
                        <td>{p.quantity}</td>
                        <td>
                          {p.quantity > 0 ? (
                            <span className="badge bg-success">In stock</span>
                          ) : (
                            <span className="badge bg-danger">Out of stock</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => startEdit(p)}
                          >
                            Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => deleteItem(p.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-3">
                          No products found.
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
