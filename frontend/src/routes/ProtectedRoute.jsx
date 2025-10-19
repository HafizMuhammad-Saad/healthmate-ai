import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Handle 401 errors by redirecting to login
    if (!loading && !isAuthenticated && location.pathname !== '/login' && location.pathname !== '/signup') {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [loading, isAuthenticated, location, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
