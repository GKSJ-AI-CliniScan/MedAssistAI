import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import SymptomChecker from "./pages/SymptomChecker/SymptomChecker";
import Prediction from "./pages/Prediction/Prediction";
import Reports from "./pages/Reports/Reports";
import Profile from "./pages/Profile/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/symptom-checker"
        element={<SymptomChecker />}
      />
      <Route
        path="/prediction"
        element={<Prediction />}
      />
      <Route
        path="/reports"
        element={<Reports />}
      />
      <Route
        path="/profile"
        element={<Profile />}
      />
    </Routes>
  );
}

export default App;