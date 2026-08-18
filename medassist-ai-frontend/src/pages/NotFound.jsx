import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass } from 'lucide-react';
import Button from '../components/ui/Button';
import Logo from '../components/common/Logo';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-50 px-6 text-center">
      <Logo size="md" className="mb-10" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <p className="text-[120px] font-extrabold leading-none text-gradient-brand">404</p>
      </motion.div>
      <h1 className="mt-4 text-2xl font-bold text-ink-900">Page not found</h1>
      <p className="mt-2 max-w-md text-ink-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/dashboard">
          <Button variant="gradient">
            <Home className="h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
        <Link to="/symptom-checker">
          <Button variant="secondary">
            <Compass className="h-4 w-4" /> Symptom Checker
          </Button>
        </Link>
      </div>
    </div>
  );
}
