import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, Clock, TriangleAlert as AlertTriangle, Check, SkipForward, Circle as XCircle, Bell, Plus, Calendar, RefreshCw, ChevronRight, Shield, Info } from 'lucide-react';
import GlassCard from '../components/GlassCard';

interface Medication {
  id: string;
  patient: string;
  room: string;
  medicine: string;
  dosage: string;
  frequency: string;
  time: string;
  status: 'due' | 'overdue' | 'upcoming' | 'given' | 'skipped';
  interaction?: string;
  progress: number;
  totalDoses: number;
  givenDoses: number;
}

const medications: Medication[] = [
  { id: '1', patient: 'Sarah Mitchell', room: '301-A', medicine: 'Ceftriaxone', dosage: '1g IV', frequency: 'q12h', time: '08:30', status: 'overdue', progress: 60, totalDoses: 10, givenDoses: 6 },
  { id: '2', patient: 'Maria Garcia', room: '412-C', medicine: 'Azithromycin', dosage: '500mg PO', frequency: 'q24h', time: '09:00', status: 'due', interaction: 'May interact with Warfarin', progress: 40, totalDoses: 7, givenDoses: 3 },
  { id: '3', patient: 'James Wilson', room: '205-B', medicine: 'Metformin', dosage: '500mg PO', frequency: 'BID', time: '07:00', status: 'given', progress: 80, totalDoses: 14, givenDoses: 11 },
  { id: '4', patient: 'Elena Rodriguez', room: '310-B', medicine: 'Furosemide', dosage: '40mg IV', frequency: 'q8h', time: '10:00', status: 'upcoming', progress: 50, totalDoses: 12, givenDoses: 6 },
  { id: '5', patient: 'David Chen', room: '108-A', medicine: 'Enoxaparin', dosage: '40mg SC', frequency: 'q24h', time: '20:00', status: 'upcoming', progress: 20, totalDoses: 5, givenDoses: 1 },
  { id: '6', patient: 'Maria Garcia', room: '412-C', medicine: 'Albuterol', dosage: '2.5mg Neb', frequency: 'q4h PRN', time: '11:00', status: 'due', progress: 55, totalDoses: 8, givenDoses: 4 },
];

