import {
  BsEnvelope,
  BsTelephone,
  BsGeoAlt,
  BsClock,
  BsArrowRight,
} from "react-icons/bs";

function Contact() {
  return (
    <section
      id="contact"
      style={{
        padding: "100px 0",
        background:
          "linear-gradient(180deg,#ffffff 0%,#f8fbff 100%)",
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
            CONTACT US
          </span>

          <h2
            style={{
              fontSize: "3rem",
              fontWeight: "800",
              color: "#111827",
              lineHeight: "1.2",
              marginBottom: "18px",
            }}
          >
            We're Here to
            <br />

            <span
              style={{
                background:
                  "linear-gradient(90deg,#2563eb,#7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Help You
            </span>
          </h2>

          <p
            style={{
              maxWidth: "680px",
              margin: "0 auto",
              color: "#64748b",
              fontSize: "1.1rem",
              lineHeight: "1.8",
            }}
          >
            Have questions about MedAssist AI? Reach out to us and
            we'll be happy to help.
          </p>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="row g-5 align-items-stretch">

          {/* ================= CONTACT INFORMATION ================= */}

          <div className="col-lg-5">

            <div
              style={{
                height: "100%",
                padding: "35px",
                borderRadius: "24px",
                background:
                  "linear-gradient(145deg,#eff6ff,#ffffff,#f5f3ff)",
                border: "1px solid #e5e7eb",
                boxShadow:
                  "0 15px 40px rgba(15,23,42,0.06)",
              }}
            >

              <h4
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: "12px",
                }}
              >
                Get in Touch
              </h4>

              <p
                style={{
                  color: "#64748b",
                  lineHeight: "1.7",
                  marginBottom: "30px",
                }}
              >
                Whether you have a question, feedback, or need
                assistance, our team is here to support you.
              </p>

              {/* Email */}

              <div
                className="d-flex align-items-center mb-4"
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "15px",
                    background: "#dbeafe",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    marginRight: "16px",
                    flexShrink: 0,
                  }}
                >
                  <BsEnvelope />
                </div>

                <div>
                  <small
                    style={{
                      color: "#94a3b8",
                      display: "block",
                      marginBottom: "3px",
                    }}
                  >
                    Email
                  </small>

                  <span
                    style={{
                      color: "#1e293b",
                      fontWeight: "600",
                    }}
                  >
                    support@medassistai.com
                  </span>
                </div>
              </div>

              {/* Phone */}

              <div
                className="d-flex align-items-center mb-4"
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "15px",
                    background: "#f5f3ff",
                    color: "#7c3aed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    marginRight: "16px",
                    flexShrink: 0,
                  }}
                >
                  <BsTelephone />
                </div>

                <div>
                  <small
                    style={{
                      color: "#94a3b8",
                      display: "block",
                      marginBottom: "3px",
                    }}
                  >
                    Phone
                  </small>

                  <span
                    style={{
                      color: "#1e293b",
                      fontWeight: "600",
                    }}
                  >
                    +91 00000 00000
                  </span>
                </div>
              </div>

              {/* Location */}

              <div
                className="d-flex align-items-center mb-4"
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "15px",
                    background: "#ecfdf5",
                    color: "#16a34a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    marginRight: "16px",
                    flexShrink: 0,
                  }}
                >
                  <BsGeoAlt />
                </div>

                <div>
                  <small
                    style={{
                      color: "#94a3b8",
                      display: "block",
                      marginBottom: "3px",
                    }}
                  >
                    Location
                  </small>

                  <span
                    style={{
                      color: "#1e293b",
                      fontWeight: "600",
                    }}
                  >
                    India
                  </span>
                </div>
              </div>

              {/* Support */}

              <div
                className="d-flex align-items-center"
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "15px",
                    background: "#fff7ed",
                    color: "#ea580c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    marginRight: "16px",
                    flexShrink: 0,
                  }}
                >
                  <BsClock />
                </div>

                <div>
                  <small
                    style={{
                      color: "#94a3b8",
                      display: "block",
                      marginBottom: "3px",
                    }}
                  >
                    Support
                  </small>

                  <span
                    style={{
                      color: "#1e293b",
                      fontWeight: "600",
                    }}
                  >
                    Available 24/7
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* ================= CONTACT FORM ================= */}

          <div className="col-lg-7">

            <div
              style={{
                height: "100%",
                padding: "35px",
                background: "#ffffff",
                borderRadius: "24px",
                border: "1px solid #e5e7eb",
                boxShadow:
                  "0 15px 40px rgba(15,23,42,0.06)",
              }}
            >

              <h4
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: "25px",
                }}
              >
                Send Us a Message
              </h4>

              <form>

                <div className="row g-4">

                  {/* Name */}

                  <div className="col-md-6">

                    <label
                      className="form-label fw-semibold"
                      style={{
                        color: "#334155",
                      }}
                    >
                      Full Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      style={{
                        padding: "13px 15px",
                        borderRadius: "10px",
                        border: "1px solid #dbe2ea",
                      }}
                    />

                  </div>

                  {/* Email */}

                  <div className="col-md-6">

                    <label
                      className="form-label fw-semibold"
                      style={{
                        color: "#334155",
                      }}
                    >
                      Email Address
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      style={{
                        padding: "13px 15px",
                        borderRadius: "10px",
                        border: "1px solid #dbe2ea",
                      }}
                    />

                  </div>

                  {/* Subject */}

                  <div className="col-12">

                    <label
                      className="form-label fw-semibold"
                      style={{
                        color: "#334155",
                      }}
                    >
                      Subject
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="How can we help?"
                      style={{
                        padding: "13px 15px",
                        borderRadius: "10px",
                        border: "1px solid #dbe2ea",
                      }}
                    />

                  </div>

                  {/* Message */}

                  <div className="col-12">

                    <label
                      className="form-label fw-semibold"
                      style={{
                        color: "#334155",
                      }}
                    >
                      Message
                    </label>

                    <textarea
                      rows="5"
                      className="form-control"
                      placeholder="Write your message..."
                      style={{
                        padding: "13px 15px",
                        borderRadius: "10px",
                        border: "1px solid #dbe2ea",
                        resize: "none",
                      }}
                    />

                  </div>

                  {/* Button */}

                  <div className="col-12">

                    <button
                      type="button"
                      className="btn text-white"
                      style={{
                        padding: "14px 28px",
                        borderRadius: "11px",
                        fontSize: "16px",
                        fontWeight: "600",
                        border: "none",
                        background:
                          "linear-gradient(90deg,#2563eb,#7c3aed)",
                        boxShadow:
                          "0 10px 25px rgba(79,70,229,0.22)",
                      }}
                    >
                      Send Message

                      <BsArrowRight
                        style={{
                          marginLeft: "10px",
                          fontSize: "19px",
                        }}
                      />
                    </button>

                  </div>

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Contact;