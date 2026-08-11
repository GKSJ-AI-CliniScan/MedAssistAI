import { BsArrowRight, BsShieldCheck, BsStars } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function CTA() {
  const navigate = useNavigate();

  // =====================================================
  // START HEALTH ANALYSIS
  // =====================================================

  const handleStartAnalysis = () => {
    navigate("/register");
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <section
      style={{
        padding: "90px 0",
        background:
          "linear-gradient(135deg,#eff6ff 0%,#ffffff 50%,#f5f3ff 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* =================================================
          BACKGROUND DECORATION
      ================================================= */}

      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(37,99,235,0.08)",
          top: "-180px",
          left: "-120px",
          filter: "blur(30px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "rgba(124,58,237,0.08)",
          bottom: "-180px",
          right: "-100px",
          filter: "blur(30px)",
        }}
      />

      <div className="container position-relative">
        <div
          className="text-center mx-auto"
          style={{
            maxWidth: "850px",
          }}
        >
          {/* =================================================
              BADGE
          ================================================= */}

          <span
            className="badge rounded-pill px-4 py-2 mb-4"
            style={{
              background: "#dbeafe",
              color: "#2563eb",
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "0.5px",
            }}
          >
            <BsStars className="me-2" />
            START YOUR HEALTH JOURNEY
          </span>

          {/* =================================================
              HEADING
          ================================================= */}

          <h2
            style={{
              fontSize: "3.2rem",
              fontWeight: "800",
              color: "#111827",
              lineHeight: "1.2",
              marginBottom: "22px",
            }}
          >
            Take the First Step Towards
            <br />

            <span
              style={{
                background:
                  "linear-gradient(90deg,#2563eb,#7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Smarter Healthcare
            </span>
          </h2>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <p
            style={{
              color: "#64748b",
              fontSize: "1.15rem",
              lineHeight: "1.8",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Start using MedAssist AI to analyze your symptoms, understand
            potential health risks, receive personalized recommendations,
            and maintain your healthcare history in one place.
          </p>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div
            className="d-flex justify-content-center flex-wrap gap-3"
            style={{
              marginTop: "38px",
            }}
          >
            {/* =================================================
                START YOUR HEALTH ANALYSIS
            ================================================= */}

            <button
              type="button"
              className="btn text-white"
              onClick={handleStartAnalysis}
              style={{
                padding: "16px 34px",
                borderRadius: "12px",
                fontSize: "17px",
                fontWeight: "600",
                border: "none",
                background:
                  "linear-gradient(90deg,#2563eb,#7c3aed)",
                boxShadow:
                  "0 12px 28px rgba(79,70,229,0.28)",
                cursor: "pointer",
              }}
            >
              Start Your Health Analysis

              <BsArrowRight
                style={{
                  marginLeft: "10px",
                  fontSize: "20px",
                }}
              />
            </button>

            {/* =================================================
                LOGIN
            ================================================= */}

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleLogin}
              style={{
                padding: "16px 34px",
                borderRadius: "12px",
                fontSize: "17px",
                fontWeight: "600",
                background: "#ffffff",
                cursor: "pointer",
              }}
            >
              Already Have an Account? Login
            </button>
          </div>

          {/* =================================================
              TRUST INDICATORS
          ================================================= */}

          <div
            className="d-flex justify-content-center flex-wrap gap-4"
            style={{
              marginTop: "32px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            <span>
              <BsShieldCheck
                style={{
                  color: "#2563eb",
                  marginRight: "7px",
                  fontSize: "18px",
                }}
              />

              Secure Patient Experience
            </span>

            <span>
              <BsStars
                style={{
                  color: "#7c3aed",
                  marginRight: "7px",
                  fontSize: "18px",
                }}
              />

              AI-Powered Analysis
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;