const statusConfig = {
  due: { color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20', label: 'Due Now' },
  overdue: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', label: 'Overdue' },
  upcoming: { color: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10', label: 'Upcoming' },
  given: { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', label: 'Given' },
  skipped: { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', label: 'Skipped' },
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function MedicationAlerts() {
  const [meds, setMeds] = useState(medications);
  const [filter, setFilter] = useState<'all' | 'due' | 'upcoming'>('all');

  const filtered = filter === 'all' ? meds : meds.filter((m) => m.status === filter || (filter === 'due' && m.status === 'overdue'));
  const dueCount = meds.filter((m) => m.status === 'due' || m.status === 'overdue').length;
  const overdueCount = meds.filter((m) => m.status === 'overdue').length;

  const markAs = (id: string, status: 'given' | 'skipped') => {
    setMeds((prev) => prev.map((m) => m.id === id ? { ...m, status } : m));
  };

  return (
    <motion.div className="px-4 pt-4 pb-4" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between mb-4">
        <p className="text-xs text-white/40">{dueCount} due now</p>
        <motion.button className="p-2.5 rounded-xl bg-cyan-400/10 border border-cyan-400/20" whileTap={{ scale: 0.9 }}>
          <Plus size={16} className="text-neon-cyan" />
        </motion.button>
      </motion.div>

      {/* Overdue Alert */}
      {overdueCount > 0 && (
        <motion.div variants={item}>
          <div className="mb-4 p-3 rounded-xl bg-red-400/10 border border-red-400/30 animate-emergency-pulse">
            <div className="flex items-center gap-2">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <AlertTriangle size={14} className="text-neon-red" />
              </motion.div>
              <span className="text-xs font-medium text-red-400">{overdueCount} medication{overdueCount > 1 ? 's' : ''} overdue</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Schedule Overview */}
      <motion.div variants={item}>
        <GlassCard className="p-4 mb-4" neon>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={14} className="text-neon-cyan" />
            <span className="text-xs font-medium text-white/70">Today's Schedule</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-lg font-bold text-neon-cyan">{meds.filter((m) => m.status === 'given').length}</p>
              <p className="text-[9px] text-white/30">Given</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-cyan-400">{dueCount}</p>
              <p className="text-[9px] text-white/30">Due</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white/40">{meds.filter((m) => m.status === 'upcoming').length}</p>
              <p className="text-[9px] text-white/30">Upcoming</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-orange-400">{meds.filter((m) => m.status === 'skipped').length}</p>
              <p className="text-[9px] text-white/30">Skipped</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="flex gap-2 mb-4">
        {(['all', 'due', 'upcoming'] as const).map((f) => (
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

      {/* Medication Cards */}
      <motion.div variants={item} className="space-y-2.5">
        {filtered.map((med) => {
          const config = statusConfig[med.status];
          const isActionable = med.status === 'due' || med.status === 'overdue';

          return (
            <GlassCard
              key={med.id}
              className="p-3.5"
              neon={med.status === 'overdue'}
              neonRed={med.status === 'overdue'}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${config.bg} border ${config.border}`}>
                  <Pill size={14} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-white/85">{med.medicine}</p>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full uppercase font-bold ${config.bg} ${config.color} border ${config.border}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/40">{med.dosage} | {med.frequency}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">{med.patient} - Room {med.room}</p>

                  {/* Drug interaction warning */}
                  {med.interaction && (
                    <div className="flex items-center gap-1.5 mt-2 p-2 rounded-lg bg-orange-400/5 border border-orange-400/15">
                      <Shield size={10} className="text-orange-400" />
                      <span className="text-[9px] text-orange-400/80">{med.interaction}</span>
                    </div>
                  )}

                  {/* Progress ring */}
                  <div className="flex items-center gap-3 mt-2.5">
                    <div className="flex-1">
                      <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className={`absolute inset-y-0 left-0 rounded-full ${
                            med.status === 'given' ? 'bg-green-400' :
                            med.status === 'overdue' ? 'bg-red-400' : 'bg-cyan-400'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${med.progress}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                      <p className="text-[9px] text-white/25 mt-1">{med.givenDoses}/{med.totalDoses} doses completed</p>
                    </div>
                    <div className="flex items-center gap-1 text-white/25">
                      <Clock size={9} />
                      <span className="text-[10px]">{med.time}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  {isActionable && (
                    <div className="flex gap-2 mt-3">
                      <motion.button
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-green-400/10 border border-green-400/20 text-green-400 text-[11px] font-medium"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => markAs(med.id, 'given')}
                      >
                        <Check size={12} />
                        Given
                      </motion.button>
                      <motion.button
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-white/40 text-[11px]"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => markAs(med.id, 'skipped')}
                      >
                        <SkipForward size={12} />
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </motion.div>

      {/* Refill Reminders */}
      <motion.div variants={item} className="mt-4">
        <GlassCard className="p-4 holographic-shimmer">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw size={14} className="text-neon-cyan" />
            <span className="text-xs font-medium text-white/70">Refill Reminders</span>
          </div>
          <div className="space-y-2">
            {[
              { med: 'Ceftriaxone 1g', daysLeft: 3 },
              { med: 'Azithromycin 500mg', daysLeft: 5 },
            ].map((r) => (
              <div key={r.med} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <div className="flex items-center gap-2">
                  <Pill size={10} className="text-white/30" />
                  <span className="text-[11px] text-white/50">{r.med}</span>
                </div>
                <span className={`text-[10px] font-medium ${r.daysLeft <= 3 ? 'text-orange-400' : 'text-white/30'}`}>
                  {r.daysLeft}d left
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
