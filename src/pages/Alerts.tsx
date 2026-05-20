import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TriangleAlert as AlertTriangle, CircleAlert as AlertCircle, Info, Bell, Shield, Clock, Check, X, ChevronRight, Zap, Radio, MapPin, Users, Plus, Pill, SkipForward, RefreshCw, Calendar } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import MedicationAlerts from './MedicationAlerts';

type Severity = 'info' | 'warning' | 'urgent' | 'critical';
type Category = 'emergency' | 'medication' | 'task' | 'system' | 'patient';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: Severity;
  category: Category;
  time: string;
  isResolved: boolean;
  patient?: string;
  room?: string;
}

const severityConfig: Record<Severity, { icon: typeof AlertTriangle; color: string; bg: string; border: string; glow: string }> = {
  info: { icon: Info, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20', glow: '' },
  warning: { icon: AlertCircle, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', glow: '' },
  urgent: { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', glow: 'shadow-[0_0_10px_rgba(255,145,0,0.15)]' },
  critical: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', glow: 'shadow-[0_0_15px_rgba(255,23,68,0.2)]' },
};

const initialAlerts: Alert[] = [
  { id: '1', title: 'Code Blue - Room 412', message: 'Cardiac arrest alert. Patient Maria Garcia. Emergency response team dispatched.', severity: 'critical', category: 'emergency', time: '2 min ago', patient: 'Maria Garcia', room: '412-C', isResolved: false },
  { id: '2', title: 'Medication Overdue', message: 'IV Antibiotics for Sarah Mitchell (301-A) overdue by 30 minutes.', severity: 'urgent', category: 'medication', time: '8 min ago', patient: 'Sarah Mitchell', room: '301-A', isResolved: false },
  { id: '3', title: 'Vital Signs Alert', message: 'Elena Rodriguez - SpO2 dropped below 93%. Immediate assessment recommended.', severity: 'warning', category: 'patient', time: '15 min ago', patient: 'Elena Rodriguez', room: '310-B', isResolved: false },
  { id: '4', title: 'Shift Handover', message: 'Morning to evening shift handover in 45 minutes. Prepare reports.', severity: 'info', category: 'system', time: '30 min ago', isResolved: false },
  { id: '5', title: 'Lab Results Ready', message: 'CBC results for David Chen available. Review required.', severity: 'info', category: 'task', time: '1 hr ago', patient: 'David Chen', room: '108-A', isResolved: false },
  { id: '6', title: 'Fall Risk Alert', message: 'James Wilson attempted to get out of bed unassisted. Fall risk protocol activated.', severity: 'warning', category: 'patient', time: '1.5 hr ago', patient: 'James Wilson', room: '205-B', isResolved: true },
  { id: '7', title: 'Emergency Drill', message: 'Hospital-wide emergency drill scheduled for 14:00 today.', severity: 'info', category: 'system', time: '2 hr ago', isResolved: true },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemAnim = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function Alerts() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('active');
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [activeTab, setActiveTab] = useState<'alerts' | 'medications'>('alerts');

  const filtered = filter === 'all' ? alerts : filter === 'active' ? alerts.filter((a) => !a.isResolved) : alerts.filter((a) => a.isResolved);
  const criticalCount = alerts.filter((a) => a.severity === 'critical' && !a.isResolved).length;

  const resolveAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, isResolved: true } : a));
  };

  if (activeTab === 'medications') {
    return (
      <motion.div className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="px-4 pt-4 flex items-center gap-3 mb-4">
          <motion.button
            className="p-1.5 rounded-lg bg-white/5"
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab('alerts')}
          >
            <ChevronRight size={16} className="text-white/40 rotate-180" />
          </motion.button>
          <h1 className="text-xl font-bold font-display text-white/90">Medications</h1>
        </div>
        <MedicationAlerts />
      </motion.div>
    );
  }

  return (
    <motion.div className="px-4 pt-4 pb-4" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={itemAnim} className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold font-display text-white/90">Alert Center</h1>
          <p className="text-xs text-white/40 mt-0.5">{alerts.filter((a) => !a.isResolved).length} active alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            className="p-2.5 rounded-xl bg-cyan-400/10 border border-cyan-400/20"
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab('medications')}
          >
            <Pill size={16} className="text-neon-cyan" />
          </motion.button>
          <motion.button
            className="p-2.5 rounded-xl bg-red-400/10 border border-red-400/20"
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowBroadcast(true)}
          >
            <Radio size={16} className="text-neon-red" />
          </motion.button>
        </div>
      </motion.div>

      {/* Critical Alert Banner */}
      {criticalCount > 0 && (
        <motion.div variants={itemAnim}>
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-400/30 animate-emergency-pulse">
            <div className="flex items-center gap-2 mb-1">
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                <AlertTriangle size={16} className="text-neon-red" />
              </motion.div>
              <span className="text-sm font-semibold text-red-400 neon-text-red">
                {criticalCount} Critical Alert{criticalCount > 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-[10px] text-red-400/60">Immediate attention required</p>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div variants={itemAnim} className="flex gap-2 mb-4">
        {(['all', 'active', 'resolved'] as const).map((f) => (
          <motion.button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              px-3 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all
              ${filter === f
                ? 'bg-cyan-400/15 border border-cyan-400/30 text-cyan-400'
                : 'bg-white/5 border border-white/10 text-white/40'
              }
            `}
            whileTap={{ scale: 0.95 }}
          >
            {f}
          </motion.button>
        ))}
      </motion.div>

      {/* Alert List */}
      <motion.div variants={itemAnim} className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {filtered.map((alert) => {
            const config = severityConfig[alert.severity];
            const Icon = config.icon;
            const isCritical = alert.severity === 'critical' && !alert.isResolved;

            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, x: 50 }}
                transition={{ duration: 0.2 }}
              >
                <GlassCard
                  className={`p-3.5 ${alert.isResolved ? 'opacity-50' : ''} ${config.glow}`}
                  neon={isCritical}
                  neonRed={isCritical}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${config.bg} border ${config.border} ${isCritical ? 'animate-pulse-glow' : ''}`}>
                      <Icon size={14} className={config.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`text-sm font-medium ${alert.isResolved ? 'text-white/40' : 'text-white/85'}`}>
                          {alert.title}
                        </p>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full uppercase font-bold ${config.bg} ${config.color}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/40 leading-relaxed">{alert.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-white/25">
                          <Clock size={9} />
                          <span className="text-[9px]">{alert.time}</span>
                        </div>
                        {alert.room && (
                          <div className="flex items-center gap-1 text-white/25">
                            <MapPin size={9} />
                            <span className="text-[9px]">{alert.room}</span>
                          </div>
                        )}
                        <span className="text-[9px] text-white/20 uppercase">{alert.category}</span>
                      </div>
                    </div>
                    {!alert.isResolved && (
                      <motion.button
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10"
                        onClick={() => resolveAlert(alert.id)}
                        whileTap={{ scale: 0.85 }}
                      >
                        <Check size={12} className="text-white/30" />
                      </motion.button>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Emergency Broadcast Modal */}
      <AnimatePresence>
        {showBroadcast && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBroadcast(false)} />
            <motion.div
              className="relative w-full max-w-md mx-3 mb-20 glass-card-strong p-5 border-red-400/30"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Radio size={16} className="text-neon-red" />
                <h3 className="text-base font-semibold text-red-400">Emergency Broadcast</h3>
              </div>
              <div className="space-y-3">
                <input
                  className="w-full bg-white/5 border border-red-400/20 rounded-xl px-3 py-2.5 text-sm text-white/90 placeholder-white/20 outline-none focus:border-red-400/40 transition-colors"
                  placeholder="Alert title"
                />
                <textarea
                  className="w-full bg-white/5 border border-red-400/20 rounded-xl px-3 py-2.5 text-sm text-white/90 placeholder-white/20 outline-none focus:border-red-400/40 transition-colors resize-none"
                  placeholder="Emergency details..."
                  rows={3}
                />
                <div className="flex gap-2">
                  {(['warning', 'urgent', 'critical'] as Severity[]).slice(1).map((s) => (
                    <button
                      key={s}
                      className={`flex-1 text-[10px] py-1.5 rounded-lg border ${severityConfig[s].bg} ${severityConfig[s].border} ${severityConfig[s].color} capitalize`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <NeonButton variant="danger" fullWidth onClick={() => setShowBroadcast(false)}>
                  Broadcast Alert
                </NeonButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
