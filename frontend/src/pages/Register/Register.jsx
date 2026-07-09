import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const handleRegister = () => {
    // Backend API will be connected later
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Join MedAssist AI today
        </p>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border rounded-xl p-3 mb-4"
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full border rounded-xl p-3 mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-xl p-3 mb-6"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
        >
          Create Account
        </button>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;