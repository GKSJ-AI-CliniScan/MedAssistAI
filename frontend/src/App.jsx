import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import SymptomChecker from "./pages/SymptomChecker/SymptomChecker";
import Prediction from "./pages/Prediction/Prediction";
import Reports from "./pages/Reports/Reports";
import Profile from "./pages/Profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import PredictionDetails from "./pages/PredictionDetails/PredictionDetails";

function App() {
  return (
    <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/symptom-checker"
    element={
      <ProtectedRoute>
        <SymptomChecker />
      </ProtectedRoute>
    }
  />

  <Route
    path="/prediction"
    element={
      <ProtectedRoute>
        <Prediction />
      </ProtectedRoute>
    }
  />

  <Route
    path="/reports"
    element={
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    }
  />

  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <Profile />

      </ProtectedRoute>
    }
  />

  <Route
  path="/prediction-details"
  element={
    <ProtectedRoute>
      <PredictionDetails />
    </ProtectedRoute>
  }
/>
</Routes>
  );
}

export default App;