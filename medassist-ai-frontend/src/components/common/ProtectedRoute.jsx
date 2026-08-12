import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import Spinner from '../ui/Spinner';

/**
 * ProtectedRoute — redirects to /login when no JWT is present.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export function PublicOnlyRoute({ children }) {
  const token = getToken();
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}

export function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50">
      <Spinner size={36} />
    </div>
  );
}
