import {
  Outlet,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  FaHome,
  FaHeartbeat,
  FaBrain,
  FaExclamationTriangle,
  FaPills,
  FaFileMedical,
  FaHistory,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaChevronDown,
  FaUser,
} from "react-icons/fa";

import { useEffect, useRef, useState } from "react";

import axios from "axios";

import logo from "../assets/logo.png";
import "../css/MainLayout.css";

// =====================================================
// API BASE URL
// =====================================================

const API_BASE_URL = "http://127.0.0.1:8000";

// =====================================================
// MAIN LAYOUT
// =====================================================

function MainLayout() {
  const navigate = useNavigate();

  // =====================================================
  // PROFILE DROPDOWN STATE
  // =====================================================

  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  // =====================================================
  // PATIENT PROFILE STATE
  // =====================================================

  const [patient, setPatient] = useState({
    patient_id: "",
    full_name: "",
    photo: "",
  });

  // =====================================================
  // PROFILE LOADING STATE
  // =====================================================

  const [profileLoading, setProfileLoading] = useState(true);

  // =====================================================
  // GET PATIENT ID
  // =====================================================

  const getPatientId = () => {
    const possibleKeys = [
      "patient_id",
      "patientId",
      "patientID",
      "user_patient_id",
    ];

    // ---------------------------------------------------
    // Check localStorage / sessionStorage
    // ---------------------------------------------------

    for (const key of possibleKeys) {
      const localValue = localStorage.getItem(key);

      if (localValue) {
        return localValue;
      }

      const sessionValue = sessionStorage.getItem(key);

      if (sessionValue) {
        return sessionValue;
      }
    }

    // ---------------------------------------------------
    // Check stored user object
    // ---------------------------------------------------

    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        if (user?.patient_id) {
          return user.patient_id;
        }

        if (user?.patientId) {
          return user.patientId;
        }

        if (user?.patientID) {
          return user.patientID;
        }
      } catch (error) {
        console.error(
          "Unable to read stored user:",
          error
        );
      }
    }

    return "";
  };

  // =====================================================
  // GET PHOTO URL
  // =====================================================

  const getPhotoUrl = (photo) => {
    if (!photo) {
      return "";
    }

    // ---------------------------------------------------
    // Already a complete URL
    // ---------------------------------------------------

    if (
      photo.startsWith("http://") ||
      photo.startsWith("https://")
    ) {
      return photo;
    }

    // ---------------------------------------------------
    // Backend-relative path
    //
    // Example:
    // /uploads/profile_photos/PT000001.jpg
    // ---------------------------------------------------

    if (photo.startsWith("/")) {
      return `${API_BASE_URL}${photo}`;
    }

    // ---------------------------------------------------
    // Relative path without /
    //
    // Example:
    // uploads/profile_photos/PT000001.jpg
    // ---------------------------------------------------

    return `${API_BASE_URL}/${photo}`;
  };

  // =====================================================
  // LOAD PATIENT PROFILE
  // =====================================================

  const loadPatientProfile = async () => {
    const patientId = getPatientId();

    // ---------------------------------------------------
    // No patient ID
    // ---------------------------------------------------

    if (!patientId) {
      console.warn(
        "MainLayout: Patient ID not found."
      );

      // Try loading basic information from stored user
      const storedUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);

          setPatient({
            patient_id:
              user?.patient_id ||
              user?.patientId ||
              "",
            full_name:
              user?.full_name ||
              user?.fullName ||
              "Patient",
            photo:
              user?.photo ||
              "",
          });
        } catch (error) {
          console.error(
            "Unable to load stored user:",
            error
          );
        }
      }

      setProfileLoading(false);

      return;
    }

    try {
      setProfileLoading(true);

      // -------------------------------------------------
      // Get profile from backend
      // -------------------------------------------------

      const response = await axios.get(
        `${API_BASE_URL}/profile/${patientId}`
      );

      const data = response.data;

      console.log(
        "MainLayout profile response:",
        data
      );

      // -------------------------------------------------
      // Store patient information in state
      // -------------------------------------------------

      setPatient({
        patient_id:
          data?.patient_id ||
          patientId,

        full_name:
          data?.full_name ||
          "Patient",

        photo:
          data?.photo ||
          "",
      });

      // -------------------------------------------------
      // Also update stored user object
      // -------------------------------------------------

      const localUser =
        localStorage.getItem("user");

      const sessionUser =
        sessionStorage.getItem("user");

      if (localUser) {
        try {
          const user = JSON.parse(localUser);

          localStorage.setItem(
            "user",
            JSON.stringify({
              ...user,
              patient_id:
                data?.patient_id ||
                patientId,
              full_name:
                data?.full_name ||
                user?.full_name ||
                "Patient",
              photo:
                data?.photo ||
                user?.photo ||
                "",
            })
          );
        } catch (error) {
          console.error(
            "Unable to update local user:",
            error
          );
        }
      }

      if (sessionUser) {
        try {
          const user = JSON.parse(sessionUser);

          sessionStorage.setItem(
            "user",
            JSON.stringify({
              ...user,
              patient_id:
                data?.patient_id ||
                patientId,
              full_name:
                data?.full_name ||
                user?.full_name ||
                "Patient",
              photo:
                data?.photo ||
                user?.photo ||
                "",
            })
          );
        } catch (error) {
          console.error(
            "Unable to update session user:",
            error
          );
        }
      }

      // -------------------------------------------------
      // Also store standalone patient information
      // -------------------------------------------------

      if (data?.patient_id) {
        localStorage.setItem(
          "patient_id",
          data.patient_id
        );
      }

      if (data?.full_name) {
        localStorage.setItem(
          "full_name",
          data.full_name
        );
      }

      if (data?.photo) {
        localStorage.setItem(
          "profile_photo",
          data.photo
        );
      }
    } catch (error) {
      console.error(
        "MainLayout profile loading error:",
        error
      );

      // -------------------------------------------------
      // Backend failed
      // Use stored user as fallback
      // -------------------------------------------------

      const storedUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);

          setPatient({
            patient_id:
              user?.patient_id ||
              user?.patientId ||
              patientId,

            full_name:
              user?.full_name ||
              user?.fullName ||
              "Patient",

            photo:
              user?.photo ||
              localStorage.getItem(
                "profile_photo"
              ) ||
              "",
          });
        } catch (parseError) {
          console.error(
            "Unable to parse stored user:",
            parseError
          );
        }
      }
    } finally {
      setProfileLoading(false);
    }
  };

  // =====================================================
  // LOAD PROFILE WHEN MAIN LAYOUT MOUNTS
  // =====================================================

  useEffect(() => {
    loadPatientProfile();
  }, []);

  // =====================================================
  // CLOSE PROFILE DROPDOWN WHEN CLICKING OUTSIDE
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
  // FRONTEND LOGOUT
  // =====================================================

  const handleLogout = () => {
    setProfileOpen(false);

    // ---------------------------------------------------
    // Clear localStorage
    // ---------------------------------------------------

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("patient_id");
    localStorage.removeItem("full_name");
    localStorage.removeItem("profile_photo");

    // ---------------------------------------------------
    // Clear sessionStorage
    // ---------------------------------------------------

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("patient_id");
    sessionStorage.removeItem("full_name");
    sessionStorage.removeItem("profile_photo");

    // ---------------------------------------------------
    // Go to Landing Page
    // ---------------------------------------------------

    navigate("/");
  };

  // =====================================================
  // SETTINGS
  // =====================================================

  const handleSettings = () => {
    setProfileOpen(false);

    navigate("/settings");
  };

  // =====================================================
  // TOGGLE PROFILE DROPDOWN
  // =====================================================

  const toggleProfile = () => {
    setProfileOpen(
      (previous) => !previous
    );
  };

  // =====================================================
  // PROFILE PHOTO
  // =====================================================

  const photoUrl = getPhotoUrl(
    patient.photo
  );

  // =====================================================
  // PATIENT INITIAL
  // =====================================================

  const patientInitial =
    patient.full_name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "P";

  // =====================================================
  // HANDLE PHOTO LOAD ERROR
  // =====================================================

  const handlePhotoError = () => {
    console.error(
      "Unable to load profile photo:",
      photoUrl
    );

    setPatient(
      (previous) => ({
        ...previous,
        photo: "",
      })
    );

    localStorage.removeItem(
      "profile_photo"
    );
  };

  // =====================================================
  // MAIN LAYOUT
  // =====================================================

  return (
    <div className="app-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="sidebar-logo">

          <img
            src={logo}
            alt="MedAssist AI"
          />

          <div>

            <h2>
              MedAssist AI
            </h2>

            <p>
              AI Healthcare Platform
            </p>

          </div>

        </div>

        {/* =================================================
            MENU
        ================================================= */}

        <nav className="sidebar-menu">

          {/* Dashboard */}

          <NavLink
            to="/dashboard"
            className="menu-item"
          >
            <FaHome />

            <span>
              Dashboard
            </span>
          </NavLink>

          {/* Health Analysis */}

          <NavLink
            to="/health-analysis"
            className="menu-item"
          >
            <FaHeartbeat />

            <span>
              Health Analysis
            </span>
          </NavLink>

          {/* Disease Prediction */}

          <NavLink
            to="/prediction"
            className="menu-item"
          >
            <FaBrain />

            <span>
              Disease Prediction
            </span>
          </NavLink>

          {/* Risk Assessment */}

          <NavLink
            to="/risk"
            className="menu-item"
          >
            <FaExclamationTriangle />

            <span>
              Risk Assessment
            </span>
          </NavLink>

          {/* Treatment Recommendation */}

          <NavLink
            to="/recommendation"
            className="menu-item"
          >
            <FaPills />

            <span>
              Treatment Recommendation
            </span>
          </NavLink>

          {/* Health Reports */}

          <NavLink
            to="/report"
            className="menu-item"
          >
            <FaFileMedical />

            <span>
              Health Reports
            </span>
          </NavLink>

          {/* Medical Records */}

          <NavLink
            to="/records"
            className="menu-item"
          >
            <FaHistory />

            <span>
              Medical Records
            </span>
          </NavLink>

          {/* Analytics */}

          <NavLink
            to="/analytics"
            className="menu-item"
          >
            <FaChartBar />

            <span>
              Analytics
            </span>
          </NavLink>

          {/* Settings */}

          <NavLink
            to="/settings"
            className="menu-item"
          >
            <FaCog />

            <span>
              Settings
            </span>
          </NavLink>

          {/* =================================================
              LOGOUT
          ================================================= */}

          <button
            type="button"
            className="menu-item logout"
            onClick={handleLogout}
          >
            <FaSignOutAlt />

            <span>
              Logout
            </span>

          </button>

        </nav>

      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="main">

        {/* =================================================
            NAVBAR
        ================================================= */}

        <header className="navbar">

          <div></div>

          <div className="navbar-right">

            {/* =================================================
                NOTIFICATION
            ================================================= */}

            <button
              type="button"
              className="notification-btn"
            >
              <FaBell />
            </button>

            {/* =================================================
                PROFILE
            ================================================= */}

            <div
              className="profile-wrapper"
              ref={profileRef}
            >

              {/* =================================================
                  PROFILE BUTTON
              ================================================= */}

              <button
                type="button"
                className={`profile ${
                  profileOpen
                    ? "profile-active"
                    : ""
                }`}
                onClick={toggleProfile}
              >

                {/* =================================================
                    AVATAR
                ================================================= */}

                <div className="avatar">

                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={
                        patient.full_name ||
                        "Profile"
                      }
                      className="navbar-profile-photo"
                      onError={
                        handlePhotoError
                      }
                    />
                  ) : (
                    <span>
                      {patientInitial}
                    </span>
                  )}

                </div>

                {/* =================================================
                    USER INFORMATION
                ================================================= */}

                <div className="profile-info">

                  <h4>
                    {profileLoading
                      ? "Patient"
                      : patient.full_name ||
                        "Patient"}
                  </h4>

                  <span>
                    Patient
                  </span>

                </div>

                {/* =================================================
                    ARROW
                ================================================= */}

                <FaChevronDown
                  className={`profile-arrow ${
                    profileOpen
                      ? "profile-arrow-open"
                      : ""
                  }`}
                />

              </button>

              {/* =================================================
                  PROFILE DROPDOWN
              ================================================= */}

              {profileOpen && (

                <div className="profile-dropdown">

                  {/* Small Arrow */}

                  <div className="profile-dropdown-arrow"></div>

                  {/* =================================================
                      LARGE PROFILE PHOTO
                  ================================================= */}

                  <div className="profile-large-avatar">

                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={
                          patient.full_name ||
                          "Profile"
                        }
                        className="dropdown-profile-photo"
                        onError={
                          handlePhotoError
                        }
                      />
                    ) : (
                      <FaUser />
                    )}

                  </div>

                  {/* =================================================
                      USER NAME
                  ================================================= */}

                  <h3 className="profile-dropdown-name">
                    {patient.full_name ||
                      "Patient"}
                  </h3>

                  <p className="profile-dropdown-role">
                    Patient
                  </p>

                  {/* =================================================
                      PATIENT ID
                  ================================================= */}

                  {patient.patient_id && (
                    <p className="profile-dropdown-patient-id">
                      {patient.patient_id}
                    </p>
                  )}

                  {/* =================================================
                      DIVIDER
                  ================================================= */}

                  <div className="profile-divider"></div>

                  {/* =================================================
                      BUTTONS
                  ================================================= */}

                  <div className="profile-actions">

                    {/* Settings */}

                    <button
                      type="button"
                      className="profile-settings-btn"
                      onClick={
                        handleSettings
                      }
                    >
                      <FaCog />

                      <span>
                        Settings
                      </span>

                    </button>

                    {/* Logout */}

                    <button
                      type="button"
                      className="profile-logout-btn"
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

        <main className="page-content">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default MainLayout;