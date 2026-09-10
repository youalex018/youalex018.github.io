import { useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';

export function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` }}>
      {children}
    </div>
  );
}
