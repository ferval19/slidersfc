export function Logo({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-sans text-lg font-extrabold tracking-tight uppercase ${className}`}
    >
      Sliders<span className="text-accent">FC</span>
    </span>
  );
}
