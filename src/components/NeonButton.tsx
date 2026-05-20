import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface NeonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'danger' | 'ghost';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
}

export default function NeonButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
  fullWidth = false,
}: NeonButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border-cyan-400/40 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]',
    danger: 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-400/40 text-red-400 shadow-[0_0_15px_rgba(255,23,68,0.2)]',
    ghost: 'bg-white/5 border-white/10 text-white/70',
  };

  const hoverVariants = {
    primary: { scale: 1.02, boxShadow: '0 0 25px rgba(0,240,255,0.4), 0 0 50px rgba(0,240,255,0.15)' },
    danger: { scale: 1.02, boxShadow: '0 0 25px rgba(255,23,68,0.4), 0 0 50px rgba(255,23,68,0.15)' },
    ghost: { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' },
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-6 py-3 rounded-xl border font-medium text-sm
        backdrop-blur-md transition-colors
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      whileHover={disabled ? undefined : hoverVariants[variant]}
      whileTap={disabled ? undefined : { scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}
