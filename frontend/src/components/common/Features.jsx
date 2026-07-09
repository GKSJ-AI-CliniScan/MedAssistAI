function Features() {
  const features = [
    {
      title: "Disease Prediction",
      desc: "Predict diseases using AI-powered machine learning models.",
      icon: "🩺",
    },
    {
      title: "Symptom Checker",
      desc: "Enter symptoms and receive possible medical conditions.",
      icon: "💊",
    },
    {
      title: "Risk Assessment",
      desc: "Know your health risk based on personal information.",
      icon: "📊",
    },
    {
      title: "Medical Reports",
      desc: "View prediction history and downloadable reports.",
      icon: "📄",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-12">
          Our Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="shadow-lg rounded-2xl p-8 hover:shadow-xl transition"
            >
              <div className="text-5xl mb-5">{feature.icon}</div>

              <h3 className="text-xl font-bold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600">
                {feature.desc}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Features;