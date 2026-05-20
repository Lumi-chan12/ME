import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  strong?: boolean;
  neon?: boolean;
  neonRed?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  strong = false,
  neon = false,
  neonRed = false,
  hover = true,
  onClick,
}: GlassCardProps) {
  const baseClass = strong ? 'glass-card-strong' : 'glass-card';
  const neonClass = neon ? 'neon-border' : neonRed ? 'neon-border-red' : '';

  return (
    <motion.div
      className={`${baseClass} ${neonClass} ${className}`}
      whileHover={hover ? { scale: 1.01, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
