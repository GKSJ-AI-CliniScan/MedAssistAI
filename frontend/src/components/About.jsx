import {
  BsStars,
  BsShieldCheck,
  BsDatabaseCheck,
  BsPersonHeart,
} from "react-icons/bs";

function About() {
  const highlights = [
    {
      icon: <BsStars />,
      title: "AI-Powered Intelligence",
      text: "Machine learning helps analyze symptom patterns and provide disease predictions with confidence information.",
    },
    {
      icon: <BsShieldCheck />,
      title: "Health Risk Awareness",
      text: "A dedicated risk assessment process helps patients understand the severity associated with their predicted condition.",
    },
    {
      icon: <BsDatabaseCheck />,
      title: "Organized Health Records",
      text: "Predictions, reports, recommendations, and previous analyses can be maintained as part of your medical history.",
    },
    {
      icon: <BsPersonHeart />,
      title: "Patient-Centered Platform",
      text: "The platform brings symptom analysis, recommendations, reports, and analytics together in one place.",
    },
  ];

  return (
    <section
      id="about"
      style={{
        padding: "105px 0",
        background: "#ffffff",
      }}
    >
      <div className="container">

        <div className="row align-items-center g-5">

          {/* ================= LEFT CONTENT ================= */}

          <div className="col-lg-6">

            <span
              className="badge rounded-pill px-4 py-2 mb-3"
              style={{
                background: "#ede9fe",
                color: "#7c3aed",
                fontSize: "14px",
                fontWeight: "600",
                letterSpacing: "0.5px",
              }}
            >
              ABOUT MEDASSIST AI
            </span>

            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                color: "#111827",
                lineHeight: "1.2",
                marginBottom: "22px",
              }}
            >
              Intelligent Healthcare
              <br />

              <span
                style={{
                  background:
                    "linear-gradient(90deg,#2563eb,#7c3aed)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Designed Around You
              </span>
            </h2>

            <p
              style={{
                color: "#6b7280",
                fontSize: "1.1rem",
                lineHeight: "1.8",
                marginBottom: "20px",
              }}
            >
              MedAssist AI is an AI-powered healthcare platform designed
              to help patients understand their symptoms, identify possible
              diseases, assess health risks, and receive personalized
              healthcare guidance.
            </p>

            <p
              style={{
                color: "#6b7280",
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
            >
              Instead of providing only a disease prediction, MedAssist AI
              connects the complete healthcare journey — from symptom
              analysis and machine learning prediction to risk assessment,
              recommendations, professional health reports, medical history,
              and analytics.
            </p>

            {/* Small highlight */}

            <div
              className="d-flex align-items-center mt-4"
              style={{
                padding: "16px 20px",
                borderRadius: "14px",
                background: "#f8fafc",
                border: "1px solid #eef2f7",
              }}
            >
              <div
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "12px",
                  background: "#dbeafe",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  marginRight: "15px",
                  flexShrink: 0,
                }}
              >
                <BsStars />
              </div>

              <div>
                <strong
                  style={{
                    color: "#111827",
                    fontSize: "16px",
                  }}
                >
                  More than a prediction model
                </strong>

                <p
                  style={{
                    margin: "3px 0 0",
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  A complete AI-powered healthcare experience.
                </p>
              </div>
            </div>

          </div>

          {/* ================= RIGHT CONTENT ================= */}

          <div className="col-lg-6">

            <div
              style={{
                padding: "35px",
                borderRadius: "28px",
                background:
                  "linear-gradient(145deg,#eff6ff 0%,#ffffff 55%,#f5f3ff 100%)",
                border: "1px solid #e5e7eb",
                boxShadow:
                  "0 15px 45px rgba(15,23,42,0.07)",
              }}
            >

              <h4
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: "28px",
                }}
              >
                Built Around the Patient Journey
              </h4>

              <div className="row g-4">

                {highlights.map((item, index) => (
                  <div
                    className="col-sm-6"
                    key={index}
                  >
                    <div
                      style={{
                        height: "100%",
                        padding: "22px",
                        borderRadius: "18px",
                        background: "#ffffff",
                        border: "1px solid #eef2f7",
                        boxShadow:
                          "0 6px 20px rgba(15,23,42,0.04)",
                        transition:
                          "transform 0.25s ease, box-shadow 0.25s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(-5px)";

                        e.currentTarget.style.boxShadow =
                          "0 12px 28px rgba(15,23,42,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(0)";

                        e.currentTarget.style.boxShadow =
                          "0 6px 20px rgba(15,23,42,0.04)";
                      }}
                    >

                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "14px",
                          background:
                            index % 2 === 0
                              ? "#eff6ff"
                              : "#f5f3ff",
                          color:
                            index % 2 === 0
                              ? "#2563eb"
                              : "#7c3aed",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "23px",
                          marginBottom: "16px",
                        }}
                      >
                        {item.icon}
                      </div>

                      <h5
                        style={{
                          color: "#111827",
                          fontWeight: "700",
                          fontSize: "1.05rem",
                          marginBottom: "9px",
                        }}
                      >
                        {item.title}
                      </h5>

                      <p
                        style={{
                          color: "#64748b",
                          fontSize: "14px",
                          lineHeight: "1.65",
                          marginBottom: "0",
                        }}
                      >
                        {item.text}
                      </p>

                    </div>
                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default About;