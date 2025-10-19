import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';
import LandingPage from './pages/LandingPage/LandingPage';
import Dashboard from './pages/Dashboard/Dashboard';
import UploadReport from './pages/Upload/UploadReport';
import VitalsTracker from './pages/Vitals/VitalsTracker';
import AIInsights from './pages/Insights/AIInsights';
import ReportsHistory from './pages/Reports/ReportsHistory';
// import HealthTrends from './pages/Trends/HealthTrends';
// import UserProfile from './pages/Profile/UserProfile';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// import DotGrid from '../Reactbits/DotGrid/DotGrid';
import Silk from '../Reactbits/Silk/Silk';

function App() {
// console.log("✅ BASE_URL =", import.meta.env.VITE_BASE_URL);

  return (
    <AuthProvider>
      {/* <div className="relative min-h-screen light-silk">
<div className="fixed inset-0 -z-10">
          <Silk
  speed={5}
  scale={1}
  color="#436B84"
  noiseIntensity={1.5}
  rotation={0}
/>
        </div> */}
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected HealthMate AI Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadReport />} />
            <Route path="/vitals" element={<VitalsTracker />} />
            <Route path="/insights" element={<AIInsights />} />
            <Route path="/reports" element={<ReportsHistory />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      <Toaster 
        toastOptions={{
          className: '',
          style: {
            border: '1px solid #ccc',
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: '#fff',
            color: '#333',
          }
        }}
      />

      {/* </div> */}

    </AuthProvider>
  )
}

export default App
