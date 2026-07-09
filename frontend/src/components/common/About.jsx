
function About() {
  return (
    <section id="about" className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
        <img
          src="/healthcare.jpg"
          alt="Healthcare"
          className="w-full h-full object-cover rounded-3xl"
        />

        <div>
          <p className="text-blue-600 font-semibold uppercase tracking-wider mb-3">
            About MedAssist AI
          </p>

          <h2 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
            AI That Helps You Understand Your Health
          </h2>

          <p className="text-lg text-gray-600 leading-8 mb-6">
            MedAssist AI is an intelligent healthcare platform designed to
            analyze symptoms, predict possible diseases, estimate health risks,
            and generate personalized healthcare insights using Artificial
            Intelligence.
          </p>

          <p className="text-lg text-gray-600 leading-8 mb-8">
            Our goal is to make healthcare more accessible by providing quick,
            accurate, and user-friendly AI assistance before consulting a
            medical professional.
          </p>

          <button className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

export default About;