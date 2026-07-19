import { Link, useNavigate } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");

  navigate("/login");
};

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-6">

        <h1 className="text-3xl font-bold text-blue-400 mb-10">
          MedAssist AI
        </h1>

        <ul className="space-y-4">

          <Link to="/dashboard">
            <li className="hover:bg-slate-700 p-3 rounded-xl cursor-pointer">
              🏠 Dashboard
            </li>
          </Link>

          <Link to="/symptom-checker">
            <li className="hover:bg-slate-700 p-3 rounded-xl cursor-pointer">
              🩺 Symptom Checker
            </li>
          </Link>

          <Link to="/prediction">
            <li className="hover:bg-slate-700 p-3 rounded-xl cursor-pointer">
              🤖 AI Prediction
            </li>
          </Link>

          <Link to="/reports">
            <li className="hover:bg-slate-700 p-3 rounded-xl cursor-pointer">
              📄 Reports
            </li>
          </Link>

          <Link to="/profile">
            <li className="hover:bg-slate-700 p-3 rounded-xl cursor-pointer">
              👤 Profile
            </li>
          </Link>

        </ul>

        <div className="mt-10">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 p-3 rounded-xl text-white"
          >
            🚪 Logout
          </button>
        </div>

        </div>

      {/* Page Content */}
      <div className="flex-1 p-10">
        {children}
      </div>

    </div>
  );
}

export default Layout;