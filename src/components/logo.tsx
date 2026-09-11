export function Logo({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-sans text-lg font-extrabold tracking-tight uppercase ${className}`}
    >
      Slider<span className="text-flare">XI</span>
    </span>
  );
}
