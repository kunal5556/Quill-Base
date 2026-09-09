import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../features/auth/authApi";
import { selectCurrentUser, setCredentials } from "../features/auth/authSlice";
import getErrorMessage from "../utils/getErrorMessage";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [formErrors, setFormErrors] = useState({});

  const [register, { isLoading, error }] = useRegisterMutation();
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};

    if (form.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailPattern.test(form.email)) {
      errors.email = "Please enter a valid email";
    }

    if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (form.confirmPassword !== form.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const result = await register({ name: form.name, email: form.email, password: form.password });

    if (result.data) {
      dispatch(setCredentials(result.data));
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-5">
        <div className="card p-4">
          <h1 className="page-title text-center">Create Account</h1>

          {error && <div className="alert alert-danger">{getErrorMessage(error)}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
                value={form.name}
                onChange={handleChange}
              />
              {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                value={form.email}
                onChange={handleChange}
              />
              {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={`form-control ${formErrors.password ? "is-invalid" : ""}`}
                value={form.password}
                onChange={handleChange}
              />
              {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={`form-control ${formErrors.confirmPassword ? "is-invalid" : ""}`}
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {formErrors.confirmPassword && <div className="invalid-feedback">{formErrors.confirmPassword}</div>}
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-3 mb-0">
            Already registered? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
