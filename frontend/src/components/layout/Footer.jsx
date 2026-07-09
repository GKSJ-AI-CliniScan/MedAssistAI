function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        <div>
          <h2 className="text-3xl font-bold text-blue-400">
            MedAssist AI
          </h2>
          <p className="mt-4 text-gray-400">
            AI-powered healthcare assistant for disease prediction and symptom analysis.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Home</li>
            <li>Features</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Contact</h3>
          <p className="text-gray-400">support@medassistai.com</p>
          <p className="text-gray-400">India</p>
        </div>
      </div>

      <div className="border-t border-slate-700 mt-10 pt-6 text-center text-gray-500">
        © 2026 MedAssist AI. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;