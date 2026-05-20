import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Heart, Thermometer, Wind, Droplets, ChevronRight, Bed, FileText, Activity, TriangleAlert as AlertTriangle, Clock, Pill, TrendingUp, X } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  room: string;
  bed: string;
  diagnosis: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  bloodType: string;
  admissionDate: string;
  attendingDoctor: string;
  hr: number;
  spo2: number;
  temp: number;
  bp: string;
  rr: number;
  medications: number;
  tasksPending: number;
}

const patients: Patient[] = [
  { id: '1', name: 'Sarah Mitchell', age: 45, gender: 'F', room: '301', bed: 'A', diagnosis: 'Post-op appendectomy', risk: 'low', bloodType: 'A+', admissionDate: 'May 15', attendingDoctor: 'Dr. Adams', hr: 72, spo2: 98, temp: 36.8, bp: '120/80', rr: 16, medications: 3, tasksPending: 2 },
  { id: '2', name: 'James Wilson', age: 62, gender: 'M', room: '205', bed: 'B', diagnosis: 'Type 2 Diabetes, Wound care', risk: 'medium', bloodType: 'O-', admissionDate: 'May 12', attendingDoctor: 'Dr. Chen', hr: 88, spo2: 94, temp: 37.5, bp: '145/92', rr: 20, medications: 5, tasksPending: 4 },
  { id: '3', name: 'Maria Garcia', age: 38, gender: 'F', room: '412', bed: 'C', diagnosis: 'Pneumonia, Acute', risk: 'critical', bloodType: 'B+', admissionDate: 'May 18', attendingDoctor: 'Dr. Patel', hr: 110, spo2: 91, temp: 38.2, bp: '100/65', rr: 28, medications: 7, tasksPending: 6 },
  { id: '4', name: 'David Chen', age: 55, gender: 'M', room: '108', bed: 'A', diagnosis: 'Pre-op knee replacement', risk: 'low', bloodType: 'AB+', admissionDate: 'May 19', attendingDoctor: 'Dr. Adams', hr: 68, spo2: 99, temp: 36.6, bp: '118/76', rr: 14, medications: 2, tasksPending: 1 },
  { id: '5', name: 'Elena Rodriguez', age: 71, gender: 'F', room: '310', bed: 'B', diagnosis: 'CHF exacerbation', risk: 'high', bloodType: 'A-', admissionDate: 'May 17', attendingDoctor: 'Dr. Patel', hr: 96, spo2: 93, temp: 37.1, bp: '160/100', rr: 22, medications: 6, tasksPending: 3 },
];

