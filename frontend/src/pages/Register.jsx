import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  BsShieldCheck,
  BsHeartPulseFill,
  BsEye,
  BsEyeSlash,
  BsPersonPlusFill,
  BsArrowRight,
  BsPerson,
  BsEnvelope,
  BsTelephone,
  BsCalendar3,
  BsGeoAltFill,
  BsCloudArrowUp,
  BsFileEarmarkMedicalFill,
  BsLockFill,
} from "react-icons/bs";

import logo from "../assets/logo.png";

function Register() {
  const navigate = useNavigate();

  // ==========================================
  // Form State
  // ==========================================

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    blood_group: "",
    address: "",
    emergency_contact: "",
    password: "",
    confirm_password: "",
    photo: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // Handle Input Change
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==========================================
  // Handle Photo
  // ==========================================

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Maximum 2 MB
    if (file.size > 2 * 1024 * 1024) {
      setError("Profile photo must be less than 2 MB.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }

    // Convert image to Base64
    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((previous) => ({
        ...previous,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);

    setError("");
  };

  // ==========================================
  // Registration
  // ==========================================

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ========================================
    // Required Fields
    // ========================================

    if (
      !formData.full_name ||
      !formData.email ||
      !formData.phone ||
      !formData.age ||
      !formData.gender ||
      !formData.password ||
      !formData.confirm_password
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    // ========================================
    // Password Check
    // ========================================

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    // ========================================
    // Age Validation
    // ========================================

    if (Number(formData.age) <= 0) {
      setError("Please enter a valid age.");
      return;
    }

    try {
      setLoading(true);

      // ======================================
      // Data sent to FastAPI
      // ======================================

      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        age: Number(formData.age),
        gender: formData.gender,
        blood_group: formData.blood_group,
        address: formData.address,
        emergency_contact: formData.emergency_contact,
        password: formData.password,
        photo: formData.photo,
      };

      // ======================================
      // Backend API
      // ======================================

      const response = await axios.post(
        "http://127.0.0.1:8000/auth/register",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Registration Success:", response.data);

      setSuccess(
        `Registration successful! Your Patient ID is ${response.data.patient_id}.`
      );

      // ======================================
      // Redirect to Login
      // ======================================

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration Error:", err);

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
        padding: "45px 20px 70px",
      }}
    >
      <div className="container">
        <div className="row align-items-start justify-content-center g-5">

          {/* ================================================= */}
          {/* LEFT SIDE */}
          {/* ================================================= */}

          <div className="col-lg-4">

            <div
              style={{
                maxWidth: "480px",
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
                      fontSize: "27px",
                    }}
                  >
                    MedAssist AI
                  </h4>

                  <small
                    style={{
                      color: "#64748b",
                      fontSize: "15px",
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
                <BsShieldCheck className="me-2" />
                SECURE HEALTHCARE PLATFORM
              </span>

              {/* Heading */}

              <h1
                style={{
                  fontSize: "3.4rem",
                  lineHeight: "1.1",
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                Create Your
                <br />

                <span
                  style={{
                    background:
                      "linear-gradient(90deg,#2563eb,#7c3aed)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Account
                </span>
              </h1>

              <p
                style={{
                  marginTop: "22px",
                  fontSize: "1.1rem",
                  lineHeight: "1.8",
                  color: "#64748b",
                  maxWidth: "450px",
                }}
              >
                Join MedAssist AI and take the first step towards
                better health. Get personalized insights,
                AI-powered analysis, and comprehensive health
                management.
              </p>

              {/* ================================================= */}
              {/* FEATURE CARDS */}
              {/* ================================================= */}

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
                      Your data is encrypted and protected with
                      enterprise-grade security.
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
                      Advanced AI algorithms provide accurate
                      health predictions and personalized
                      recommendations.
                    </small>

                  </div>

                </div>

                {/* Records */}

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
                    <BsFileEarmarkMedicalFill />
                  </div>

                  <div className="ms-3">

                    <h6 className="fw-bold mb-1">
                      Complete Health Records
                    </h6>

                    <small className="text-secondary">
                      Store and manage your medical history and
                      health reports securely.
                    </small>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* ================================================= */}
          {/* RIGHT SIDE - REGISTRATION CARD */}
          {/* ================================================= */}

          <div className="col-lg-7">

            <div
              style={{
                background: "#ffffff",
                borderRadius: "28px",
                padding: "38px",
                boxShadow:
                  "0 25px 70px rgba(37,99,235,.12)",
                border: "1px solid rgba(226,232,240,.8)",
                maxWidth: "850px",
                margin: "0 auto",
              }}
            >

              {/* ================================================= */}
              {/* CARD HEADER */}
              {/* ================================================= */}

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
                  <BsPersonPlusFill />
                </div>

                <h2
                  className="fw-bold mb-2"
                  style={{
                    color: "#111827",
                  }}
                >
                  Create Your Account
                </h2>

                <p className="text-secondary mb-0">
                  Please fill in your details to get started
                </p>

              </div>

              <hr
                style={{
                  borderColor: "#eef2f7",
                  marginBottom: "24px",
                }}
              />

              {/* ERROR */}

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

              {/* SUCCESS */}

              {success && (
                <div
                  className="alert alert-success"
                  style={{
                    borderRadius: "12px",
                    fontSize: "14px",
                  }}
                >
                  {success}
                  <br />
                  Redirecting to login...
                </div>
              )}

              {/* FORM */}

              <form onSubmit={handleRegister}>

                {/* =============================================== */}
                {/* ROW 1 */}
                {/* =============================================== */}

                <div className="row">

                  {/* Full Name */}

                  <div className="col-md-6 mb-4">

                    <label className="form-label fw-semibold">
                      Full Name{" "}
                      <span style={{ color: "#dc2626" }}>*</span>
                    </label>

                    <div style={{ position: "relative" }}>

                      <BsPerson
                        style={{
                          position: "absolute",
                          left: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#64748b",
                          fontSize: "19px",
                        }}
                      />

                      <input
                        type="text"
                        name="full_name"
                        className="form-control"
                        placeholder="Enter your full name"
                        value={formData.full_name}
                        onChange={handleChange}
                        style={{
                          height: "54px",
                          borderRadius: "12px",
                          border: "1px solid #dbe3ef",
                          paddingLeft: "48px",
                        }}
                      />

                    </div>

                  </div>


                  {/* Email */}

                  <div className="col-md-6 mb-4">

                    <label className="form-label fw-semibold">
                      Email Address{" "}
                      <span style={{ color: "#dc2626" }}>*</span>
                    </label>

                    <div style={{ position: "relative" }}>

                      <BsEnvelope
                        style={{
                          position: "absolute",
                          left: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#64748b",
                          fontSize: "18px",
                        }}
                      />

                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        style={{
                          height: "54px",
                          borderRadius: "12px",
                          border: "1px solid #dbe3ef",
                          paddingLeft: "48px",
                        }}
                      />

                    </div>

                  </div>

                </div>


                {/* =============================================== */}
                {/* ROW 2 */}
                {/* =============================================== */}

                <div className="row">

                  {/* Phone */}

                  <div className="col-md-6 mb-4">

                    <label className="form-label fw-semibold">
                      Phone Number{" "}
                      <span style={{ color: "#dc2626" }}>*</span>
                    </label>

                    <div style={{ position: "relative" }}>

                      <BsTelephone
                        style={{
                          position: "absolute",
                          left: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#64748b",
                          fontSize: "18px",
                        }}
                      />

                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{
                          height: "54px",
                          borderRadius: "12px",
                          border: "1px solid #dbe3ef",
                          paddingLeft: "48px",
                        }}
                      />

                    </div>

                  </div>


                  {/* Age */}

                  <div className="col-md-6 mb-4">

                    <label className="form-label fw-semibold">
                      Age{" "}
                      <span style={{ color: "#dc2626" }}>*</span>
                    </label>

                    <div style={{ position: "relative" }}>

                      <BsCalendar3
                        style={{
                          position: "absolute",
                          left: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#64748b",
                          fontSize: "17px",
                        }}
                      />

                      <input
                        type="number"
                        name="age"
                        min="1"
                        max="120"
                        className="form-control"
                        placeholder="Enter your age"
                        value={formData.age}
                        onChange={handleChange}
                        style={{
                          height: "54px",
                          borderRadius: "12px",
                          border: "1px solid #dbe3ef",
                          paddingLeft: "48px",
                        }}
                      />

                    </div>

                  </div>

                </div>


                {/* =============================================== */}
                {/* ROW 3 */}
                {/* =============================================== */}

                <div className="row">

                  {/* Gender */}

                  <div className="col-md-6 mb-4">

                    <label className="form-label fw-semibold">
                      Gender{" "}
                      <span style={{ color: "#dc2626" }}>*</span>
                    </label>

                    <select
                      name="gender"
                      className="form-select"
                      value={formData.gender}
                      onChange={handleChange}
                      style={{
                        height: "54px",
                        borderRadius: "12px",
                        border: "1px solid #dbe3ef",
                        paddingLeft: "16px",
                      }}
                    >

                      <option value="">
                        Select your gender
                      </option>

                      <option value="Male">
                        Male
                      </option>

                      <option value="Female">
                        Female
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>


                  {/* Blood Group */}

                  <div className="col-md-6 mb-4">

                    <label className="form-label fw-semibold">
                      Blood Group
                    </label>

                    <select
                      name="blood_group"
                      className="form-select"
                      value={formData.blood_group}
                      onChange={handleChange}
                      style={{
                        height: "54px",
                        borderRadius: "12px",
                        border: "1px solid #dbe3ef",
                      }}
                    >

                      <option value="">
                        Select your blood group
                      </option>

                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>

                    </select>

                  </div>

                </div>


                {/* =============================================== */}
                {/* ADDRESS */}
                {/* =============================================== */}

                <div className="mb-4">

                  <label className="form-label fw-semibold">
                    Address
                  </label>

                  <div style={{ position: "relative" }}>

                    <BsGeoAltFill
                      style={{
                        position: "absolute",
                        left: "16px",
                        top: "18px",
                        color: "#64748b",
                        fontSize: "18px",
                      }}
                    />

                    <textarea
                      name="address"
                      className="form-control"
                      placeholder="Enter your full address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="2"
                      style={{
                        borderRadius: "12px",
                        border: "1px solid #dbe3ef",
                        paddingLeft: "48px",
                        paddingTop: "15px",
                        resize: "none",
                      }}
                    />

                  </div>

                </div>


                {/* =============================================== */}
                {/* EMERGENCY CONTACT */}
                {/* =============================================== */}

                <div className="mb-4">

                  <label className="form-label fw-semibold">
                    Emergency Contact Number
                  </label>

                  <div style={{ position: "relative" }}>

                    <BsTelephone
                      style={{
                        position: "absolute",
                        left: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#64748b",
                        fontSize: "18px",
                      }}
                    />

                    <input
                      type="tel"
                      name="emergency_contact"
                      className="form-control"
                      placeholder="Enter emergency contact number"
                      value={formData.emergency_contact}
                      onChange={handleChange}
                      style={{
                        height: "54px",
                        borderRadius: "12px",
                        border: "1px solid #dbe3ef",
                        paddingLeft: "48px",
                      }}
                    />

                  </div>

                </div>


                {/* =============================================== */}
                {/* PASSWORD ROW */}
                {/* =============================================== */}

                <div className="row">

                  {/* Password */}

                  <div className="col-md-6 mb-4">

                    <label className="form-label fw-semibold">
                      Password{" "}
                      <span style={{ color: "#dc2626" }}>*</span>
                    </label>

                    <div style={{ position: "relative" }}>

                      <BsLockFill
                        style={{
                          position: "absolute",
                          left: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#64748b",
                          fontSize: "17px",
                        }}
                      />

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        name="password"
                        className="form-control"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{
                          height: "54px",
                          borderRadius: "12px",
                          border: "1px solid #dbe3ef",
                          padding:
                            "0 50px 0 48px",
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                        style={{
                          position: "absolute",
                          right: "15px",
                          top: "50%",
                          transform:
                            "translateY(-50%)",
                          border: "none",
                          background:
                            "transparent",
                          color: "#64748b",
                          fontSize: "19px",
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


                  {/* Confirm Password */}

                  <div className="col-md-6 mb-4">

                    <label className="form-label fw-semibold">
                      Confirm Password{" "}
                      <span style={{ color: "#dc2626" }}>*</span>
                    </label>

                    <div style={{ position: "relative" }}>

                      <BsLockFill
                        style={{
                          position: "absolute",
                          left: "16px",
                          top: "50%",
                          transform:
                            "translateY(-50%)",
                          color: "#64748b",
                          fontSize: "17px",
                        }}
                      />

                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        name="confirm_password"
                        className="form-control"
                        placeholder="Confirm your password"
                        value={
                          formData.confirm_password
                        }
                        onChange={handleChange}
                        style={{
                          height: "54px",
                          borderRadius: "12px",
                          border: "1px solid #dbe3ef",
                          padding:
                            "0 50px 0 48px",
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        style={{
                          position: "absolute",
                          right: "15px",
                          top: "50%",
                          transform:
                            "translateY(-50%)",
                          border: "none",
                          background:
                            "transparent",
                          color: "#64748b",
                          fontSize: "19px",
                        }}
                      >
                        {showConfirmPassword ? (
                          <BsEyeSlash />
                        ) : (
                          <BsEye />
                        )}
                      </button>

                    </div>

                  </div>

                </div>


                {/* =============================================== */}
                {/* PROFILE PHOTO */}
                {/* =============================================== */}

                <div className="mb-4">

                  <label className="form-label fw-semibold">
                    Profile Photo
                  </label>

                  <label
                    htmlFor="profilePhoto"
                    style={{
                      height: "82px",
                      borderRadius: "12px",
                      border:
                        "1px dashed #cbd5e1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      background: "#ffffff",
                    }}
                  >

                    <BsCloudArrowUp
                      style={{
                        fontSize: "28px",
                        color: "#7c3aed",
                        marginRight: "16px",
                      }}
                    />

                    <div>

                      <div
                        style={{
                          color: "#334155",
                          fontWeight: 500,
                        }}
                      >
                        {formData.photo
                          ? "Photo selected"
                          : "Click to upload your photo"}
                      </div>

                      <small className="text-secondary">
                        JPG, PNG or WEBP (Max. 2MB)
                      </small>

                    </div>

                  </label>

                  <input
                    id="profilePhoto"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    style={{
                      display: "none",
                    }}
                  />

                </div>


                {/* =============================================== */}
                {/* CREATE ACCOUNT */}
                {/* =============================================== */}

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
                    "Creating Account..."
                  ) : (
                    <>
                      <BsPersonPlusFill className="me-2" />
                      Create Account
                      <BsArrowRight className="ms-2" />
                    </>
                  )}

                </button>

              </form>


              {/* ================================================= */}
              {/* OR */}
              {/* ================================================= */}

              <div
                className="d-flex align-items-center my-4"
                style={{
                  color: "#94a3b8",
                }}
              >

                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "#e5e7eb",
                  }}
                />

                <span className="mx-3">
                  OR
                </span>

                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "#e5e7eb",
                  }}
                />

              </div>


              {/* ================================================= */}
              {/* LOGIN LINK */}
              {/* ================================================= */}

              <div className="text-center">

                <span className="text-secondary">
                  Already have an account?{" "}
                </span>

                <Link
                  to="/login"
                  style={{
                    color: "#2563eb",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  Sign In
                </Link>

              </div>


              {/* ================================================= */}
              {/* SECURITY MESSAGE */}
              {/* ================================================= */}

              <div
                className="text-center mt-4 pt-4"
                style={{
                  borderTop: "1px solid #eef2f7",
                }}
              >

                <small className="text-secondary">

                  <BsShieldCheck
                    className="me-1"
                    style={{
                      color: "#2563eb",
                    }}
                  />

                  Your information is secure and protected.

                </small>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;