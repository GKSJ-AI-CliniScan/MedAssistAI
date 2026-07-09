import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-3xl font-bold text-blue-600">
          MedAssist AI
        </h1>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8">

          <a href="#" className="hover:text-blue-600 transition">
            Home
          </a>

          <a href="#" className="hover:text-blue-600 transition">
            Features
          </a>

          <a href="#" className="hover:text-blue-600 transition">
            About
          </a>

          <a href="#" className="hover:text-blue-600 transition">
            Contact
          </a>

        </div>

        {/* Buttons */}

        <div className="flex gap-3">

        <Link to="/login">
            <button className="px-5 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50">
            Login
            </button>
        </Link>

        <Link to="/dashboard">
            <button className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            Get Started
            </button>
        </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;