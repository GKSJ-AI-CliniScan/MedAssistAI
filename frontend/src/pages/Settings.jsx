import { useEffect, useRef, useState } from "react";
import axios from "axios";

import {
  FaCog,
  FaUser,
  FaLock,
  FaCamera,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTint,
  FaShieldAlt,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

import "../css/Settings.css";

// ======================================================
// API BASE URL
// ======================================================

const API_BASE_URL = "http://127.0.0.1:8000";

// ======================================================
// Settings Component
// ======================================================

function Settings() {
  // ====================================================
  // Profile State
  // ====================================================

  const [profile, setProfile] = useState({
    patient_id: "",
    full_name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    blood_group: "",
    address: "",
    emergency_contact: "",
    photo: "",
    created_at: "",
  });

  // ====================================================
  // Password State
  // ====================================================

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  // ====================================================
  // Password Visibility
  // ====================================================

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // ====================================================
  // Loading States
  // ====================================================

  const [loadingProfile, setLoadingProfile] =
    useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [uploadingPhoto, setUploadingPhoto] =
    useState(false);

  // ====================================================
  // Messages
  // ====================================================

  const [profileMessage, setProfileMessage] = useState({
    type: "",
    text: "",
  });

  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

  // ====================================================
  // Hidden File Input Reference
  // ====================================================

  const fileInputRef = useRef(null);

  // ====================================================
  // Get Patient ID
  // ====================================================

  const getPatientId = () => {
    const possibleKeys = [
      "patient_id",
      "patientId",
      "patientID",
      "user_patient_id",
    ];

    // ----------------------------------------------
    // Check localStorage / sessionStorage
    // ----------------------------------------------

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

    // ----------------------------------------------
    // Check stored user object
    // ----------------------------------------------

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

  // ====================================================
  // Load Patient Profile
  // ====================================================

  const loadProfile = async () => {
    const patientId = getPatientId();

    if (!patientId) {
      setLoadingProfile(false);

      setProfileMessage({
        type: "error",
        text: "Patient ID not found. Please login again.",
      });

      return;
    }

    try {
      setLoadingProfile(true);

      setProfileMessage({
        type: "",
        text: "",
      });

      const response = await axios.get(
        `${API_BASE_URL}/profile/${patientId}`
      );

      const data = response.data;

      setProfile({
        patient_id: data.patient_id || patientId,
        full_name: data.full_name || "",
        email: data.email || "",
        phone: data.phone || "",
        age: data.age ?? "",
        gender: data.gender || "",
        blood_group: data.blood_group || "",
        address: data.address || "",
        emergency_contact:
          data.emergency_contact || "",
        photo: data.photo || "",
        created_at: data.created_at || "",
      });
    } catch (error) {
      console.error(
        "Profile loading error:",
        error
      );

      let message =
        "Unable to load your profile.";

      if (error.response?.data?.detail) {
        message =
          error.response.data.detail;
      } else if (error.message) {
        message = error.message;
      }

      setProfileMessage({
        type: "error",
        text: message,
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  // ====================================================
  // Initial Load
  // ====================================================

  useEffect(() => {
    loadProfile();
  }, []);

  // ====================================================
  // Profile Input Handler
  // ====================================================

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (profileMessage.text) {
      setProfileMessage({
        type: "",
        text: "",
      });
    }
  };

  // ====================================================
  // Password Input Handler
  // ====================================================

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (passwordMessage.text) {
      setPasswordMessage({
        type: "",
        text: "",
      });
    }
  };

  // ====================================================
  // OPEN CAMERA / FILE PICKER
  // ====================================================

  const handleCameraClick = () => {
    if (uploadingPhoto) {
      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ====================================================
  // PROFILE PHOTO UPLOAD
  // ====================================================

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];

    // No file selected
    if (!file) {
      return;
    }

    // ==================================================
    // Allowed File Types
    // ==================================================

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setProfileMessage({
        type: "error",
        text:
          "Invalid image format. Only JPG, JPEG, PNG and WEBP images are allowed.",
      });

      event.target.value = "";

      return;
    }

    // ==================================================
    // Maximum File Size = 5 MB
    // ==================================================

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setProfileMessage({
        type: "error",
        text:
          "Profile photo must be smaller than 5 MB.",
      });

      event.target.value = "";

      return;
    }

    // ==================================================
    // Get Patient ID
    // ==================================================

    const patientId =
      profile.patient_id || getPatientId();

    if (!patientId) {
      setProfileMessage({
        type: "error",
        text:
          "Patient ID not found. Please login again.",
      });

      event.target.value = "";

      return;
    }

    // ==================================================
    // Upload Image
    // ==================================================

    try {
      setUploadingPhoto(true);

      setProfileMessage({
        type: "",
        text: "",
      });

      // ----------------------------------------------
      // Create FormData
      // ----------------------------------------------

      const formData = new FormData();

      formData.append("file", file);

      // ----------------------------------------------
      // Send Image to FastAPI
      // ----------------------------------------------

      const response = await axios.post(
        `${API_BASE_URL}/profile/upload-photo/${patientId}`,
        formData
      );

      // ----------------------------------------------
      // Get Returned Photo Path
      // ----------------------------------------------

      const photoPath =
        response.data?.photo;

      if (photoPath) {
        setProfile((previous) => ({
          ...previous,
          photo: photoPath,
        }));
      }

      // ----------------------------------------------
      // Success Message
      // ----------------------------------------------

      setProfileMessage({
        type: "success",
        text:
          response.data?.message ||
          "Profile photo uploaded successfully.",
      });
    } catch (error) {
      console.error(
        "Photo upload error:",
        error
      );

      let message =
        "Unable to upload profile photo.";

      if (error.response?.data?.detail) {
        message =
          error.response.data.detail;
      } else if (error.message) {
        message = error.message;
      }

      setProfileMessage({
        type: "error",
        text: message,
      });
    } finally {
      setUploadingPhoto(false);

      // Allow selecting the same file again
      event.target.value = "";
    }
  };

  // ====================================================
  // Save Profile
  // ====================================================

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    // ----------------------------------------------
    // Patient ID
    // ----------------------------------------------

    if (!profile.patient_id) {
      setProfileMessage({
        type: "error",
        text: "Patient ID is missing.",
      });

      return;
    }

    // ----------------------------------------------
    // Full Name
    // ----------------------------------------------

    if (!profile.full_name.trim()) {
      setProfileMessage({
        type: "error",
        text: "Full name is required.",
      });

      return;
    }

    // ----------------------------------------------
    // Email
    // ----------------------------------------------

    if (!profile.email.trim()) {
      setProfileMessage({
        type: "error",
        text: "Email address is required.",
      });

      return;
    }

    // ----------------------------------------------
    // Phone
    // ----------------------------------------------

    if (!profile.phone.trim()) {
      setProfileMessage({
        type: "error",
        text: "Phone number is required.",
      });

      return;
    }

    // ----------------------------------------------
    // Age
    // ----------------------------------------------

    if (
      !profile.age ||
      Number(profile.age) <= 0
    ) {
      setProfileMessage({
        type: "error",
        text: "Please enter a valid age.",
      });

      return;
    }

    // ----------------------------------------------
    // Gender
    // ----------------------------------------------

    if (!profile.gender) {
      setProfileMessage({
        type: "error",
        text: "Please select your gender.",
      });

      return;
    }

    try {
      setSavingProfile(true);

      setProfileMessage({
        type: "",
        text: "",
      });

      // ----------------------------------------------
      // Request Payload
      // ----------------------------------------------

      const payload = {
        patient_id: profile.patient_id,

        full_name:
          profile.full_name.trim(),

        email:
          profile.email.trim(),

        phone:
          profile.phone.trim(),

        age: Number(profile.age),

        gender: profile.gender,

        blood_group:
          profile.blood_group || null,

        address:
          profile.address?.trim() || null,

        emergency_contact:
          profile.emergency_contact?.trim() ||
          null,

        // Keep existing photo path
        photo:
          profile.photo?.trim() || null,
      };

      // ----------------------------------------------
      // Update Profile
      // ----------------------------------------------

      const response = await axios.put(
        `${API_BASE_URL}/profile/update`,
        payload
      );

      const updatedPatient =
        response.data?.patient;

      // ----------------------------------------------
      // Update React State
      // ----------------------------------------------

      if (updatedPatient) {
        setProfile({
          patient_id:
            updatedPatient.patient_id ||
            profile.patient_id,

          full_name:
            updatedPatient.full_name || "",

          email:
            updatedPatient.email || "",

          phone:
            updatedPatient.phone || "",

          age:
            updatedPatient.age ?? "",

          gender:
            updatedPatient.gender || "",

          blood_group:
            updatedPatient.blood_group || "",

          address:
            updatedPatient.address || "",

          emergency_contact:
            updatedPatient.emergency_contact ||
            "",

          photo:
            updatedPatient.photo ||
            profile.photo ||
            "",

          created_at:
            updatedPatient.created_at || "",
        });
      }

      // ----------------------------------------------
      // Update Stored User Object
      // ----------------------------------------------

      const storedUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

      if (storedUser) {
        try {
          const user =
            JSON.parse(storedUser);

          const updatedUser = {
            ...user,

            patient_id:
              profile.patient_id,

            full_name:
              profile.full_name,
          };

          if (
            localStorage.getItem("user")
          ) {
            localStorage.setItem(
              "user",
              JSON.stringify(updatedUser)
            );
          }

          if (
            sessionStorage.getItem("user")
          ) {
            sessionStorage.setItem(
              "user",
              JSON.stringify(updatedUser)
            );
          }
        } catch (error) {
          console.error(
            "Unable to update stored user:",
            error
          );
        }
      }

      // ----------------------------------------------
      // Update Standalone Full Name
      // ----------------------------------------------

      if (
        localStorage.getItem("full_name")
      ) {
        localStorage.setItem(
          "full_name",
          profile.full_name
        );
      }

      if (
        sessionStorage.getItem("full_name")
      ) {
        sessionStorage.setItem(
          "full_name",
          profile.full_name
        );
      }

      // ----------------------------------------------
      // Success Message
      // ----------------------------------------------

      setProfileMessage({
        type: "success",
        text:
          response.data?.message ||
          "Profile updated successfully.",
      });
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      let message =
        "Unable to update profile.";

      if (error.response?.data?.detail) {
        message =
          error.response.data.detail;
      } else if (error.message) {
        message = error.message;
      }

      setProfileMessage({
        type: "error",
        text: message,
      });
    } finally {
      setSavingProfile(false);
    }
  };

  // ====================================================
  // Password Validation
  // ====================================================

  const passwordRules = {
    length:
      passwordData.new_password.length >= 8,

    upper:
      /[A-Z]/.test(
        passwordData.new_password
      ) &&
      /[a-z]/.test(
        passwordData.new_password
      ),

    number:
      /\d/.test(
        passwordData.new_password
      ),

    special:
      /[^A-Za-z0-9]/.test(
        passwordData.new_password
      ),
  };

  // ====================================================
  // Change Password
  // ====================================================

  const handleChangePassword = async (
    event
  ) => {
    event.preventDefault();

    setPasswordMessage({
      type: "",
      text: "",
    });

    // ----------------------------------------------
    // Current Password
    // ----------------------------------------------

    if (
      !passwordData.current_password
    ) {
      setPasswordMessage({
        type: "error",
        text:
          "Please enter your current password.",
      });

      return;
    }

    // ----------------------------------------------
    // New Password
    // ----------------------------------------------

    if (
      !passwordData.new_password
    ) {
      setPasswordMessage({
        type: "error",
        text:
          "Please enter a new password.",
      });

      return;
    }

    // ----------------------------------------------
    // Password Length
    // ----------------------------------------------

    if (!passwordRules.length) {
      setPasswordMessage({
        type: "error",
        text:
          "Password must be at least 8 characters long.",
      });

      return;
    }

    // ----------------------------------------------
    // Uppercase + Lowercase
    // ----------------------------------------------

    if (!passwordRules.upper) {
      setPasswordMessage({
        type: "error",
        text:
          "Password must contain uppercase and lowercase letters.",
      });

      return;
    }

    // ----------------------------------------------
    // Number
    // ----------------------------------------------

    if (!passwordRules.number) {
      setPasswordMessage({
        type: "error",
        text:
          "Password must contain at least one number.",
      });

      return;
    }

    // ----------------------------------------------
    // Special Character
    // ----------------------------------------------

    if (!passwordRules.special) {
      setPasswordMessage({
        type: "error",
        text:
          "Password must contain at least one special character.",
      });

      return;
    }

    // ----------------------------------------------
    // Confirm Password
    // ----------------------------------------------

    if (
      !passwordData.confirm_password
    ) {
      setPasswordMessage({
        type: "error",
        text:
          "Please confirm your new password.",
      });

      return;
    }

    // ----------------------------------------------
    // Password Match
    // ----------------------------------------------

    if (
      passwordData.new_password !==
      passwordData.confirm_password
    ) {
      setPasswordMessage({
        type: "error",
        text:
          "New passwords do not match.",
      });

      return;
    }

    // ----------------------------------------------
    // Same Password
    // ----------------------------------------------

    if (
      passwordData.current_password ===
      passwordData.new_password
    ) {
      setPasswordMessage({
        type: "error",
        text:
          "New password must be different from your current password.",
      });

      return;
    }

    // ----------------------------------------------
    // Patient ID
    // ----------------------------------------------

    const patientId =
      profile.patient_id ||
      getPatientId();

    if (!patientId) {
      setPasswordMessage({
        type: "error",
        text:
          "Patient ID not found. Please login again.",
      });

      return;
    }

    // ----------------------------------------------
    // API Request
    // ----------------------------------------------

    try {
      setChangingPassword(true);

      const payload = {
        patient_id: patientId,

        current_password:
          passwordData.current_password,

        new_password:
          passwordData.new_password,
      };

      const response = await axios.put(
        `${API_BASE_URL}/profile/change-password`,
        payload
      );

      // ----------------------------------------------
      // Success
      // ----------------------------------------------

      setPasswordMessage({
        type: "success",
        text:
          response.data?.message ||
          "Password changed successfully.",
      });

      // ----------------------------------------------
      // Clear Password Fields
      // ----------------------------------------------

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      let message =
        "Unable to change password.";

      if (error.response?.data?.detail) {
        message =
          error.response.data.detail;
      } else if (error.message) {
        message = error.message;
      }

      setPasswordMessage({
        type: "error",
        text: message,
      });
    } finally {
      setChangingPassword(false);
    }
  };

  // ====================================================
  // Profile Photo URL
  // ====================================================

  const getPhotoUrl = () => {
    if (!profile.photo) {
      return "";
    }

    // ----------------------------------------------
    // Already a complete URL
    // ----------------------------------------------

    if (
      profile.photo.startsWith(
        "http://"
      ) ||
      profile.photo.startsWith(
        "https://"
      )
    ) {
      return profile.photo;
    }

    // ----------------------------------------------
    // Backend-relative path
    // ----------------------------------------------

    if (
      profile.photo.startsWith("/")
    ) {
      return `${API_BASE_URL}${profile.photo}`;
    }

    // ----------------------------------------------
    // Relative path without /
    // ----------------------------------------------

    return `${API_BASE_URL}/${profile.photo}`;
  };

  // ====================================================
  // Format Created Date
  // ====================================================

  const formatCreatedDate = () => {
    if (!profile.created_at) {
      return "Your account";
    }

    try {
      const date = new Date(
        profile.created_at
      );

      if (
        Number.isNaN(date.getTime())
      ) {
        return "Your account";
      }

      return date.toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "Your account";
    }
  };

  // ====================================================
  // Loading Screen
  // ====================================================

  if (loadingProfile) {
    return (
      <div className="settings-page">

        <div className="settings-loading">

          <div className="settings-loading-spinner"></div>

          <h3>
            Loading Settings
          </h3>

          <p>
            Please wait while we load
            your profile information.
          </p>

        </div>

      </div>
    );
  }

  // ====================================================
  // Main UI
  // ====================================================

  return (
    <div className="settings-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="settings-header">

        <div className="settings-title-area">

          <div className="settings-title-icon">
            <FaCog />
          </div>

          <div>

            <h1>
              Settings
            </h1>

            <p>
              Manage your account, profile
              and security
            </p>

          </div>

        </div>

        <div className="settings-patient-card">

          <div className="settings-patient-icon">
            <FaUser />
          </div>

          <div>

            <span>
              Patient ID
            </span>

            <strong>
              {profile.patient_id ||
                "PT000001"}
            </strong>

          </div>

        </div>

      </div>

      {/* ==================================================
          GLOBAL PROFILE MESSAGE
      ================================================== */}

      {profileMessage.text && (
        <div
          className={`settings-alert ${
            profileMessage.type ===
            "success"
              ? "settings-alert-success"
              : "settings-alert-error"
          }`}
        >

          {profileMessage.type ===
          "success" ? (
            <FaCheckCircle />
          ) : (
            <FaExclamationCircle />
          )}

          <span>
            {profileMessage.text}
          </span>

        </div>
      )}

      {/* ==================================================
          MAIN SETTINGS GRID
      ================================================== */}

      <div className="settings-main-grid">

        {/* =================================================
            PROFILE SETTINGS CARD
        ================================================= */}

        <section className="settings-card profile-settings-card">

          {/* Card Header */}

          <div className="settings-card-header">

            <div className="settings-card-heading">

              <div className="settings-card-icon profile-icon">
                <FaUser />
              </div>

              <div>

                <h2>
                  Profile Settings
                </h2>

                <p>
                  View and update your
                  personal information
                </p>

              </div>

            </div>

          </div>

          {/* Profile Form */}

          <form
            className="profile-form"
            onSubmit={handleSaveProfile}
          >

            {/* ==========================================
                PHOTO SECTION
            ========================================== */}

            <div className="profile-photo-column">

              <div className="profile-photo-label">
                Profile Photo
              </div>

              <div className="profile-photo-wrapper">

                {/* --------------------------------------
                    Existing Profile Photo
                -------------------------------------- */}

                {getPhotoUrl() ? (
                  <img
                    src={getPhotoUrl()}
                    alt="Profile"
                    className="profile-photo"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";

                      const fallback =
                        event.currentTarget
                          .nextElementSibling;

                      if (fallback) {
                        fallback.style.display =
                          "flex";
                      }
                    }}
                  />
                ) : null}

                {/* --------------------------------------
                    Placeholder
                -------------------------------------- */}

                <div
                  className="profile-photo-placeholder"
                  style={{
                    display: getPhotoUrl()
                      ? "none"
                      : "flex",
                  }}
                >
                  <FaUser />
                </div>

                {/* --------------------------------------
                    Camera Button
                -------------------------------------- */}

                <button
                  type="button"
                  className="profile-camera-badge"
                  onClick={
                    handleCameraClick
                  }
                  disabled={
                    uploadingPhoto
                  }
                  title="Change profile photo"
                  aria-label="Change profile photo"
                >

                  {uploadingPhoto ? (
                    <span className="button-spinner"></span>
                  ) : (
                    <FaCamera />
                  )}

                </button>

                {/* --------------------------------------
                    Hidden File Input
                -------------------------------------- */}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={
                    handlePhotoUpload
                  }
                  style={{
                    display: "none",
                  }}
                />

              </div>

              {/* ----------------------------------------
                  Photo Information
              ---------------------------------------- */}

              <div className="photo-change-title">
                {uploadingPhoto
                  ? "Uploading Photo..."
                  : "Change Photo"}
              </div>

              <div className="photo-change-description">
                Click the camera icon to
                upload a new profile photo
              </div>

              <div className="photo-change-description">
                JPG, PNG or WEBP • Maximum 5 MB
              </div>

            </div>

            {/* ==========================================
                PROFILE DETAILS
            ========================================== */}

            <div className="profile-details-column">

              <div className="settings-form-grid">

                {/* --------------------------------------
                    Full Name
                -------------------------------------- */}

                <div className="settings-field">

                  <label htmlFor="full_name">
                    Full Name
                  </label>

                  <div className="settings-input-wrapper">

                    <FaUser />

                    <input
                      id="full_name"
                      type="text"
                      name="full_name"
                      value={
                        profile.full_name
                      }
                      onChange={
                        handleProfileChange
                      }
                      placeholder="Enter your full name"
                    />

                  </div>

                </div>

                {/* --------------------------------------
                    Email
                -------------------------------------- */}

                <div className="settings-field">

                  <label htmlFor="email">
                    Email
                  </label>

                  <div className="settings-input-wrapper">

                    <FaEnvelope />

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={
                        profile.email
                      }
                      onChange={
                        handleProfileChange
                      }
                      placeholder="Enter your email"
                    />

                  </div>

                </div>

                {/* --------------------------------------
                    Phone
                -------------------------------------- */}

                <div className="settings-field">

                  <label htmlFor="phone">
                    Phone
                  </label>

                  <div className="settings-input-wrapper">

                    <FaPhone />

                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={
                        profile.phone
                      }
                      onChange={
                        handleProfileChange
                      }
                      placeholder="Enter phone number"
                    />

                  </div>

                </div>

                {/* --------------------------------------
                    Age
                -------------------------------------- */}

                <div className="settings-field">

                  <label htmlFor="age">
                    Age
                  </label>

                  <div className="settings-input-wrapper">

                    <FaCalendarAlt />

                    <input
                      id="age"
                      type="number"
                      name="age"
                      min="1"
                      max="120"
                      value={
                        profile.age
                      }
                      onChange={
                        handleProfileChange
                      }
                      placeholder="Age"
                    />

                  </div>

                </div>

                {/* --------------------------------------
                    Gender
                -------------------------------------- */}

                <div className="settings-field">

                  <label htmlFor="gender">
                    Gender
                  </label>

                  <div className="settings-input-wrapper">

                    <FaUser />

                    <select
                      id="gender"
                      name="gender"
                      value={
                        profile.gender
                      }
                      onChange={
                        handleProfileChange
                      }
                    >

                      <option value="">
                        Select gender
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

                </div>

                {/* --------------------------------------
                    Blood Group
                -------------------------------------- */}

                <div className="settings-field">

                  <label htmlFor="blood_group">
                    Blood Group
                  </label>

                  <div className="settings-input-wrapper">

                    <FaTint />

                    <select
                      id="blood_group"
                      name="blood_group"
                      value={
                        profile.blood_group
                      }
                      onChange={
                        handleProfileChange
                      }
                    >

                      <option value="">
                        Select blood group
                      </option>

                      <option value="A+">
                        A+
                      </option>

                      <option value="A-">
                        A-
                      </option>

                      <option value="B+">
                        B+
                      </option>

                      <option value="B-">
                        B-
                      </option>

                      <option value="AB+">
                        AB+
                      </option>

                      <option value="AB-">
                        AB-
                      </option>

                      <option value="O+">
                        O+
                      </option>

                      <option value="O-">
                        O-
                      </option>

                    </select>

                  </div>

                </div>

                {/* --------------------------------------
                    Address
                -------------------------------------- */}

                <div className="settings-field full-width">

                  <label htmlFor="address">
                    Address
                  </label>

                  <div className="settings-input-wrapper">

                    <FaMapMarkerAlt />

                    <input
                      id="address"
                      type="text"
                      name="address"
                      value={
                        profile.address
                      }
                      onChange={
                        handleProfileChange
                      }
                      placeholder="Enter your address"
                    />

                  </div>

                </div>

                {/* --------------------------------------
                    Emergency Contact
                -------------------------------------- */}

                <div className="settings-field full-width">

                  <label htmlFor="emergency_contact">
                    Emergency Contact
                  </label>

                  <div className="settings-input-wrapper">

                    <FaPhone />

                    <input
                      id="emergency_contact"
                      type="tel"
                      name="emergency_contact"
                      value={
                        profile.emergency_contact
                      }
                      onChange={
                        handleProfileChange
                      }
                      placeholder="Enter emergency contact"
                    />

                  </div>

                </div>

              </div>

              {/* ========================================
                  SAVE BUTTON
              ======================================== */}

              <div className="profile-save-area">

                <button
                  type="submit"
                  className="settings-primary-button"
                  disabled={
                    savingProfile ||
                    uploadingPhoto
                  }
                >

                  {savingProfile ? (
                    <>
                      <span className="button-spinner"></span>

                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />

                      Save Changes
                    </>
                  )}

                </button>

                <div className="secure-note">

                  <FaShieldAlt />

                  Your information is
                  secure and encrypted

                </div>

              </div>

            </div>

          </form>

        </section>

        {/* =================================================
            SECURITY SETTINGS CARD
        ================================================= */}

        <section className="settings-card security-settings-card">

          {/* Card Header */}

          <div className="settings-card-header">

            <div className="settings-card-heading">

              <div className="settings-card-icon security-icon">
                <FaLock />
              </div>

              <div>

                <h2>
                  Security Settings
                </h2>

                <p>
                  Change your password and
                  keep your account secure
                </p>

              </div>

            </div>

          </div>

          {/* Password Form */}

          <form
            className="password-form"
            onSubmit={
              handleChangePassword
            }
          >

            {/* --------------------------------------
                Current Password
            -------------------------------------- */}

            <div className="settings-field">

              <label htmlFor="current_password">
                Current Password
              </label>

              <div className="settings-input-wrapper password-input">

                <FaLock />

                <input
                  id="current_password"
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  name="current_password"
                  value={
                    passwordData.current_password
                  }
                  onChange={
                    handlePasswordChange
                  }
                  placeholder="Enter current password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowCurrentPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-label={
                    showCurrentPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showCurrentPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}

                </button>

              </div>

            </div>

            {/* --------------------------------------
                New Password
            -------------------------------------- */}

            <div className="settings-field">

              <label htmlFor="new_password">
                New Password
              </label>

              <div className="settings-input-wrapper password-input">

                <FaLock />

                <input
                  id="new_password"
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  name="new_password"
                  value={
                    passwordData.new_password
                  }
                  onChange={
                    handlePasswordChange
                  }
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowNewPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-label={
                    showNewPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showNewPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}

                </button>

              </div>

            </div>

            {/* --------------------------------------
                Confirm Password
            -------------------------------------- */}

            <div className="settings-field">

              <label htmlFor="confirm_password">
                Confirm New Password
              </label>

              <div className="settings-input-wrapper password-input">

                <FaLock />

                <input
                  id="confirm_password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirm_password"
                  value={
                    passwordData.confirm_password
                  }
                  onChange={
                    handlePasswordChange
                  }
                  placeholder="Confirm new password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}

                </button>

              </div>

            </div>

            {/* ==========================================
                PASSWORD REQUIREMENTS
            ========================================== */}

            <div className="password-requirements">

              <div className="requirements-header">

                <div className="requirements-icon">
                  <FaShieldAlt />
                </div>

                <div>

                  <strong>
                    Password Requirements
                  </strong>

                  <span>
                    Use a strong password
                    to protect your account
                  </span>

                </div>

              </div>

              <div className="requirements-list">

                {/* Length */}

                <div
                  className={
                    passwordRules.length
                      ? "requirement valid"
                      : "requirement"
                  }
                >

                  <FaCheckCircle />

                  <span>
                    At least 8 characters long
                  </span>

                </div>

                {/* Upper / Lower */}

                <div
                  className={
                    passwordRules.upper
                      ? "requirement valid"
                      : "requirement"
                  }
                >

                  <FaCheckCircle />

                  <span>
                    Include uppercase and
                    lowercase letters
                  </span>

                </div>

                {/* Number */}

                <div
                  className={
                    passwordRules.number
                      ? "requirement valid"
                      : "requirement"
                  }
                >

                  <FaCheckCircle />

                  <span>
                    Include at least one number
                  </span>

                </div>

                {/* Special */}

                <div
                  className={
                    passwordRules.special
                      ? "requirement valid"
                      : "requirement"
                  }
                >

                  <FaCheckCircle />

                  <span>
                    Include at least one
                    special character
                  </span>

                </div>

              </div>

            </div>

            {/* ==========================================
                PASSWORD MESSAGE
            ========================================== */}

            {passwordMessage.text && (
              <div
                className={`settings-alert password-alert ${
                  passwordMessage.type ===
                  "success"
                    ? "settings-alert-success"
                    : "settings-alert-error"
                }`}
              >

                {passwordMessage.type ===
                "success" ? (
                  <FaCheckCircle />
                ) : (
                  <FaExclamationCircle />
                )}

                <span>
                  {passwordMessage.text}
                </span>

              </div>
            )}

            {/* ==========================================
                CHANGE PASSWORD BUTTON
            ========================================== */}

            <button
              type="submit"
              className="change-password-button"
              disabled={
                changingPassword
              }
            >

              {changingPassword ? (
                <>
                  <span className="button-spinner"></span>

                  Changing Password...
                </>
              ) : (
                <>
                  <FaLock />

                  Change Password
                </>
              )}

            </button>

          </form>

        </section>

      </div>

      {/* ==================================================
          PRIVACY & SECURITY
      ================================================== */}

      <section className="privacy-security-card">

        <div className="privacy-icon-wrapper">
          <FaShieldAlt />
        </div>

        <div className="privacy-content">

          <h2>
            Privacy &amp; Security
          </h2>

          <p>
            Your privacy and security are
            our top priority. We use
            industry-standard security
            practices to protect your
            personal and medical
            information.
          </p>

          <div className="privacy-created">

            <FaLock />

            <span>
              Account created on{" "}
              <strong>
                {formatCreatedDate()}
              </strong>
            </span>

          </div>

        </div>

        <div className="privacy-visual">

          <div className="privacy-shield">
            <FaShieldAlt />
          </div>

          <div className="privacy-protected">

            <strong>
              Secure &amp; Protected
            </strong>

            <span>
              Your medical information is
              securely protected.
            </span>

            <div className="secure-badge">

              <FaCheckCircle />

              100% Secure

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <div className="dashboard-footer">

        <p>
          © 2026 MedAssist AI | AI-Powered
          Medical Symptom Analysis &amp;
          Disease Prediction System
        </p>

      </div>

    </div>
  );
}

export default Settings;