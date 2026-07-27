import React from 'react';
import { Link } from 'react-router-dom';
import RippleButton from '../../components/ui/RippleButton';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 bg-[#060913]">
      <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">404</h1>
      <h3 className="text-2xl font-bold">Clinical Record Not Found</h3>
      <p className="text-slate-400 max-w-md">The requested clinical node or health report could not be resolved in the systems registry.</p>
      <Link to="/dashboard">
        <RippleButton>Return to Dashboard</RippleButton>
      </Link>
    </div>
  );
};

export default NotFoundPage;
