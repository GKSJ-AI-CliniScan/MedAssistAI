import {
  Outlet,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  FaHome,
  FaUsers,
  FaFileMedical,
  FaChartBar,
  FaUserShield,
  FaSignOutAlt,
  FaBell,
  FaChevronDown,
  FaExclamationTriangle,
} from "react-icons/fa";

import { useEffect, useRef, useState } from "react";

import logo from "../assets/logo.png";
import "../css/AdminLayout.css";

// =====================================================
// ADMIN LAYOUT
// =====================================================

function AdminLayout() {
  const navigate = useNavigate();

  // =====================================================
  // PROFILE DROPDOWN
  // =====================================================

  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  // =====================================================
  // ADMIN INFORMATION
  // =====================================================

  const [admin, setAdmin] = useState({
    admin_id: "",
    full_name: "",
    role: "Administrator",
  });

  // =====================================================
  // LOAD ADMIN INFORMATION
  // =====================================================

  useEffect(() => {
    const loadAdminData = () => {
      try {
        // -----------------------------------------------
        // Check localStorage
        // -----------------------------------------------

        const storedAdmin =
          localStorage.getItem("admin");

        if (storedAdmin) {
          const adminData =
            JSON.parse(storedAdmin);

          setAdmin({
            admin_id:
              adminData?.admin_id || "",

            full_name:
              adminData?.full_name ||
              "Administrator",

            role:
              adminData?.role ||
              "Administrator",
          });

          return;
        }

        // -----------------------------------------------
        // Check sessionStorage
        // -----------------------------------------------

        const sessionAdmin =
          sessionStorage.getItem("admin");

        if (sessionAdmin) {
          const adminData =
            JSON.parse(sessionAdmin);

          setAdmin({
            admin_id:
              adminData?.admin_id || "",

            full_name:
              adminData?.full_name ||
              "Administrator",

            role:
              adminData?.role ||
              "Administrator",
          });
        }
      } catch (error) {
        console.error(
          "Unable to load admin information:",
          error
        );
      }
    };

    loadAdminData();
  }, []);

  // =====================================================
  // CLOSE PROFILE DROPDOWN
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =====================================================
  // ADMIN LOGOUT
  // =====================================================

  const handleLogout = () => {
    // Close profile dropdown
    setProfileOpen(false);

    // -----------------------------------------------
    // Clear admin local storage
    // -----------------------------------------------

    localStorage.removeItem(
      "admin_token"
    );

    localStorage.removeItem(
      "admin"
    );

    localStorage.removeItem(
      "admin_id"
    );

    // -----------------------------------------------
    // Clear admin session storage
    // -----------------------------------------------

    sessionStorage.removeItem(
      "admin_token"
    );

    sessionStorage.removeItem(
      "admin"
    );

    sessionStorage.removeItem(
      "admin_id"
    );

    // -----------------------------------------------
    // Redirect to Landing Page
    // -----------------------------------------------

    navigate("/");
  };

  // =====================================================
  // TOGGLE PROFILE
  // =====================================================

  const toggleProfile = () => {
    setProfileOpen(
      (previous) => !previous
    );
  };

  // =====================================================
  // ADMIN INITIAL
  // =====================================================

  const adminInitial =
    admin.full_name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "A";

  // =====================================================
  // ADMIN LAYOUT
  // =====================================================

  return (
    <div className="admin-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="admin-sidebar">

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="admin-sidebar-logo">

          <img
            src={logo}
            alt="MedAssist AI"
          />

          <div className="admin-brand-text">

            <h2>
              MedAssist AI
            </h2>

            <p>
              Administration Portal
            </p>

          </div>

        </div>

        {/* =================================================
            SIDEBAR SECTION TITLE
        ================================================= */}

        <div className="admin-menu-title">
          ADMINISTRATION
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="admin-sidebar-menu">

          {/* =================================================
              DASHBOARD
          ================================================= */}

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `admin-menu-item ${
                isActive
                  ? "admin-menu-item-active"
                  : ""
              }`
            }
          >
            <FaHome />

            <span>
              Dashboard
            </span>
          </NavLink>

          {/* =================================================
              PATIENTS
          ================================================= */}

          <NavLink
            to="/admin/patients"
            className={({ isActive }) =>
              `admin-menu-item ${
                isActive
                  ? "admin-menu-item-active"
                  : ""
              }`
            }
          >
            <FaUsers />

            <span>
              Patients
            </span>
          </NavLink>

          {/* =================================================
              HIGH RISK PATIENTS
          ================================================= */}

          <NavLink
            to="/admin/high-risk-patients"
            className={({ isActive }) =>
              `admin-menu-item ${
                isActive
                  ? "admin-menu-item-active"
                  : ""
              }`
            }
          >
            <FaExclamationTriangle />

            <span>
              High Risk Patients
            </span>
          </NavLink>

          {/* =================================================
              REPORTS
          ================================================= */}

          <NavLink
            to="/admin/reports"
            className={({ isActive }) =>
              `admin-menu-item ${
                isActive
                  ? "admin-menu-item-active"
                  : ""
              }`
            }
          >
            <FaFileMedical />

            <span>
              Reports
            </span>
          </NavLink>

          {/* =================================================
              ANALYTICS
          ================================================= */}

          <NavLink
            to="/admin/analytics"
            className={({ isActive }) =>
              `admin-menu-item ${
                isActive
                  ? "admin-menu-item-active"
                  : ""
              }`
            }
          >
            <FaChartBar />

            <span>
              Analytics
            </span>
          </NavLink>

        </nav>

        {/* =================================================
            SIDEBAR BOTTOM
        ================================================= */}

        <div className="admin-sidebar-bottom">

          {/* =================================================
              ADMIN ACCESS CARD
          ================================================= */}

          <div className="admin-access-card">

            <div className="admin-access-icon">
              <FaUserShield />
            </div>

            <div>

              <strong>
                Administrator
              </strong>

              <span>
                Secure Access
              </span>

            </div>

          </div>

          {/* =================================================
              LOGOUT
          ================================================= */}

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            <FaSignOutAlt />

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN AREA
      ================================================= */}

      <div className="admin-main">

        {/* =================================================
            NAVBAR
        ================================================= */}

        <header className="admin-navbar">

          {/* =================================================
              NAVBAR LEFT
          ================================================= */}

          <div className="admin-navbar-left">

            <div className="admin-page-heading">

              <h1>
                Administration
              </h1>

              <p>
                Manage MedAssist AI healthcare
                platform
              </p>

            </div>

          </div>

          {/* =================================================
              NAVBAR RIGHT
          ================================================= */}

          <div className="admin-navbar-right">

            {/* =================================================
                NOTIFICATION
            ================================================= */}

            <button
              type="button"
              className="admin-notification-btn"
              title="Notifications"
            >
              <FaBell />

              <span className="admin-notification-dot"></span>
            </button>

            {/* =================================================
                PROFILE
            ================================================= */}

            <div
              className="admin-profile-wrapper"
              ref={profileRef}
            >

              {/* =================================================
                  PROFILE BUTTON
              ================================================= */}

              <button
                type="button"
                className={`admin-profile-btn ${
                  profileOpen
                    ? "admin-profile-active"
                    : ""
                }`}
                onClick={toggleProfile}
              >

                {/* =================================================
                    AVATAR
                ================================================= */}

                <div className="admin-avatar">

                  <span>
                    {adminInitial}
                  </span>

                </div>

                {/* =================================================
                    ADMIN INFORMATION
                ================================================= */}

                <div className="admin-profile-info">

                  <h4>
                    {admin.full_name ||
                      "Administrator"}
                  </h4>

                  <span>
                    {admin.role ||
                      "Administrator"}
                  </span>

                </div>

                {/* =================================================
                    ARROW
                ================================================= */}

                <FaChevronDown
                  className={`admin-profile-arrow ${
                    profileOpen
                      ? "admin-profile-arrow-open"
                      : ""
                  }`}
                />

              </button>

              {/* =================================================
                  PROFILE DROPDOWN
              ================================================= */}

              {profileOpen && (

                <div className="admin-profile-dropdown">

                  {/* =================================================
                      DROPDOWN ARROW
                  ================================================= */}

                  <div className="admin-profile-dropdown-arrow"></div>

                  {/* =================================================
                      LARGE AVATAR
                  ================================================= */}

                  <div className="admin-profile-large-avatar">

                    <span>
                      {adminInitial}
                    </span>

                  </div>

                  {/* =================================================
                      ADMIN NAME
                  ================================================= */}

                  <h3>
                    {admin.full_name ||
                      "Administrator"}
                  </h3>

                  {/* =================================================
                      ROLE
                  ================================================= */}

                  <p className="admin-profile-role">
                    {admin.role ||
                      "Administrator"}
                  </p>

                  {/* =================================================
                      ADMIN ID
                  ================================================= */}

                  {admin.admin_id && (

                    <p className="admin-profile-id">
                      Admin ID:{" "}
                      {admin.admin_id}
                    </p>

                  )}

                  {/* =================================================
                      DIVIDER
                  ================================================= */}

                  <div className="admin-profile-divider"></div>

                  {/* =================================================
                      PROFILE ACTIONS
                  ================================================= */}

                  <div className="admin-profile-actions">

                    {/* Admin Dashboard */}

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate(
                          "/admin/dashboard"
                        );
                      }}
                    >
                      <FaHome />

                      <span>
                        Dashboard
                      </span>

                    </button>

                    {/* Logout */}

                    <button
                      type="button"
                      className="admin-dropdown-logout"
                      onClick={
                        handleLogout
                      }
                    >
                      <FaSignOutAlt />

                      <span>
                        Logout
                      </span>

                    </button>

                  </div>

                </div>

              )}

            </div>

          </div>

        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main className="admin-page-content">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default AdminLayout;

