import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, FingerprintPattern as Fingerprint, Activity } from 'lucide-react';
import BackgroundEffects from '../components/BackgroundEffects';
import GlassCard from '../components/GlassCard';
import NeonInput from '../components/NeonInput';
import NeonButton from '../components/NeonButton';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center px-6 overflow-hidden">
      <BackgroundEffects />

      <motion.div
        className="relative z-10 w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-teal-400/20 border border-cyan-400/30 flex items-center justify-center">
            <Activity className="w-5 h-5 text-neon-cyan" />
          </div>
          <h1 className="text-2xl font-bold font-display">
            <span className="neon-text text-neon-cyan">Nurse</span>
            <span className="text-white">Flow</span>
            <span className="neon-text text-neon-cyan"> AI</span>
          </h1>
        </motion.div>

        {/* Login Card */}
        <GlassCard strong className="p-6">
          <h2 className="text-lg font-semibold text-white/90 mb-1">Welcome Back</h2>
          <p className="text-xs text-white/40 mb-6">Sign in to your healthcare dashboard</p>

          {error && (
            <motion.div
              className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-400/30 text-red-400 text-xs"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <NeonInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="your@email.com"
              icon={<Mail size={16} />}
              required
            />
            <NeonInput
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter password"
              icon={<Lock size={16} />}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  className={`w-4 h-4 rounded border transition-all ${
                    remember
                      ? 'bg-cyan-400/20 border-cyan-400/60'
                      : 'border-white/20 bg-white/5'
                  } flex items-center justify-center`}
                  onClick={() => setRemember(!remember)}
                >
                  {remember && <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />}
                </div>
                <span className="text-xs text-white/40">Remember me</span>
              </label>
              <button type="button" className="text-xs text-cyan-400/60 hover:text-cyan-400 transition-colors">
                Forgot Password?
              </button>
            </div>

            <NeonButton type="submit" fullWidth disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </NeonButton>
          </form>

          {/* Biometric login */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] text-white/30 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <motion.button
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/5 text-white/50 text-sm hover:bg-white/8 transition-colors"
            whileTap={{ scale: 0.97 }}
          >
            <Fingerprint size={18} className="text-cyan-400/60" />
            Biometric Login
          </motion.button>
        </GlassCard>

        {/* Sign up link */}
        <motion.p
          className="mt-6 text-center text-xs text-white/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Don't have an account?{' '}
          <Link to="/signup" className="text-cyan-400/70 hover:text-cyan-400 transition-colors">
            Create Account
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
