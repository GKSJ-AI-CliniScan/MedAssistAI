import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BsShieldCheck,
  BsHeartPulseFill,
  BsLockFill,
  BsEye,
  BsEyeSlash,
  BsArrowRight,
} from "react-icons/bs";

import logo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const formData = new URLSearchParams();

      formData.append("username", email);
      formData.append("password", password);

      const response = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const data = response.data;

      /*
       * Store authentication information
       */

      if (rememberMe) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("patient_id", data.patient_id);
        localStorage.setItem("full_name", data.full_name);
      } else {
        sessionStorage.setItem("access_token", data.access_token);
        sessionStorage.setItem("patient_id", data.patient_id);
        sessionStorage.setItem("full_name", data.full_name);
      }

      /*
       * Login successful
       */

      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);

      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError(
          "Unable to connect to the server. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        background:
          "linear-gradient(135deg, #f4f8ff 0%, #ffffff 50%, #f7f3ff 100%)",
        display: "flex",
        alignItems: "center",
        padding: "60px 20px",
      }}
    >
      <div className="container">
        <div className="row align-items-center justify-content-center g-5">

          {/* ================================================= */}
          {/* LEFT SIDE */}
          {/* ================================================= */}

          <div className="col-lg-6">

            <div
              style={{
                maxWidth: "560px",
                margin: "0 auto",
              }}
            >

              {/* Logo */}

              <div className="d-flex align-items-center mb-4">

                <img
                  src={logo}
                  alt="MedAssist AI"
                  style={{
                    width: "58px",
                    height: "58px",
                    objectFit: "contain",
                  }}
                />

                <div className="ms-3">
                  <h4
                    className="mb-0 fw-bold"
                    style={{
                      color: "#2563eb",
                    }}
                  >
                    MedAssist AI
                  </h4>

                  <small
                    style={{
                      color: "#64748b",
                    }}
                  >
                    AI-Powered Healthcare
                  </small>
                </div>

              </div>

              {/* Badge */}

              <span
                className="badge rounded-pill px-4 py-3 mb-4"
                style={{
                  background: "#dbeafe",
                  color: "#2563eb",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                SECURE HEALTHCARE PLATFORM
              </span>

              {/* Heading */}

              <h1
                style={{
                  fontSize: "3.6rem",
                  lineHeight: "1.1",
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                Welcome
                <br />

                <span
                  style={{
                    background:
                      "linear-gradient(90deg,#2563eb,#7c3aed)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Back!
                </span>
              </h1>

              <p
                style={{
                  marginTop: "22px",
                  fontSize: "1.15rem",
                  lineHeight: "1.8",
                  color: "#64748b",
                  maxWidth: "520px",
                }}
              >
                Access your personalized healthcare dashboard,
                analyze symptoms, view your medical history, and
                manage your health reports securely.
              </p>

              {/* Feature Cards */}

              <div className="mt-5">

                {/* Security */}

                <div
                  className="d-flex align-items-center mb-4"
                  style={{
                    padding: "18px",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,.75)",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "14px",
                      background: "#eff6ff",
                      color: "#2563eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                    }}
                  >
                    <BsShieldCheck />
                  </div>

                  <div className="ms-3">
                    <h6 className="fw-bold mb-1">
                      Secure & Private
                    </h6>

                    <small className="text-secondary">
                      Your health information is protected.
                    </small>
                  </div>
                </div>

                {/* AI */}

                <div
                  className="d-flex align-items-center mb-4"
                  style={{
                    padding: "18px",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,.75)",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "14px",
                      background: "#f5f3ff",
                      color: "#7c3aed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                    }}
                  >
                    <BsHeartPulseFill />
                  </div>

                  <div className="ms-3">
                    <h6 className="fw-bold mb-1">
                      AI-Powered Healthcare
                    </h6>

                    <small className="text-secondary">
                      Intelligent disease prediction and analysis.
                    </small>
                  </div>
                </div>

                {/* Reports */}

                <div
                  className="d-flex align-items-center"
                  style={{
                    padding: "18px",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,.75)",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "14px",
                      background: "#ecfdf5",
                      color: "#059669",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                    }}
                  >
                    <BsLockFill />
                  </div>

                  <div className="ms-3">
                    <h6 className="fw-bold mb-1">
                      Complete Health Records
                    </h6>

                    <small className="text-secondary">
                      Access your reports and medical history anytime.
                    </small>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* ================================================= */}
          {/* RIGHT SIDE - LOGIN CARD */}
          {/* ================================================= */}

          <div className="col-lg-5">

            <div
              style={{
                background: "#ffffff",
                borderRadius: "28px",
                padding: "45px",
                boxShadow:
                  "0 25px 70px rgba(37,99,235,.12)",
                border: "1px solid rgba(226,232,240,.8)",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >

              {/* Card Header */}

              <div className="text-center mb-4">

                <div
                  style={{
                    width: "65px",
                    height: "65px",
                    margin: "0 auto 18px",
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg,#2563eb,#7c3aed)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "28px",
                    boxShadow:
                      "0 12px 30px rgba(99,102,241,.25)",
                  }}
                >
                  <BsLockFill />
                </div>

                <h2
                  className="fw-bold mb-2"
                  style={{
                    color: "#111827",
                  }}
                >
                  Sign In
                </h2>

                <p
                  className="text-secondary mb-0"
                >
                  Login to your MedAssist AI account
                </p>

              </div>

              {/* Error */}

              {error && (
                <div
                  className="alert alert-danger"
                  style={{
                    borderRadius: "12px",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Form */}

              <form onSubmit={handleLogin}>

                {/* Email */}

                <div className="mb-4">

                  <label
                    className="form-label fw-semibold"
                  >
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    style={{
                      height: "54px",
                      borderRadius: "12px",
                      border: "1px solid #dbe3ef",
                      padding: "0 16px",
                    }}
                  />

                </div>

                {/* Password */}

                <div className="mb-3">

                  <label
                    className="form-label fw-semibold"
                  >
                    Password
                  </label>

                  <div
                    style={{
                      position: "relative",
                    }}
                  >

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      className="form-control"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      style={{
                        height: "54px",
                        borderRadius: "12px",
                        border: "1px solid #dbe3ef",
                        padding: "0 50px 0 16px",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      style={{
                        position: "absolute",
                        right: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        border: "none",
                        background: "transparent",
                        color: "#64748b",
                        fontSize: "20px",
                      }}
                    >
                      {showPassword ? (
                        <BsEyeSlash />
                      ) : (
                        <BsEye />
                      )}
                    </button>

                  </div>

                </div>

                {/* Remember + Forgot */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                  <div className="form-check">

                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) =>
                        setRememberMe(
                          e.target.checked
                        )
                      }
                    />

                    <label
                      className="form-check-label text-secondary"
                      htmlFor="rememberMe"
                    >
                      Remember me
                    </label>

                  </div>

                  <a
                    href="#"
                    style={{
                      color: "#2563eb",
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    Forgot Password?
                  </a>

                </div>

                {/* Login Button */}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn w-100 text-white"
                  style={{
                    height: "56px",
                    borderRadius: "14px",
                    border: "none",
                    fontSize: "17px",
                    fontWeight: 700,
                    background:
                      "linear-gradient(90deg,#2563eb,#7c3aed)",
                    boxShadow:
                      "0 12px 28px rgba(99,102,241,.25)",
                  }}
                >

                  {loading ? (
                    "Signing In..."
                  ) : (
                    <>
                      Sign In
                      <BsArrowRight className="ms-2" />
                    </>
                  )}

                </button>

              </form>

              {/* Register */}

              <div className="text-center mt-4">

                <span className="text-secondary">
                  Don't have an account?{" "}
                </span>

                <Link
                  to="/register"
                  style={{
                    color: "#2563eb",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  Create Account
                </Link>

              </div>

              {/* Security Message */}

              <div
                className="text-center mt-4 pt-4"
                style={{
                  borderTop: "1px solid #eef2f7",
                }}
              >

                <small
                  className="text-secondary"
                >
                  <BsShieldCheck
                    className="me-1"
                    style={{
                      color: "#2563eb",
                    }}
                  />

                  Your connection is secure and protected.
                </small>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;