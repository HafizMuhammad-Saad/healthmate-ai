import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import LandingPage from "./pages/LandingPage/LandingPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import UploadReport from "./pages/Upload/UploadReport";
import VitalsTracker from "./pages/Vitals/VitalsTracker";
import AIInsights from "./pages/Insights/AIInsights";
import ReportsHistory from "./pages/Reports/ReportsHistory";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Comingsoon from "./pages/Comingsoon";
import Profile from "./pages/Profile";

import DashboardLayout from "./components/Layout/DashboardLayout";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes inside Dashboard Layout */}
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<UploadReport />} />
              <Route path="/vitals" element={<VitalsTracker />} />
              <Route path="/insights" element={<AIInsights />} />
              <Route path="/reports" element={<ReportsHistory />} />
              <Route path="/trends" element={<Comingsoon />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>


        <Toaster
          toastOptions={{
            style: {
              border: "1px solid #ccc",
              padding: "16px",
              borderRadius: "8px",
              backgroundColor: "#fff",
              color: "#333",
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
