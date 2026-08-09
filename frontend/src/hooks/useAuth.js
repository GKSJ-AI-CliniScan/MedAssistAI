import { useEffect, useState } from 'react';
import { authApi } from '../services/api';
import { getToken, getUser, setUser as persistUser, clearAuth } from '../utils/auth';

/**
 * useAuth — mirrors the authenticated user from the FastAPI backend.
 * On mount, if a token exists, it calls GET /auth/me to refresh the profile.
 */
export function useAuth() {
  const [user, setLocalUser] = useState(getUser());
  const [loading, setLoading] = useState(!!getToken());
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((data) => {
        if (!active) return;
        const u = data.user || data;
        persistUser(u);
        setLocalUser(u);
      })
      .catch((e) => {
        if (!active) return;
        if (e.status === 401) clearAuth();
        setError(e.message);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const updateUser = (next) => {
    const u = typeof next === 'function' ? next(user) : next;
    persistUser(u);
    setLocalUser(u);
  };

  return { user, loading, error, isAuthenticated: !!getToken(), updateUser };
}
