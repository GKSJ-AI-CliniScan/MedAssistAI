import React, { forwardRef } from 'react';
import RippleButton from '../../../components/ui/RippleButton';

/**
 * Reusable styled input for Auth forms.
 * Handles error states, leading icon, and optional trailing element.
 */
export const AuthInput = forwardRef(({
  id,
  label,
  type = 'text',
  placeholder,
  icon: Icon,
  trailing,
  error,
  ...props
}, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label htmlFor={id} className="block text-xs font-semibold text-slate-300 tracking-wide">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
      )}
      <input
        id={id}
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`
          w-full bg-white/5 border rounded-xl py-3 text-sm text-slate-200 placeholder-slate-500
          outline-none transition-all duration-200 focus:bg-white/8
          ${Icon ? 'pl-10' : 'pl-4'}
          ${trailing ? 'pr-11' : 'pr-4'}
          ${error
            ? 'border-rose-500/60 focus:ring-1 focus:ring-rose-500/30'
            : 'border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20'
          }
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {trailing && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          {trailing}
        </div>
      )}
    </div>
    {error && (
      <p id={`${id}-error`} className="text-xs text-rose-400 font-medium" role="alert">
        {error}
      </p>
    )}
  </div>
));

/**
 * Reusable password strength meter.
 */
export const PasswordStrengthMeter = ({ password }) => {
  if (!password) return null;
  const checks = [
    password.length >= 6,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ['', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const barColors = ['', 'bg-rose-500', 'bg-amber-500', 'bg-cyan-500', 'bg-emerald-500'];
  const textColors = ['', 'text-rose-400', 'text-amber-400', 'text-cyan-400', 'text-emerald-400'];

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? barColors[score] : 'bg-white/10'}`}
          />
        ))}
      </div>
      {score > 0 && (
        <p className={`text-[10px] font-semibold ${textColors[score]}`}>
          {labels[score]}
        </p>
      )}
    </div>
  );
};

/**
 * Social OAuth buttons (Google + Microsoft).
 * Built with the premium RippleButton component.
 */
export const SocialAuthButtons = ({ onGoogle, onMicrosoft }) => (
  <div className="flex gap-3">
    <RippleButton
      type="button"
      onClick={onGoogle}
      variant="secondary"
      className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-200 border border-white/10 rounded-xl"
      aria-label="Sign in with Google"
    >
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
        <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
        <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
        <path fill="#4A90E2" d="M19.834192,20.9995801 C21.9752773,19.0373145 23.4545455,16.1459175 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013997 17.2662994,17.2118056 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
        <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
      </svg>
      Google
    </RippleButton>
    <RippleButton
      type="button"
      onClick={onMicrosoft}
      variant="secondary"
      className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-200 border border-white/10 rounded-xl"
      aria-label="Sign in with Microsoft"
    >
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
        <path fill="#F25022" d="M0 0h11.5v11.5H0z"/>
        <path fill="#7FBA00" d="M12.5 0H24v11.5H12.5z"/>
        <path fill="#00A4EF" d="M0 12.5h11.5V24H0z"/>
        <path fill="#FFB900" d="M12.5 12.5H24V24H12.5z"/>
      </svg>
      Microsoft
    </RippleButton>
  </div>
);

/**
 * "or continue with" divider.
 */
export const AuthDivider = ({ label = 'or continue with email' }) => (
  <div className="flex items-center gap-3">
    <div className="h-px flex-1 bg-white/8" />
    <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest whitespace-nowrap">
      {label}
    </span>
    <div className="h-px flex-1 bg-white/8" />
  </div>
);

export const AuthSubmitButton = ({ isLoading, label, variant = 'primary', className = '' }) => (
  <RippleButton
    type="submit"
    disabled={isLoading}
    isLoading={isLoading}
    variant={variant}
    className={`w-full py-3.5 text-sm font-bold rounded-xl ${className}`}
  >
    {label}
  </RippleButton>
);

/**
 * Mobile brand header (shown only below lg breakpoint).
 */
export const MobileBrand = () => (
  <div className="lg:hidden mb-8 flex items-center gap-2">
    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-extrabold text-sm text-white">
      MA
    </div>
    <span className="font-extrabold tracking-widest text-sm uppercase text-white">MedAssist AI</span>
  </div>
);
