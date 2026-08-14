import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Github, Twitter, Linkedin } from 'lucide-react';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Privacy', href: '#trust' },
    ],
  },
  {
    title: 'Portal',
    links: [
      { label: 'Sign In', href: '/signin' },
      { label: 'Patient Register', href: '/patient-register' },
      { label: 'Patient Dashboard', href: '/patient-dashboard' },
      { label: 'Settings', href: '/settings' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Data Processing', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  },
];

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

const LandingFooter = () => {
  const handleSmoothScroll = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.replace('#', '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="relative border-t border-white/8 pt-16 pb-8 px-4 overflow-hidden">
      {/* Subtle gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/40 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4 group" aria-label="MedAssist AI home">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <HeartPulse size={18} className="text-white" />
              </div>
              <span className="font-extrabold text-sm text-slate-100">MedAssist <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">AI</span></span>
            </Link>
            <p className="text-slate-500 text-xs leading-relaxed mb-5 max-w-[200px]">
              An AI-powered clinical diagnostics and health monitoring suite for informed patients.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold text-slate-200 tracking-widest uppercase mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="text-xs text-slate-500 hover:text-slate-200 transition-colors duration-200 font-medium"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        onClick={(e) => handleSmoothScroll(e, link.href)}
                        className="text-xs text-slate-500 hover:text-slate-200 transition-colors duration-200 font-medium"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-600 font-medium">
            © {new Date().getFullYear()} MedAssist AI. All rights reserved.
          </p>
          <p className="text-[11px] text-slate-600 text-center max-w-sm leading-relaxed">
            Not a licensed medical service. For informational & educational use only.
            Always consult a qualified physician for medical concerns.
          </p>
          <p className="text-[11px] text-slate-700 font-medium">
            v1.0.0-preview
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
