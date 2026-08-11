import {
  BsCpu,
  BsShieldCheck,
  BsCapsulePill,
  BsFileEarmarkMedical,
  BsClockHistory,
  BsGraphUpArrow,
} from "react-icons/bs";

function Features() {
  const features = [
    {
      icon: <BsCpu />,
      title: "AI Disease Prediction",
      description:
        "Analyze your symptoms using our machine learning model and receive an intelligent disease prediction with confidence scores.",
      color: "#2563eb",
      background: "#eff6ff",
    },
    {
      icon: <BsShieldCheck />,
      title: "Health Risk Assessment",
      description:
        "Understand the severity of your condition through a comprehensive risk assessment based on symptoms, age, medical history, and lifestyle.",
      color: "#7c3aed",
      background: "#f5f3ff",
    },
    {
      icon: <BsCapsulePill />,
      title: "Personalized Recommendations",
      description:
        "Receive disease-specific precautions, diet suggestions, lifestyle guidance, and general medicine information.",
      color: "#0891b2",
      background: "#ecfeff",
    },
    {
      icon: <BsFileEarmarkMedical />,
      title: "Professional Health Reports",
      description:
        "Generate detailed PDF health reports containing your symptoms, prediction, confidence, risk level, and recommendations.",
      color: "#16a34a",
      background: "#f0fdf4",
    },
    {
      icon: <BsClockHistory />,
      title: "Complete Medical History",
      description:
        "Keep track of your previous health analyses, predictions, risk levels, recommendations, and generated reports.",
      color: "#ea580c",
      background: "#fff7ed",
    },
    {
      icon: <BsGraphUpArrow />,
      title: "Health Analytics",
      description:
        "Visualize your health information through meaningful charts, disease trends, prediction history, and risk distribution.",
      color: "#db2777",
      background: "#fdf2f8",
    },
  ];

  return (
    <section
      id="features"
      style={{
        padding: "100px 0",
        background: "#ffffff",
      }}
    >
      <div className="container">

        {/* ================= SECTION HEADER ================= */}

        <div className="text-center mb-5">

          <span
            className="badge rounded-pill px-4 py-2 mb-3"
            style={{
              background: "#dbeafe",
              color: "#2563eb",
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "0.5px",
            }}
          >
            POWERFUL FEATURES
          </span>

          <h2
            style={{
              fontSize: "3rem",
              fontWeight: "800",
              color: "#111827",
              marginBottom: "18px",
            }}
          >
            Smarter Healthcare,
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg,#2563eb,#7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Powered by AI
            </span>
          </h2>

          <p
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              fontSize: "1.15rem",
              lineHeight: "1.8",
              color: "#6b7280",
            }}
          >
            MedAssist AI brings intelligent disease prediction, risk
            assessment, personalized recommendations, and health management
            together in one secure healthcare platform.
          </p>

        </div>

        {/* ================= FEATURE CARDS ================= */}

        <div className="row g-4 mt-4">

          {features.map((feature, index) => (
            <div
              className="col-md-6 col-lg-4"
              key={index}
            >
              <div
                style={{
                  height: "100%",
                  padding: "32px",
                  borderRadius: "20px",
                  background: "#ffffff",
                  border: "1px solid #eef2f7",
                  boxShadow:
                    "0 8px 30px rgba(15,23,42,0.06)",
                  transition:
                    "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-8px)";

                  e.currentTarget.style.boxShadow =
                    "0 18px 40px rgba(15,23,42,0.10)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0)";

                  e.currentTarget.style.boxShadow =
                    "0 8px 30px rgba(15,23,42,0.06)";
                }}
              >

                {/* ICON */}

                <div
                  style={{
                    width: "62px",
                    height: "62px",
                    borderRadius: "16px",
                    background: feature.background,
                    color: feature.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    marginBottom: "24px",
                  }}
                >
                  {feature.icon}
                </div>

                {/* TITLE */}

                <h4
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: "700",
                    color: "#111827",
                    marginBottom: "14px",
                  }}
                >
                  {feature.title}
                </h4>

                {/* DESCRIPTION */}

                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "1rem",
                    lineHeight: "1.7",
                    marginBottom: "0",
                  }}
                >
                  {feature.description}
                </p>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Features;