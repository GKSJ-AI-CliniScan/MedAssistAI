import { useRef } from "react";
import logo from "../assets/logo.png";

function Navbar() {
  // =====================================================
  // ADMIN LOGIN - HIDDEN 3-CLICK SHORTCUT
  // =====================================================

  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  const handleLogoClick = (event) => {
    event.preventDefault();

    // Increase click count
    clickCountRef.current += 1;

    // Clear previous timer
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    // ===================================================
    // THREE QUICK CLICKS
    // ===================================================

    if (clickCountRef.current === 3) {
      clickCountRef.current = 0;

      // Open Admin Login
      window.location.href = "/admin/login";

      return;
    }

    // ===================================================
    // RESET CLICK COUNT
    // ===================================================

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1000);

    // ===================================================
    // NORMAL SINGLE CLICK
    // ===================================================

    // For a single click, go to Home after the
    // short detection period.
    setTimeout(() => {
      if (clickCountRef.current === 1) {
        window.location.href = "/";
        clickCountRef.current = 0;
      }
    }, 250);
  };

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #eef0f5",
        minHeight: "78px",
        zIndex: 1000,
      }}
    >
      <div
        className="container-fluid"
        style={{
          paddingLeft: "4%",
          paddingRight: "4%",
        }}
      >
        {/* ============================= */}
        {/* LOGO + BRAND */}
        {/* ============================= */}

        <a
          className="navbar-brand d-flex align-items-center"
          href="/"
          onClick={handleLogoClick}
          style={{
            textDecoration: "none",
            marginRight: "0",
            cursor: "pointer",
          }}
        >
          <img
            src={logo}
            alt="MedAssist AI Logo"
            style={{
              width: "48px",
              height: "48px",
              objectFit: "contain",
              marginRight: "10px",
            }}
          />

          <span
            style={{
              fontSize: "25px",
              fontWeight: "700",
              color: "#2563eb",
              letterSpacing: "-0.5px",
              whiteSpace: "nowrap",
            }}
          >
            MedAssist AI
          </span>
        </a>

        {/* ============================= */}
        {/* MOBILE MENU BUTTON */}
        {/* ============================= */}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#medassistNavbar"
          aria-controls="medassistNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{
            border: "1px solid #dbe3f0",
            borderRadius: "8px",
            padding: "7px 10px",
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* ============================= */}
        {/* NAVBAR CONTENT */}
        {/* ============================= */}

        <div
          className="collapse navbar-collapse"
          id="medassistNavbar"
        >
          {/* ============================= */}
          {/* CENTER NAVIGATION */}
          {/* ============================= */}

          <ul
            className="navbar-nav mx-auto align-items-lg-center"
            style={{
              gap: "8px",
            }}
          >
            {/* ============================= */}
            {/* HOME */}
            {/* ============================= */}

            <li className="nav-item">
              <a
                className="nav-link"
                href="/"
                style={{
                  fontSize: "17px",
                  fontWeight: "500",
                  color: "#111827",
                  padding: "10px 14px",
                }}
              >
                Home
              </a>
            </li>

            {/* ============================= */}
            {/* FEATURES */}
            {/* ============================= */}

            <li className="nav-item">
              <a
                className="nav-link"
                href="#features"
                style={{
                  fontSize: "17px",
                  fontWeight: "500",
                  color: "#4b5563",
                  padding: "10px 14px",
                }}
              >
                Features
              </a>
            </li>

            {/* ============================= */}
            {/* HOW IT WORKS */}
            {/* ============================= */}

            <li className="nav-item">
              <a
                className="nav-link"
                href="#how-it-works"
                style={{
                  fontSize: "17px",
                  fontWeight: "500",
                  color: "#4b5563",
                  padding: "10px 14px",
                }}
              >
                How It Works
              </a>
            </li>

            {/* ============================= */}
            {/* ABOUT */}
            {/* ============================= */}

            <li className="nav-item">
              <a
                className="nav-link"
                href="#about"
                style={{
                  fontSize: "17px",
                  fontWeight: "500",
                  color: "#4b5563",
                  padding: "10px 14px",
                }}
              >
                About
              </a>
            </li>

            {/* ============================= */}
            {/* CONTACT */}
            {/* ============================= */}

            <li className="nav-item">
              <a
                className="nav-link"
                href="#contact"
                style={{
                  fontSize: "17px",
                  fontWeight: "500",
                  color: "#4b5563",
                  padding: "10px 14px",
                }}
              >
                Contact
              </a>
            </li>
          </ul>

          {/* ============================= */}
          {/* LOGIN + REGISTER */}
          {/* ============================= */}

          <div className="d-flex align-items-center gap-2">

            {/* ============================= */}
            {/* LOGIN */}
            {/* ============================= */}

            <a
              href="/login"
              className="btn"
              style={{
                minWidth: "90px",
                padding: "10px 20px",
                borderRadius: "9px",
                border: "1.5px solid #2563eb",
                backgroundColor: "#ffffff",
                color: "#2563eb",
                fontSize: "16px",
                fontWeight: "600",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Login
            </a>

            {/* ============================= */}
            {/* REGISTER */}
            {/* ============================= */}

            <a
              href="/register"
              className="btn"
              style={{
                minWidth: "105px",
                padding: "10px 22px",
                borderRadius: "9px",
                border: "1.5px solid #2563eb",
                background:
                  "linear-gradient(90deg, #2563eb, #4f46e5)",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "600",
                textDecoration: "none",
                textAlign: "center",
                boxShadow:
                  "0 6px 15px rgba(37, 99, 235, 0.18)",
              }}
            >
              Register
            </a>

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;