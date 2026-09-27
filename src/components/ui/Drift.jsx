export function Drift({ children, className = '' }) {
  return (
    <div data-drift className={`drift ${className}`}>
      {children}
    </div>
  );
}