const generateVitalHistory = (base: number, variance: number) =>
  Array.from({ length: 12 }, (_, i) => ({
    time: `${i * 2}:00`,
    value: base + (Math.random() - 0.5) * variance,
  }));

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function Patients() {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.room.includes(search)
  );

  const riskColors = {
    low: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    medium: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    high: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    critical: 'text-red-400 bg-red-400/10 border-red-400/20',
  };

  return (
    <motion.div className="px-4 pt-4 pb-4" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold font-display text-white/90">Patients</h1>
          <p className="text-xs text-white/40 mt-0.5">{patients.length} active patients</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-400/10 border border-red-400/20">
            <AlertTriangle size={12} className="text-neon-red" />
            <span className="text-[10px] text-red-400 font-medium">
              {patients.filter((p) => p.risk === 'critical').length} Critical
            </span>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={item} className="mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white/90 placeholder-white/20 outline-none focus:border-cyan-400/40 transition-colors"
            placeholder="Search patients or rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Patient Cards */}
      <motion.div variants={item} className="space-y-2.5">
        {filtered.map((patient) => (
          <GlassCard
            key={patient.id}
            className="p-3.5"
            neon={patient.risk === 'critical'}
            neonRed={patient.risk === 'critical'}
            onClick={() => setSelectedPatient(patient)}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  patient.risk === 'critical' ? 'bg-red-400/15' :
                  patient.risk === 'high' ? 'bg-orange-400/15' : 'bg-cyan-400/10'
                }`}>
                  <Bed size={16} className={
                    patient.risk === 'critical' ? 'text-neon-red' :
                    patient.risk === 'high' ? 'text-neon-orange' : 'text-neon-cyan'
                  } />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/85">{patient.name}</p>
                  <p className="text-[10px] text-white/30">Room {patient.room}-{patient.bed} | {patient.diagnosis}</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-white/20" />
            </div>

            {/* Vitals row */}
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1">
                <Heart size={10} className={patient.hr > 100 ? 'text-red-400' : 'text-white/25'} />
                <span className="text-[10px] text-white/50">{patient.hr}</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind size={10} className={patient.spo2 < 95 ? 'text-orange-400' : 'text-white/25'} />
                <span className="text-[10px] text-white/50">{patient.spo2}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Thermometer size={10} className={patient.temp > 37.5 ? 'text-orange-400' : 'text-white/25'} />
                <span className="text-[10px] text-white/50">{patient.temp}°</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplets size={10} className="text-white/25" />
                <span className="text-[10px] text-white/50">{patient.bp}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2">
              <span className={`text-[9px] px-1.5 py-0.5 rounded border ${riskColors[patient.risk]}`}>
                {patient.risk}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/30">
                {patient.bloodType}
              </span>
              <div className="flex items-center gap-1 ml-auto">
                <Pill size={9} className="text-white/25" />
                <span className="text-[9px] text-white/30">{patient.medications} meds</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText size={9} className="text-white/25" />
                <span className="text-[9px] text-white/30">{patient.tasksPending} tasks</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </motion.div>

      {/* Patient Detail Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPatient(null)} />
            <motion.div
              className="relative w-full max-w-md mx-3 mb-20 glass-card-strong p-5 max-h-[80vh] overflow-y-auto"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-white/90">{selectedPatient.name}</h3>
                  <p className="text-[10px] text-white/40">Room {selectedPatient.room}-{selectedPatient.bed} | {selectedPatient.attendingDoctor}</p>
                </div>
                <motion.button
                  className="p-1.5 rounded-lg bg-white/5"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedPatient(null)}
                >
                  <X size={14} className="text-white/40" />
                </motion.button>
              </div>

              {/* Risk indicator */}
              <div className={`mb-4 p-3 rounded-xl border ${riskColors[selectedPatient.risk]}`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} />
                  <span className="text-xs font-medium capitalize">{selectedPatient.risk} Risk</span>
                </div>
                <p className="text-[10px] mt-1 opacity-60">{selectedPatient.diagnosis}</p>
              </div>

              {/* Vitals Grid */}
              <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Live Vitals</h4>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { icon: Heart, label: 'HR', value: `${selectedPatient.hr}`, unit: 'bpm', warn: selectedPatient.hr > 100 },
                  { icon: Wind, label: 'SpO2', value: `${selectedPatient.spo2}`, unit: '%', warn: selectedPatient.spo2 < 95 },
                  { icon: Thermometer, label: 'Temp', value: `${selectedPatient.temp}`, unit: '°C', warn: selectedPatient.temp > 37.5 },
                  { icon: Droplets, label: 'BP', value: selectedPatient.bp, unit: '', warn: false },
                  { icon: Activity, label: 'RR', value: `${selectedPatient.rr}`, unit: '/min', warn: selectedPatient.rr > 20 },
                  { icon: Clock, label: 'Admitted', value: selectedPatient.admissionDate, unit: '', warn: false },
                ].map((v) => {
                  const Icon = v.icon;
                  return (
                    <div key={v.label} className="p-2.5 rounded-xl bg-white/5 border border-white/8">
                      <div className="flex items-center gap-1 mb-1">
                        <Icon size={10} className={v.warn ? 'text-orange-400' : 'text-white/25'} />
                        <span className="text-[9px] text-white/30">{v.label}</span>
                      </div>
                      <p className={`text-sm font-bold ${v.warn ? 'text-orange-400' : 'text-white/80'}`}>
                        {v.value}
                        <span className="text-[9px] font-normal text-white/30 ml-0.5">{v.unit}</span>
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Heart Rate Chart */}
              <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Heart Rate Trend</h4>
              <div className="h-20 -mx-1 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateVitalHistory(selectedPatient.hr, 15)}>
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(15,22,41,0.9)',
                        border: '1px solid rgba(0,240,255,0.2)',
                        borderRadius: '8px',
                        fontSize: '10px',
                        color: '#e0e6f0',
                      }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#00f0ff" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* AI Summary */}
              <div className="p-3 rounded-xl holographic-shimmer border border-white/8">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <TrendingUp size={12} className="text-neon-cyan" />
                  <span className="text-[10px] font-medium text-cyan-400">AI Health Summary</span>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed">
                  Patient shows {selectedPatient.risk === 'critical' ? 'concerning' : 'stable'} trends.
                  {selectedPatient.hr > 100 && ' Elevated heart rate detected.'}
                  {selectedPatient.spo2 < 95 && ' Oxygen saturation below normal range.'}
                  {selectedPatient.temp > 37.5 && ' Temperature indicates low-grade fever.'}
                  Continue monitoring and follow care plan.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
