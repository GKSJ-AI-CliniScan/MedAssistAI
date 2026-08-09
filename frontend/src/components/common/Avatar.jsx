import { initials } from '../../utils/helpers';

/**
 * Avatar — circular avatar with initials fallback.
 */
export default function Avatar({ name = '', src, size = 40, className, tone = 'brand' }) {
  const tones = {
    brand: 'gradient-brand',
    emerald: 'gradient-emerald',
    neutral: 'bg-ink-200 text-ink-600',
  };
  const dim = { width: size, height: size };
  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white ${tones[tone]} ${className || ''}`}
      style={dim}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span style={{ fontSize: size * 0.4 }}>{initials(name) || '?'}</span>
      )}
    </div>
  );
}
