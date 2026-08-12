import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const err = searchParams.get('error');

      if (err) {
        setErrorMsg(decodeURIComponent(err));
        toast.error(decodeURIComponent(err));
        setTimeout(() => navigate('/auth/login'), 3000);
        return;
      }

      if (accessToken && refreshToken) {
        try {
          authService.setSessionTokens(accessToken, refreshToken);
          const freshUser = await authService.getMe();
          toast.success(`Welcome back, ${freshUser?.full_name || 'Doctor'}!`, { icon: '🔐' });
          navigate('/dashboard', { replace: true });
        } catch (e) {
          setErrorMsg('Failed to complete session setup. Please try signing in again.');
          toast.error('Authentication verification failed.');
          setTimeout(() => navigate('/auth/login'), 3000);
        }
      } else {
        setErrorMsg('Invalid OAuth response payload.');
        setTimeout(() => navigate('/auth/login'), 2500);
      }
    };

    processCallback();
  }, [searchParams, navigate, refreshUserData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060913] text-white p-6">
      <div className="glass-card rounded-3xl p-8 max-w-md w-full text-center border border-white/10 shadow-2xl relative overflow-hidden">
        {errorMsg ? (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-white">Authentication Failed</h2>
            <p className="text-sm text-slate-400 leading-relaxed">{errorMsg}</p>
            <p className="text-xs text-slate-500">Redirecting to login portal...</p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="w-16 h-16 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 animate-pulse">
              <ShieldCheck size={34} />
            </div>
            <h2 className="text-xl font-bold text-white">Authenticating Session</h2>
            <p className="text-sm text-slate-400">Verifying secure OAuth credentials and launching clinical portal...</p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full w-full animate-indeterminate" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage;
