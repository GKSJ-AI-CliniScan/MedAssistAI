import {
  BsPersonCheck,
  BsListCheck,
  BsClipboard2Pulse,
  BsCpu,
  BsShieldCheck,
  BsCapsulePill,
  BsFileEarmarkMedical,
} from "react-icons/bs";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <BsPersonCheck />,
      title: "Create Your Account",
      description:
        "Register securely and create your personal MedAssist AI healthcare profile.",
      color: "#2563eb",
      background: "#eff6ff",
    },
    {
      number: "02",
      icon: <BsListCheck />,
      title: "Enter Your Symptoms",
      description:
        "Select your current symptoms and provide relevant medical history and lifestyle information.",
      color: "#7c3aed",
      background: "#f5f3ff",
    },
    {
      number: "03",
      icon: <BsClipboard2Pulse />,
      title: "Review Information",
      description:
        "Review your symptoms, medical history, lifestyle factors, age, and gender before analysis.",
      color: "#0891b2",
      background: "#ecfeff",
    },
    {
      number: "04",
      icon: <BsCpu />,
      title: "AI Disease Prediction",
      description:
        "Our Random Forest machine learning model analyzes your symptom pattern and predicts possible diseases.",
      color: "#2563eb",
      background: "#eff6ff",
    },
    {
      number: "05",
      icon: <BsShieldCheck />,
      title: "Risk Assessment",
      description:
        "MedAssist AI calculates your health risk using the predicted disease, symptoms, age, medical history, and lifestyle.",
      color: "#dc2626",
      background: "#fef2f2",
    },
    {
      number: "06",
      icon: <BsCapsulePill />,
      title: "Get Recommendations",
      description:
        "Receive disease-specific precautions, diet suggestions, lifestyle guidance, and general healthcare information.",
      color: "#16a34a",
      background: "#f0fdf4",
    },
    {
      number: "07",
      icon: <BsFileEarmarkMedical />,
      title: "Generate Health Report",
      description:
        "Generate a professional PDF report and save your complete analysis to your medical history.",
      color: "#ea580c",
      background: "#fff7ed",
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        padding: "105px 0",
        background:
          "linear-gradient(180deg,#f8fbff 0%,#ffffff 100%)",
      }}
    >
      <div className="container">

        {/* ================= HEADER ================= */}

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
            HOW IT WORKS
          </span>

          <h2
            style={{
              fontSize: "3rem",
              fontWeight: "800",
              color: "#111827",
              marginBottom: "18px",
            }}
          >
            From Symptoms to
            <br />

            <span
              style={{
                background:
                  "linear-gradient(90deg,#2563eb,#7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Intelligent Health Insights
            </span>
          </h2>

          <p
            style={{
              maxWidth: "720px",
              margin: "0 auto",
              fontSize: "1.15rem",
              lineHeight: "1.8",
              color: "#6b7280",
            }}
          >
            MedAssist AI follows a simple and intelligent workflow to
            analyze your symptoms, assess your health risk, and provide
            personalized healthcare insights.
          </p>

        </div>

        {/* ================= STEPS ================= */}

        <div
          style={{
            maxWidth: "1050px",
            margin: "65px auto 0",
          }}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              className="row align-items-center"
              style={{
                marginBottom:
                  index === steps.length - 1 ? "0" : "35px",
              }}
            >

              {/* ================= NUMBER / ICON ================= */}

              <div className="col-md-2 text-center">

                <div
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {/* Number */}

                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: step.color,
                      marginBottom: "8px",
                      letterSpacing: "1px",
                    }}
                  >
                    STEP {step.number}
                  </div>

                  {/* Icon */}

                  <div
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "20px",
                      background: step.background,
                      color: step.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "30px",
                      boxShadow:
                        "0 8px 22px rgba(15,23,42,0.06)",
                    }}
                  >
                    {step.icon}
                  </div>

                </div>

              </div>

              {/* ================= CONTENT ================= */}

              <div className="col-md-10">

                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #eef2f7",
                    borderRadius: "18px",
                    padding: "25px 30px",
                    boxShadow:
                      "0 7px 25px rgba(15,23,42,0.045)",
                    transition:
                      "transform 0.25s ease, box-shadow 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateX(6px)";

                    e.currentTarget.style.boxShadow =
                      "0 14px 32px rgba(15,23,42,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      "translateX(0)";

                    e.currentTarget.style.boxShadow =
                      "0 7px 25px rgba(15,23,42,0.045)";
                  }}
                >

                  <h4
                    style={{
                      fontSize: "1.35rem",
                      fontWeight: "700",
                      color: "#111827",
                      marginBottom: "8px",
                    }}
                  >
                    {step.title}
                  </h4>

                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "1rem",
                      lineHeight: "1.7",
                      marginBottom: "0",
                    }}
                  >
                    {step.description}
                  </p>

                </div>

              </div>

            </div>
          ))}
        </div>

        {/* ================= BOTTOM MESSAGE ================= */}

        <div
          className="text-center"
          style={{
            marginTop: "70px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "14px 28px",
              borderRadius: "50px",
              background: "#f1f5f9",
              color: "#475569",
              fontSize: "15px",
              fontWeight: "500",
            }}
          >
            🩺 Your health journey, powered by intelligent technology.
          </div>
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;