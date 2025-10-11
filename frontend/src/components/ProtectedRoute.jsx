import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * A private route component that checks for authentication and role authorization.
 * @param {object} props
 * @param {JSX.Element} props.children - The protected component to render.
 * @param {string} props.expectedRole - The required role (e.g., 'admin', 'queryHandler').
 * @param {string} props.loginPath - The path to redirect to if not logged in (e.g., '/admin/login').
 * @param {string} props.unauthorizedRedirectPath - The path to redirect to if logged in but has the wrong role (e.g., '/query-handler' for an unauthorized admin).
 */
const ProtectedRoute = ({ children, expectedRole, loginPath, unauthorizedRedirectPath }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  // 1. Check if the user is authenticated at all
  if (!user) {
    // Redirect to the role-specific login page
    return <Navigate to={loginPath} replace />;
  }

  // 2. Check if the authenticated user has the expected role
  if (user.role !== expectedRole) {
    // If authenticated but the role is wrong, redirect to a safe/known dashboard 
    // (e.g., the handler dashboard if an admin tries to access it, or vice versa)
    console.warn(`User role mismatch: Expected ${expectedRole}, got ${user.role}. Redirecting to ${unauthorizedRedirectPath}`);
    return <Navigate to={unauthorizedRedirectPath} replace />;
  }

  // If authenticated and role matches, render children
  return children;
};

export default ProtectedRoute;


// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) return <div>Loading...</div>;
  
//   if (!user) return <Navigate to="/admin/login" replace />;

//   return children;
// };

// export default ProtectedRoute;
