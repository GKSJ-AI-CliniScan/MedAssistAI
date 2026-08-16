import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHeartbeat,
  FaUserShield,
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
} from "react-icons/fa";

import "../css/AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // Handle Input Changes
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // =====================================================
  // Admin Login
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      /*
       * FastAPI OAuth2PasswordRequestForm expects:
       *
       * username
       * password
       *
       * Therefore we use URLSearchParams instead of JSON.
       */

      const loginData = new URLSearchParams();

      loginData.append("username", formData.email.trim());
      loginData.append("password", formData.password);

      const response = await axios.post(
        "http://127.0.0.1:8000/admin/login",
        loginData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const data = response.data;

      // =================================================
      // Store Admin Session
      // =================================================

      localStorage.setItem(
        "admin_access_token",
        data.access_token
      );

      localStorage.setItem(
        "admin_id",
        data.admin_id
      );

      localStorage.setItem(
        "admin_full_name",
        data.full_name
      );

      localStorage.setItem(
        "admin_role",
        data.role
      );

      // =================================================
      // Redirect
      // =================================================

      navigate("/admin/dashboard");

    } catch (err) {
      console.error("Admin Login Error:", err);

      if (err.response) {
        setError(
          err.response.data?.detail ||
            "Invalid email or password."
        );
      } else if (err.request) {
        setError(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="admin-login-page">

      {/* =================================================
          Left Branding Section
      ================================================= */}

      <div className="admin-login-brand">

        <div className="admin-brand-content">

          <div className="admin-brand-logo">
            <FaHeartbeat />
          </div>

          <h1>MedAssist AI</h1>

          <p className="admin-brand-tagline">
            AI-Powered Healthcare
          </p>

          <div className="admin-brand-divider"></div>

          <h2>
            Administration Portal
          </h2>

          <p className="admin-brand-description">
            Securely manage patients, reports,
            health analytics, and healthcare
            system information.
          </p>

          <div className="admin-security-info">

            <FaShieldAlt />

            <span>
              Secure Administrator Access
            </span>

          </div>

        </div>

      </div>

      {/* =================================================
          Right Login Section
      ================================================= */}

      <div className="admin-login-section">

        <div className="admin-login-card">

          {/* Header */}

          <div className="admin-login-header">

            <div className="admin-login-icon">
              <FaUserShield />
            </div>

            <h2>
              Admin Login
            </h2>

            <p>
              Sign in to access the administration
              dashboard.
            </p>

          </div>

          {/* Error */}

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          {/* Form */}

          <form onSubmit={handleSubmit}>

            {/* Email */}

            <div className="admin-form-group">

              <label htmlFor="admin-email">
                Email Address
              </label>

              <div className="admin-input-wrapper">

                <FaEnvelope className="admin-input-icon" />

                <input
                  id="admin-email"
                  type="email"
                  name="email"
                  placeholder="Enter admin email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

            </div>

            {/* Password */}

            <div className="admin-form-group">

              <label htmlFor="admin-password">
                Password
              </label>

              <div className="admin-input-wrapper">

                <FaLock className="admin-input-icon" />

                <input
                  id="admin-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter admin password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>

            {/* Login Button */}

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="admin-spinner"></span>
                  Signing In...
                </>
              ) : (
                <>
                  <FaSignInAlt />
                  Sign In
                </>
              )}

            </button>

          </form>

          {/* Footer */}

          <div className="admin-login-footer">

            <FaShieldAlt />

            <span>
              This area is restricted to authorized
              administrators only.
            </span>

          </div>

          <div className="admin-login-copyright">
            © {new Date().getFullYear()} MedAssist AI
          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;