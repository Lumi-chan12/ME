import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, UserPlus, Stethoscope, UserCog, ClipboardList, Activity } from 'lucide-react';
import BackgroundEffects from '../components/BackgroundEffects';
import GlassCard from '../components/GlassCard';
import NeonInput from '../components/NeonInput';
import NeonButton from '../components/NeonButton';
import { useAuth } from '../hooks/useAuth';

const roles = [
  { id: 'nurse', label: 'Nurse', icon: UserPlus, color: 'cyan' },
  { id: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'teal' },
  { id: 'admin', label: 'Admin', icon: UserCog, color: 'cyan' },
  { id: 'staff', label: 'Staff', icon: ClipboardList, color: 'teal' },
] as const;

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('nurse');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, role);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center px-6 overflow-y-auto py-10">
      <BackgroundEffects />

      <motion.div
        className="relative z-10 w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-6"
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

        {/* Signup Card */}
        <GlassCard strong className="p-6">
          <h2 className="text-lg font-semibold text-white/90 mb-1">Create Account</h2>
          <p className="text-xs text-white/40 mb-5">Join the smart hospital ecosystem</p>

          {error && (
            <motion.div
              className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-400/30 text-red-400 text-xs"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* Role selection */}
          <div className="mb-5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">
              Select Role
            </label>
            <div className="grid grid-cols-4 gap-2">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <motion.button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`
                      flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all
                      ${isSelected
                        ? 'border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                        : 'border-white/10 bg-white/5 hover:bg-white/8'
                      }
                    `}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon
                      size={18}
                      className={isSelected ? 'text-neon-cyan' : 'text-white/30'}
                    />
                    <span className={`text-[10px] ${isSelected ? 'text-cyan-400' : 'text-white/40'}`}>
                      {r.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

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
              placeholder="Min 6 characters"
              icon={<Lock size={16} />}
              required
            />
            <NeonInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Repeat password"
              icon={<Lock size={16} />}
              required
            />

            <NeonButton type="submit" fullWidth disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </NeonButton>
          </form>
        </GlassCard>

        <motion.p
          className="mt-6 text-center text-xs text-white/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400/70 hover:text-cyan-400 transition-colors">
            Sign In
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
