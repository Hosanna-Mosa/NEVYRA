import React from "react";
import { Navigate } from "react-router-dom";

function isAdminAuthenticated() {
  const token = localStorage.getItem("admin_token");
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.isAdmin;
  } catch {
    return false;
  }
}

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default RequireAuth; 