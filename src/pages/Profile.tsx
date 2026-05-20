import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Bell, Moon, Palette, LogOut, ChevronRight, Clock, Building2, Award, ChartBar as BarChart3, Activity, FingerprintPattern as Fingerprint, Settings, Stethoscope, Zap, Star, TrendingUp, SquareCheck as CheckSquare } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const settingsSections = [
  {
    title: 'Work',
    items: [
      { icon: Clock, label: 'Shift Preferences', value: 'Morning', color: 'text-cyan-400' },
      { icon: Building2, label: 'Department', value: 'ICU', color: 'text-teal-400' },
      { icon: Stethoscope, label: 'Hospital', value: 'Metro General', color: 'text-cyan-400' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications', value: 'On', color: 'text-cyan-400' },
      { icon: Moon, label: 'Dark Mode', value: 'On', color: 'text-teal-400' },
      { icon: Palette, label: 'Theme', value: 'Cyber', color: 'text-cyan-400' },
    ],
  },
  {
    title: 'Security',
    items: [
      { icon: Fingerprint, label: 'Biometric Login', value: 'On', color: 'text-cyan-400' },
      { icon: Shield, label: 'Two-Factor Auth', value: 'Off', color: 'text-orange-400' },
    ],
  },
];

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const productivityScore = 87;
  const tasksCompleted = 156;
  const streak = 12;

  return (
    <motion.div className="px-4 pt-4 pb-4" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold font-display text-white/90">Profile</h1>
        <motion.button className="p-2 rounded-lg bg-white/5" whileTap={{ scale: 0.9 }}>
          <Settings size={16} className="text-white/30" />
        </motion.button>
      </motion.div>

      {/* Holographic ID Card */}
      <motion.div variants={item}>
        <GlassCard strong className="p-5 mb-4 holographic-shimmer" neon>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-teal-400/20 border border-cyan-400/30 flex items-center justify-center">
                <span className="text-xl font-bold text-neon-cyan font-display">
                  {user?.email?.charAt(0).toUpperCase() || 'N'}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-neon-green/20 border border-neon-green/40 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-neon-green" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white/90 font-display">
                {user?.email?.split('@')[0] || 'Nurse User'}
              </h2>
              <p className="text-xs text-white/40">{user?.email || 'nurse@hospital.com'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 font-medium">
                  Registered Nurse
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-400 font-medium">
                  ICU
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2.5 rounded-xl bg-white/5">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp size={12} className="text-neon-cyan" />
                <span className="text-lg font-bold text-neon-cyan font-display">{productivityScore}%</span>
              </div>
              <p className="text-[9px] text-white/30">Productivity</p>
            </div>
            <div className="text-center p-2.5 rounded-xl bg-white/5">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckSquare size={12} className="text-teal-400" />
                <span className="text-lg font-bold text-teal-400 font-display">{tasksCompleted}</span>
              </div>
              <p className="text-[9px] text-white/30">Tasks Done</p>
            </div>
            <div className="text-center p-2.5 rounded-xl bg-white/5">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star size={12} className="text-orange-400" />
                <span className="text-lg font-bold text-orange-400 font-display">{streak}</span>
              </div>
              <p className="text-[9px] text-white/30">Day Streak</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Performance Analytics */}
      <motion.div variants={item}>
        <GlassCard className="p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={14} className="text-neon-cyan" />
            <span className="text-xs font-medium text-white/70">Performance</span>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Task Completion', value: 92, color: 'from-cyan-400 to-teal-400' },
              { label: 'Response Time', value: 85, color: 'from-teal-400 to-cyan-400' },
              { label: 'Patient Satisfaction', value: 78, color: 'from-cyan-400 to-teal-400' },
            ].map((metric) => (
              <div key={metric.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-white/50">{metric.label}</span>
                  <span className="text-[11px] text-white/70 font-medium">{metric.value}%</span>
                </div>
                <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${metric.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Settings Sections */}
      {settingsSections.map((section) => (
        <motion.div key={section.title} variants={item} className="mb-4">
          <h3 className="text-[10px] font-medium text-white/30 uppercase tracking-wider mb-2 px-1">
            {section.title}
          </h3>
          <GlassCard className="divide-y divide-white/5">
            {section.items.map((setting, i) => {
              const Icon = setting.icon;
              return (
                <motion.button
                  key={setting.label}
                  className="w-full flex items-center gap-3 px-4 py-3.5"
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={16} className={setting.color} />
                  <span className="flex-1 text-left text-sm text-white/70">{setting.label}</span>
                  <span className="text-xs text-white/30">{setting.value}</span>
                  <ChevronRight size={14} className="text-white/15" />
                </motion.button>
              );
            })}
          </GlassCard>
        </motion.div>
      ))}

      {/* AI Assistant */}
      <motion.div variants={item} className="mb-4">
        <GlassCard className="p-4 holographic-shimmer">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-neon-cyan" />
            <span className="text-xs font-medium text-white/70">AI Assistant</span>
          </div>
          <p className="text-[11px] text-white/40 mb-3">Enable voice commands and AI-powered workflow suggestions</p>
          <NeonButton fullWidth>Configure AI Settings</NeonButton>
        </GlassCard>
      </motion.div>

      {/* Logout */}
      <motion.div variants={item}>
        <NeonButton
          variant="danger"
          fullWidth
          onClick={() => setShowLogoutConfirm(true)}
        >
          <div className="flex items-center justify-center gap-2">
            <LogOut size={14} />
            Sign Out
          </div>
        </NeonButton>
      </motion.div>

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <motion.div
            className="relative glass-card-strong p-5 w-full max-w-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-base font-semibold text-white/90 mb-2">Sign Out?</h3>
            <p className="text-xs text-white/40 mb-4">You will need to sign in again to access your dashboard.</p>
            <div className="flex gap-2">
              <NeonButton variant="ghost" fullWidth onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </NeonButton>
              <NeonButton variant="danger" fullWidth onClick={handleSignOut}>
                Sign Out
              </NeonButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
