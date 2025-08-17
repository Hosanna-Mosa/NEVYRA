import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface RequireAuthProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const RequireAuth = ({ children, requireAdmin = false }: RequireAuthProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with the return url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireAdmin && !user?.isAdmin) {
    // Redirect to home page if user is not admin
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth; 