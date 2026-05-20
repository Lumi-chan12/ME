import { motion } from 'framer-motion';
import { Activity, Users, SquareCheck as CheckSquare, TriangleAlert as AlertTriangle, Clock, TrendingUp, Heart, Thermometer, Wind, Droplets, Bed, Stethoscope, Calendar, ArrowUpRight, Zap } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const activityData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  value: Math.floor(20 + Math.random() * 40 + (i > 7 && i < 19 ? 30 : 0)),
}));

const stats = [
  { label: 'Patients', value: '24', icon: Users, color: 'cyan', trend: '+3' },
  { label: 'Tasks Done', value: '18', icon: CheckSquare, color: 'teal', trend: '+5' },
  { label: 'Alerts', value: '3', icon: AlertTriangle, color: 'red', trend: '-1' },
  { label: 'On Shift', value: '8', icon: Clock, color: 'cyan', trend: '0' },
];

const patients = [
  { name: 'Sarah Mitchell', room: '301-A', risk: 'stable', hr: 72, spo2: 98, temp: 36.8 },
  { name: 'James Wilson', room: '205-B', risk: 'warning', hr: 88, spo2: 94, temp: 37.5 },
  { name: 'Maria Garcia', room: '412-C', risk: 'critical', hr: 110, spo2: 91, temp: 38.2 },
  { name: 'David Chen', room: '108-A', risk: 'stable', hr: 68, spo2: 99, temp: 36.6 },
];

const shiftInfo = { type: 'Morning Shift', time: '07:00 - 15:00', progress: 62 };

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  return (
    <motion.div
      className="px-4 pt-4 pb-4 space-y-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-display text-white/90">
            Command Center
          </h1>
          <p className="text-xs text-white/40 mt-0.5">Smart Hospital Overview</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-neon-green animate-pulse-glow"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[10px] text-white/40 uppercase tracking-wider">Live</span>
        </div>
      </motion.div>

      {/* Shift Progress */}
      <motion.div variants={item}>
        <GlassCard className="p-4" neon>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-neon-cyan" />
              <span className="text-xs font-medium text-white/70">{shiftInfo.type}</span>
            </div>
            <span className="text-[10px] text-white/40">{shiftInfo.time}</span>
          </div>
          <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${shiftInfo.progress}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>
          <p className="text-[10px] text-white/30 mt-1.5">{shiftInfo.progress}% complete</p>
        </GlassCard>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isRed = stat.label === 'Alerts';
          return (
            <GlassCard key={stat.label} className="p-3.5" neon={isRed} neonRed={isRed}>
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${isRed ? 'bg-red-400/10' : 'bg-cyan-400/10'}`}>
                  <Icon size={14} className={isRed ? 'text-neon-red' : 'text-neon-cyan'} />
                </div>
                <span className={`text-[10px] font-medium flex items-center gap-0.5 ${
                  stat.trend.startsWith('+') ? 'text-neon-green' :
                  stat.trend.startsWith('-') ? 'text-neon-red' : 'text-white/30'
                }`}>
                  {stat.trend !== '0' && <ArrowUpRight size={10} />}
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-bold font-display mt-2 text-white/90">{stat.value}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{stat.label}</p>
            </GlassCard>
          );
        })}
      </motion.div>

      {/* Activity Chart */}
      <motion.div variants={item}>
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-neon-cyan" />
              <span className="text-xs font-medium text-white/70">Hospital Activity</span>
            </div>
            <span className="text-[10px] text-white/30">24h</span>
          </div>
          <div className="h-24 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00f0ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15,22,41,0.9)',
                    border: '1px solid rgba(0,240,255,0.2)',
                    borderRadius: '8px',
                    fontSize: '10px',
                    color: '#e0e6f0',
                  }}
                  labelFormatter={(v) => `${v}:00`}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#00f0ff"
                  strokeWidth={1.5}
                  fill="url(#activityGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>

      {/* AI Insights */}
      <motion.div variants={item}>
        <GlassCard className="p-4 holographic-shimmer">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-neon-cyan" />
            <span className="text-xs font-medium text-white/70">AI Insights</span>
          </div>
          <p className="text-xs text-white/50 leading-relaxed">
            Patient Maria Garcia (412-C) shows elevated vitals. Consider prioritizing assessment.
            Medication round for Ward 3 due in 45 minutes.
          </p>
        </GlassCard>
      </motion.div>

      {/* Patient Vitals Quick View */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-neon-cyan" />
            <span className="text-xs font-medium text-white/70">Live Patient Vitals</span>
          </div>
          <span className="text-[10px] text-cyan-400/50">View All</span>
        </div>
        <div className="space-y-2.5">
          {patients.map((patient) => (
            <GlassCard
              key={patient.room}
              className="p-3.5"
              neon={patient.risk === 'critical'}
              neonRed={patient.risk === 'critical'}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    patient.risk === 'critical' ? 'bg-red-400/15' :
                    patient.risk === 'warning' ? 'bg-orange-400/15' : 'bg-cyan-400/10'
                  }`}>
                    <Bed size={14} className={
                      patient.risk === 'critical' ? 'text-neon-red' :
                      patient.risk === 'warning' ? 'text-neon-orange' : 'text-neon-cyan'
                    } />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80">{patient.name}</p>
                    <p className="text-[10px] text-white/30">Room {patient.room}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  patient.risk === 'critical' ? 'bg-red-400/15 text-red-400' :
                  patient.risk === 'warning' ? 'bg-orange-400/15 text-orange-400' :
                  'bg-cyan-400/10 text-cyan-400'
                }`}>
                  {patient.risk}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Heart size={11} className={patient.hr > 100 ? 'text-red-400' : 'text-white/30'} />
                  <span className="text-[11px] text-white/60">{patient.hr} bpm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wind size={11} className={patient.spo2 < 95 ? 'text-orange-400' : 'text-white/30'} />
                  <span className="text-[11px] text-white/60">{patient.spo2}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Thermometer size={11} className={patient.temp > 37.5 ? 'text-orange-400' : 'text-white/30'} />
                  <span className="text-[11px] text-white/60">{patient.temp}°C</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>

      {/* Staff Overview */}
      <motion.div variants={item}>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Stethoscope size={14} className="text-neon-cyan" />
            <span className="text-xs font-medium text-white/70">Staff on Duty</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-navy-800 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 flex items-center justify-center"
                >
                  <span className="text-[9px] text-cyan-400 font-medium">
                    {['JD', 'SK', 'AM', 'LP', 'RT'][i]}
                  </span>
                </div>
              ))}
            </div>
            <span className="text-xs text-white/40">+3 more</span>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
