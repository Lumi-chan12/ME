import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Heart, Shield } from 'lucide-react';
import BackgroundEffects from '../components/BackgroundEffects';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden">
      <BackgroundEffects />

      {/* Floating medical icons */}
      <motion.div
        className="absolute top-[15%] left-[10%]"
        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Heart className="w-8 h-8 text-cyan-400/20" />
      </motion.div>
      <motion.div
        className="absolute top-[25%] right-[15%]"
        animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Activity className="w-10 h-10 text-teal-400/20" />
      </motion.div>
      <motion.div
        className="absolute bottom-[20%] left-[20%]"
        animate={{ y: [-8, 12, -8] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Shield className="w-7 h-7 text-cyan-400/15" />
      </motion.div>

      {/* Logo */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Logo icon */}
        <motion.div
          className="relative mb-6"
          animate={{
            boxShadow: [
              '0 0 20px rgba(0,240,255,0.3)',
              '0 0 40px rgba(0,240,255,0.5)',
              '0 0 20px rgba(0,240,255,0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-teal-400/20 border border-cyan-400/30 flex items-center justify-center backdrop-blur-xl">
            <Activity className="w-10 h-10 text-neon-cyan" />
          </div>
        </motion.div>

        {/* App name */}
        <motion.h1
          className="text-4xl font-bold font-display tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="neon-text text-neon-cyan">Nurse</span>
          <span className="text-white">Flow</span>
          <span className="neon-text text-neon-cyan"> AI</span>
        </motion.h1>

        <motion.p
          className="mt-3 text-sm text-white/40 font-body tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Smart Hospital Workflow Intelligence
        </motion.p>
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        className="absolute bottom-16 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-neon-cyan/60"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">Initializing</p>
      </motion.div>
    </div>
  );
}
