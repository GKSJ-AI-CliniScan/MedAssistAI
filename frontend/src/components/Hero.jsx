import doctor from "../assets/doctor.png";

import {
  BsShieldCheck,
  BsHeartPulseFill,
  BsCapsulePill,
  BsCpu,
  BsBullseye,
  BsHeartPulse,
  BsHeadset,
  BsLockFill,
  BsPlayCircle,
} from "react-icons/bs";

function Hero() {
  return (
    <section
      style={{
        minHeight: "calc(100vh - 82px)",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(115deg, #f1f7ff 0%, #ffffff 48%, #f5f1ff 100%)",
        padding: "55px 0 0",
      }}
    >
      {/* ================= BACKGROUND DECORATIONS ================= */}

      <div
        style={{
          position: "absolute",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(219,234,254,0.85) 0%, rgba(239,246,255,0.45) 48%, transparent 72%)",
          left: "-120px",
          top: "100px",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "650px",
          height: "650px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 68%)",
          right: "-260px",
          top: "-120px",
          zIndex: 0,
        }}
      />

      {/* Decorative dots - top left */}
      <div
        style={{
          position: "absolute",
          left: "35px",
          top: "42px",
          width: "90px",
          height: "70px",
          opacity: 0.5,
          backgroundImage:
            "radial-gradient(circle, #8eb9f7 2px, transparent 2px)",
          backgroundSize: "24px 20px",
          zIndex: 0,
        }}
      />

      {/* Decorative plus - top right */}
      <div
        style={{
          position: "absolute",
          right: "65px",
          top: "85px",
          color: "#c4b5fd",
          fontSize: "44px",
          fontWeight: 200,
          opacity: 0.65,
          zIndex: 0,
        }}
      >
        +
      </div>

      {/* ================= MAIN CONTAINER ================= */}

      <div
        className="container position-relative"
        style={{
          zIndex: 2,
          maxWidth: "1400px",
        }}
      >
        <div className="row align-items-center">

          {/* =====================================================
              LEFT SIDE - DOCTOR
          ===================================================== */}

          <div className="col-lg-5">
            <div
              style={{
                position: "relative",
                height: "600px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Large circular medical background */}

              <div
                style={{
                  position: "absolute",
                  width: "500px",
                  height: "500px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at center, #dbeafe 0%, #eaf3ff 55%, rgba(255,255,255,0) 72%)",
                  zIndex: 1,
                }}
              />

              {/* Outer circular ring */}

              <div
                style={{
                  position: "absolute",
                  width: "555px",
                  height: "555px",
                  borderRadius: "50%",
                  border: "1px solid rgba(96,165,250,0.25)",
                  zIndex: 1,
                }}
              />

              {/* Small orbit dots */}

              <div
                style={{
                  position: "absolute",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#93c5fd",
                  top: "72px",
                  right: "60px",
                  zIndex: 2,
                }}
              />

              <div
                style={{
                  position: "absolute",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#a78bfa",
                  bottom: "75px",
                  left: "75px",
                  zIndex: 2,
                }}
              />

              {/* ================= DOCTOR ================= */}

              <img
                src={doctor}
                alt="MedAssist AI Doctor"
                style={{
                  position: "relative",
                  zIndex: 3,
                  width: "100%",
                  maxWidth: "500px",
                  maxHeight: "590px",
                  objectFit: "contain",
                  filter:
                    "drop-shadow(0 28px 35px rgba(30,64,175,0.16))",
                }}
              />

              {/* =================================================
                  FLOATING CARD - TRUSTED & SECURE
              ================================================= */}

              <div
                style={{
                  position: "absolute",
                  left: "-10px",
                  top: "170px",
                  width: "105px",
                  minHeight: "125px",
                  background: "rgba(255,255,255,0.96)",
                  borderRadius: "18px",
                  boxShadow:
                    "0 15px 40px rgba(30,64,175,0.10)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "14px",
                  zIndex: 5,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "14px",
                    background: "#eff6ff",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "23px",
                    marginBottom: "8px",
                  }}
                >
                  <BsShieldCheck />
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#374151",
                    lineHeight: "1.35",
                  }}
                >
                  Trusted &
                  <br />

                  <strong style={{ color: "#2563eb" }}>
                    Secure
                  </strong>
                </div>
              </div>

              {/* =================================================
                  FLOATING CARD - HEALTH MONITORING
              ================================================= */}

              <div
                style={{
                  position: "absolute",
                  right: "-5px",
                  top: "115px",
                  width: "105px",
                  minHeight: "125px",
                  background: "rgba(255,255,255,0.96)",
                  borderRadius: "18px",
                  boxShadow:
                    "0 15px 40px rgba(30,64,175,0.10)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "14px",
                  zIndex: 5,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "14px",
                    background: "#fff1f2",
                    color: "#ef4444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "23px",
                    marginBottom: "8px",
                  }}
                >
                  <BsHeartPulseFill />
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#374151",
                    lineHeight: "1.35",
                  }}
                >
                  Health
                  <br />

                  <strong style={{ color: "#ef4444" }}>
                    Monitoring
                  </strong>
                </div>
              </div>

              {/* =================================================
                  FLOATING CARD - SMART MEDICATIONS
              ================================================= */}

              <div
                style={{
                  position: "absolute",
                  left: "-20px",
                  bottom: "105px",
                  width: "105px",
                  minHeight: "125px",
                  background: "rgba(255,255,255,0.96)",
                  borderRadius: "18px",
                  boxShadow:
                    "0 15px 40px rgba(30,64,175,0.10)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "14px",
                  zIndex: 5,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "14px",
                    background: "#f5f3ff",
                    color: "#7c3aed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "23px",
                    marginBottom: "8px",
                  }}
                >
                  <BsCapsulePill />
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#374151",
                    lineHeight: "1.35",
                  }}
                >
                  Smart
                  <br />

                  <strong style={{ color: "#7c3aed" }}>
                    Medications
                  </strong>
                </div>
              </div>

              {/* =================================================
                  FLOATING CARD - AI DIAGNOSIS
              ================================================= */}

              <div
                style={{
                  position: "absolute",
                  right: "-20px",
                  bottom: "80px",
                  width: "110px",
                  minHeight: "125px",
                  background: "rgba(255,255,255,0.96)",
                  borderRadius: "18px",
                  boxShadow:
                    "0 15px 40px rgba(30,64,175,0.10)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "14px",
                  zIndex: 5,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "14px",
                    background: "#ecfdf5",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "23px",
                    marginBottom: "8px",
                  }}
                >
                  <BsCpu />
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#374151",
                    lineHeight: "1.35",
                  }}
                >
                  AI-Powered
                  <br />

                  <strong style={{ color: "#059669" }}>
                    Diagnosis
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              RIGHT SIDE - CONTENT
          ===================================================== */}

          <div className="col-lg-7">
            <div
              style={{
                paddingLeft: "35px",
                paddingBottom: "45px",
              }}
            >
              {/* Badge */}

              <div
                style={{
                  display: "inline-block",
                  background: "#e0ecff",
                  color: "#2563eb",
                  borderRadius: "30px",
                  padding: "11px 24px",
                  fontSize: "16px",
                  fontWeight: 600,
                  letterSpacing: "0.2px",
                  marginBottom: "28px",
                }}
              >
                AI HEALTHCARE PLATFORM
              </div>

              {/* Heading */}

              <h1
                style={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize: "5rem",
                  lineHeight: "1.03",
                  letterSpacing: "-2px",
                  color: "#111827",
                }}
              >
                AI-Powered
                <br />

                <span
                  style={{
                    background:
                      "linear-gradient(90deg,#2563eb 0%,#7c3aed 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Medical Diagnosis
                </span>
              </h1>

              {/* Description */}

              <p
                style={{
                  marginTop: "30px",
                  marginBottom: 0,
                  maxWidth: "700px",
                  fontSize: "1.3rem",
                  lineHeight: "1.75",
                  color: "#4b5563",
                  fontWeight: 400,
                }}
              >
                Predict diseases, assess risks, receive personalized
                recommendations, and maintain your complete medical
                history — all in one intelligent healthcare platform.
              </p>

              {/* CTA Buttons */}

              <div
                className="d-flex flex-wrap gap-4"
                style={{
                  marginTop: "38px",
                }}
              >
                <button
                  className="btn text-white"
                  style={{
                    minWidth: "270px",
                    padding: "18px 34px",
                    borderRadius: "15px",
                    border: "none",
                    fontSize: "18px",
                    fontWeight: 600,
                    background:
                      "linear-gradient(90deg,#2563eb,#7c3aed)",
                    boxShadow:
                      "0 15px 30px rgba(79,70,229,0.28)",
                  }}
                >
                  Get Started
                  <span
                    style={{
                      marginLeft: "14px",
                      fontSize: "22px",
                    }}
                  >
                    →
                  </span>
                </button>

                <button
                  className="btn"
                  style={{
                    minWidth: "225px",
                    padding: "18px 28px",
                    borderRadius: "15px",
                    border: "1.5px solid #2563eb",
                    background: "#ffffff",
                    color: "#2563eb",
                    fontSize: "18px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                  }}
                >
                  Learn More
                  <BsPlayCircle
                    style={{
                      fontSize: "23px",
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            STATISTICS CARD
        ===================================================== */}

        <div
          style={{
            position: "relative",
            marginTop: "-10px",
            marginBottom: "35px",
            background: "rgba(255,255,255,0.96)",
            borderRadius: "24px",
            padding: "25px 35px",
            boxShadow:
              "0 18px 50px rgba(30,64,175,0.12)",
            border: "1px solid rgba(226,232,240,0.8)",
            backdropFilter: "blur(15px)",
          }}
        >
          <div className="row align-items-center g-0">

            {/* Accuracy */}

            <div className="col-lg-3 col-md-6">
              <div
                className="d-flex align-items-center"
                style={{
                  padding: "10px 25px",
                }}
              >
                <div
                  style={{
                    width: "68px",
                    height: "68px",
                    minWidth: "68px",
                    borderRadius: "50%",
                    background: "#eff6ff",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "30px",
                    marginRight: "18px",
                  }}
                >
                  <BsBullseye />
                </div>

                <div>
                  <h3
                    style={{
                      margin: 0,
                      color: "#2563eb",
                      fontSize: "2rem",
                      fontWeight: 800,
                    }}
                  >
                    95%
                  </h3>

                  <strong
                    style={{
                      display: "block",
                      color: "#111827",
                      fontSize: "16px",
                      marginTop: "2px",
                    }}
                  >
                    Accuracy
                  </strong>

                  <small
                    style={{
                      color: "#6b7280",
                      lineHeight: "1.4",
                    }}
                  >
                    High prediction accuracy
                    <br />
                    powered by AI
                  </small>
                </div>
              </div>
            </div>

            {/* Diseases */}

            <div className="col-lg-3 col-md-6">
              <div
                className="d-flex align-items-center"
                style={{
                  padding: "10px 25px",
                  borderLeft:
                    "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    width: "68px",
                    height: "68px",
                    minWidth: "68px",
                    borderRadius: "50%",
                    background: "#f5f3ff",
                    color: "#7c3aed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "30px",
                    marginRight: "18px",
                  }}
                >
                  <BsHeartPulse />
                </div>

                <div>
                  <h3
                    style={{
                      margin: 0,
                      color: "#7c3aed",
                      fontSize: "2rem",
                      fontWeight: 800,
                    }}
                  >
                    41+
                  </h3>

                  <strong
                    style={{
                      display: "block",
                      color: "#111827",
                      fontSize: "16px",
                      marginTop: "2px",
                    }}
                  >
                    Diseases
                  </strong>

                  <small
                    style={{
                      color: "#6b7280",
                      lineHeight: "1.4",
                    }}
                  >
                    Detect and analyze
                    <br />
                    multiple diseases
                  </small>
                </div>
              </div>
            </div>

            {/* AI Assistant */}

            <div className="col-lg-3 col-md-6">
              <div
                className="d-flex align-items-center"
                style={{
                  padding: "10px 25px",
                  borderLeft:
                    "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    width: "68px",
                    height: "68px",
                    minWidth: "68px",
                    borderRadius: "50%",
                    background: "#ecfdf5",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "30px",
                    marginRight: "18px",
                  }}
                >
                  <BsHeadset />
                </div>

                <div>
                  <h3
                    style={{
                      margin: 0,
                      color: "#059669",
                      fontSize: "2rem",
                      fontWeight: 800,
                    }}
                  >
                    24/7
                  </h3>

                  <strong
                    style={{
                      display: "block",
                      color: "#111827",
                      fontSize: "16px",
                      marginTop: "2px",
                    }}
                  >
                    AI Assistant
                  </strong>

                  <small
                    style={{
                      color: "#6b7280",
                      lineHeight: "1.4",
                    }}
                  >
                    Always here to help
                    <br />
                    you anytime
                  </small>
                </div>
              </div>
            </div>

            {/* Secure */}

            <div className="col-lg-3 col-md-6">
              <div
                className="d-flex align-items-center"
                style={{
                  padding: "10px 25px",
                  borderLeft:
                    "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    width: "68px",
                    height: "68px",
                    minWidth: "68px",
                    borderRadius: "50%",
                    background: "#eff6ff",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "30px",
                    marginRight: "18px",
                  }}
                >
                  <BsLockFill />
                </div>

                <div>
                  <h3
                    style={{
                      margin: 0,
                      color: "#2563eb",
                      fontSize: "2rem",
                      fontWeight: 800,
                    }}
                  >
                    100%
                  </h3>

                  <strong
                    style={{
                      display: "block",
                      color: "#111827",
                      fontSize: "16px",
                      marginTop: "2px",
                    }}
                  >
                    Secure
                  </strong>

                  <small
                    style={{
                      color: "#6b7280",
                      lineHeight: "1.4",
                    }}
                  >
                    Your data is encrypted
                    <br />
                    and fully protected
                  </small>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom wave-like decoration */}

      <div
        style={{
          position: "absolute",
          bottom: "-130px",
          left: "-5%",
          width: "110%",
          height: "220px",
          background:
            "linear-gradient(180deg, rgba(219,234,254,0.45), rgba(196,181,253,0.25))",
          borderRadius: "50% 50% 0 0",
          transform: "rotate(-2deg)",
          zIndex: 0,
        }}
      />
    </section>
  );
}

export default Hero;