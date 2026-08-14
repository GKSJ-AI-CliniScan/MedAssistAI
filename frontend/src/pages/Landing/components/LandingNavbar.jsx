import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, HeartPulse, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import RippleButton from '../../../components/ui/RippleButton';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Privacy', href: '#trust' },
  { label: 'FAQ', href: '#faq' },
];

const LandingNavbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`
          fixed top-0 left-0 right-0 z-50 px-4 transition-all duration-300
          ${scrolled
            ? 'py-3 bg-slate-950/85 backdrop-blur-xl border-b border-white/8 shadow-glass-sm'
            : 'py-5 bg-transparent'
          }
        `}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="MedAssist AI Home">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-glow-primary group-hover:scale-110 transition-transform duration-200">
              <HeartPulse size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-sm tracking-wide text-slate-100">MedAssist</span>
              <span className="font-extrabold text-sm tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400"> AI</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/6 transition-all duration-200 tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl border border-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {isAuthenticated ? (
              <RippleButton
                variant="primary"
                className="hidden sm:flex px-5 py-2 text-xs font-bold"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </RippleButton>
            ) : (
              <>
                <Link to="/auth/login" className="hidden sm:inline-block">
                  <button className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                    Sign In
                  </button>
                </Link>
                <RippleButton variant="primary" className="px-5 py-2 text-xs font-bold" onClick={() => navigate('/auth/login')}>
                  Get Started
                </RippleButton>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl border border-white/10 transition-all focus:outline-none"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-slate-950/98 backdrop-blur-2xl border-l border-white/10 p-6 md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center">
                    <HeartPulse size={16} className="text-white" />
                  </div>
                  <span className="font-extrabold text-sm text-slate-100">MedAssist AI</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-slate-400 hover:text-white bg-white/5 p-2 rounded-xl"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Mobile links */}
              <nav className="space-y-1 mb-8" role="navigation" aria-label="Mobile Navigation">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/8 transition-all"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              {/* Mobile CTAs */}
              <div className="space-y-3 border-t border-white/10 pt-6">
                {isAuthenticated ? (
                  <RippleButton
                    variant="primary"
                    className="w-full py-3 text-sm font-bold"
                    onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}
                  >
                    Go to Dashboard
                  </RippleButton>
                ) : (
                  <>
                    <RippleButton variant="primary" className="w-full py-3 text-sm font-bold" onClick={() => { navigate('/auth/login'); setMobileOpen(false); }}>
                      Get Started Free
                    </RippleButton>
                    <RippleButton variant="outline" className="w-full py-3 text-sm font-bold" onClick={() => { navigate('/auth/login'); setMobileOpen(false); }}>
                      Sign In
                    </RippleButton>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingNavbar;
