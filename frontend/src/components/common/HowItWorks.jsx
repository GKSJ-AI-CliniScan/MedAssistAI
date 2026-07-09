function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Enter Symptoms",
      desc: "Select or type your symptoms using our smart symptom checker.",
    },
    {
      number: "02",
      title: "AI Analysis",
      desc: "Our machine learning model analyzes your symptoms instantly.",
    },
    {
      number: "03",
      title: "Get Prediction",
      desc: "Receive possible diseases, risk level, and health suggestions.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4">
          How It Works
        </h2>

        <p className="text-center text-gray-600 mb-16">
          Three simple steps to get AI-powered healthcare insights.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-3xl shadow-xl p-10 text-center hover:-translate-y-2 transition"
            >
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white text-3xl font-bold flex items-center justify-center mx-auto mb-6">
                {step.number}
              </div>

              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>

              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;