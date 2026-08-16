import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, HeartPulse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Story', href: '#story' },
    { name: 'Expertise', href: '#expertise' },
    { name: 'Studios', href: '#studios' },
    { name: 'Feedback', href: '#feedback' },
  ];

  const handleNavClick = (href) => {
    setIsOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId) || document.querySelector(href);
    if (element) {
      setTimeout(() => {
        const navbarHeight = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = Math.max(0, elementPosition - navbarHeight);
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }, 50);
    }
  };

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#061426]/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#06B6D4]/20 border border-[#06B6D4]/30">
              <HeartPulse className="w-6 h-6 text-[#06B6D4] animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight">
                MedAssistAI
              </span>
              <p className="text-[10px] font-semibold text-[#06B6D4] uppercase tracking-widest -mt-1">
                AI-Powered Healthcare
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={handleGetStarted}
              className="px-6 py-2.5 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-[#06B6D4]/30 transition-all duration-300"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#061426]/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left text-lg font-medium text-white/70 hover:text-white py-2 transition-colors"
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={handleGetStarted}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-sm font-semibold rounded-lg mt-4"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
