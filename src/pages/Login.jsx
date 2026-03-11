import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    const ok = login({ email, password });
    if (!ok) {
      setError("Invalid credentials. Use admin@admin.com / admin123");
      return;
    }

    navigate("/");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4">Login</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={submit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>
              <div className="mt-3 small text-muted">
                Demo account: <strong>admin@admin.com</strong> / <strong>admin123</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
