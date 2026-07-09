function Hero() {
  return (
    <section className="bg-slate-50 min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div>
          <h3 className="text-blue-600 font-semibold uppercase tracking-wider">
            AI Powered Healthcare
          </h3>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mt-4 leading-tight">
            Predict Diseases <br />
            Before They Become Serious
          </h1>

          <p className="mt-6 text-lg text-slate-600 leading-8">
            MedAssist AI helps users analyze symptoms, predict possible
            diseases, assess health risks, and receive AI-powered
            healthcare recommendations in seconds.
          </p>

          <div className="flex gap-4 mt-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold">
              Check Symptoms
            </button>

            <button className="border border-blue-600 text-blue-600 px-7 py-3 rounded-xl hover:bg-blue-50">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=600"
            alt="Doctor"
            className="rounded-3xl shadow-2xl w-full max-w-md"
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;