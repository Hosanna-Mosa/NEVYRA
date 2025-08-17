import React from "react";
import { Navigate } from "react-router-dom";
import { adminAuthUtils } from "../lib/api";

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!adminAuthUtils.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default RequireAuth; 