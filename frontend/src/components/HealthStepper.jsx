import {
  FaStethoscope,
  FaNotesMedical,
  FaHeartbeat,
  FaClipboardCheck,
} from "react-icons/fa";

function HealthStepper({ currentStep }) {

  const steps = [
    {
      number: 1,
      title: "Symptoms",
      subtitle: "Select Symptoms",
      icon: <FaStethoscope />,
    },
    {
      number: 2,
      title: "Medical History",
      subtitle: "Health Records",
      icon: <FaNotesMedical />,
    },
    {
      number: 3,
      title: "Lifestyle",
      subtitle: "Daily Habits",
      icon: <FaHeartbeat />,
    },
    {
      number: 4,
      title: "Review",
      subtitle: "Confirm Details",
      icon: <FaClipboardCheck />,
    },
  ];

  return (
    <div className="stepper-container">

      {steps.map((step, index) => (

        <div
          className="step-wrapper"
          key={step.number}
        >

          <div
            className={
              currentStep >= step.number
                ? "step-circle active"
                : "step-circle"
            }
          >
            {step.icon}
          </div>

          <div className="step-text">

            <h5>{step.title}</h5>

            <span>{step.subtitle}</span>

          </div>

          {index !== steps.length - 1 && (

            <div
              className={
                currentStep > step.number
                  ? "step-line active"
                  : "step-line"
              }
            />

          )}

        </div>

      ))}

    </div>
  );
}

export default HealthStepper;