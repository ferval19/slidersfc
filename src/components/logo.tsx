export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`display text-2xl leading-none ${className}`}>
      Sliders<span className="text-ink-user">FC</span>
    </span>
  );
}
