import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SquareCheck as CheckSquare, Clock, CircleAlert as AlertCircle, Plus, ListFilter as Filter, Calendar, ChevronDown, Pill, Stethoscope, ClipboardCheck, Syringe, MoveHorizontal as MoreHorizontal, Check, Circle, Zap } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';

type Priority = 'low' | 'medium' | 'high' | 'critical';
type Status = 'pending' | 'in_progress' | 'completed';
type Category = 'medication' | 'care' | 'assessment' | 'procedure' | 'other';

interface Task {
  id: string;
  title: string;
  patient: string;
  room: string;
  priority: Priority;
  status: Status;
  category: Category;
  due: string;
  description: string;
}

const categoryIcons: Record<Category, typeof Pill> = {
  medication: Pill,
  care: ClipboardCheck,
  assessment: Stethoscope,
  procedure: Syringe,
  other: CheckSquare,
};

const priorityColors: Record<Priority, string> = {
  low: 'text-white/40 bg-white/5 border-white/10',
  medium: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  high: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  critical: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const statusIcons: Record<Status, typeof Circle> = {
  pending: Circle,
  in_progress: Clock,
  completed: Check,
};

const initialTasks: Task[] = [
  { id: '1', title: 'Administer IV Antibiotics', patient: 'Sarah Mitchell', room: '301-A', priority: 'high', status: 'pending', category: 'medication', due: '08:30', description: 'Ceftriaxone 1g IV' },
  { id: '2', title: 'Vital Signs Assessment', patient: 'Maria Garcia', room: '412-C', priority: 'critical', status: 'in_progress', category: 'assessment', due: '09:00', description: 'Full vitals check q4h' },
  { id: '3', title: 'Wound Dressing Change', patient: 'James Wilson', room: '205-B', priority: 'medium', status: 'pending', category: 'care', due: '10:00', description: 'Post-op dressing change' },
  { id: '4', title: 'Blood Draw - CBC', patient: 'David Chen', room: '108-A', priority: 'low', status: 'pending', category: 'procedure', due: '11:00', description: 'Routine blood work' },
  { id: '5', title: 'Pain Assessment', patient: 'Maria Garcia', room: '412-C', priority: 'high', status: 'pending', category: 'assessment', due: '09:30', description: 'Pain scale evaluation' },
  { id: '6', title: 'Medication Reconciliation', patient: 'Sarah Mitchell', room: '301-A', priority: 'medium', status: 'completed', category: 'medication', due: '07:30', description: 'Morning med review' },
  { id: '7', title: 'Patient Education - Diabetes', patient: 'James Wilson', room: '205-B', priority: 'low', status: 'pending', category: 'care', due: '14:00', description: 'Self-management training' },
  { id: '8', title: 'Pre-op Preparation', patient: 'David Chen', room: '108-A', priority: 'high', status: 'pending', category: 'procedure', due: '13:00', description: 'NPO after midnight prep' },
];

const filters: { label: string; value: Status | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'completed' },
];

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }));

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const progress = Math.round((completedCount / tasks.length) * 100);

  const toggleStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next: Record<Status, Status> = { pending: 'in_progress', in_progress: 'completed', completed: 'pending' };
        return { ...t, status: next[t.status] };
      })
    );
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div className="px-4 pt-4 pb-4" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold font-display text-white/90">Task Manager</h1>
          <p className="text-xs text-white/40 mt-0.5">{selectedDate}</p>
        </div>
        <motion.button
          className="p-2.5 rounded-xl bg-cyan-400/10 border border-cyan-400/20"
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} className="text-neon-cyan" />
        </motion.button>
      </motion.div>

      {/* Progress */}
      <motion.div variants={item}>
        <GlassCard className="p-4 mb-4" neon>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckSquare size={14} className="text-neon-cyan" />
              <span className="text-xs font-medium text-white/70">Daily Progress</span>
            </div>
            <span className="text-sm font-bold text-neon-cyan">{progress}%</span>
          </div>
          <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-white/30">{completedCount} of {tasks.length} completed</span>
            <div className="flex items-center gap-1">
              <Zap size={10} className="text-neon-cyan" />
              <span className="text-[10px] text-cyan-400/60">AI: 3 tasks recommended</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {filters.map((f) => (
          <motion.button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`
              px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all
              ${filter === f.value
                ? 'bg-cyan-400/15 border border-cyan-400/30 text-cyan-400'
                : 'bg-white/5 border border-white/10 text-white/40'
              }
            `}
            whileTap={{ scale: 0.95 }}
          >
            {f.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Task List */}
      <motion.div variants={item} className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => {
            const CategoryIcon = categoryIcons[task.category];
            const StatusIcon = statusIcons[task.status];
            const isCompleted = task.status === 'completed';

            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <GlassCard
                  className={`p-3.5 ${isCompleted ? 'opacity-60' : ''}`}
                  neon={task.priority === 'critical'}
                  neonRed={task.priority === 'critical'}
                >
                  <div className="flex items-start gap-3">
                    {/* Status toggle */}
                    <motion.button
                      className={`mt-0.5 p-1 rounded-lg border transition-colors ${
                        task.status === 'completed'
                          ? 'bg-neon-green/20 border-neon-green/40'
                          : task.status === 'in_progress'
                          ? 'bg-cyan-400/15 border-cyan-400/30'
                          : 'bg-white/5 border-white/15'
                      }`}
                      onClick={() => toggleStatus(task.id)}
                      whileTap={{ scale: 0.85 }}
                    >
                      <StatusIcon
                        size={12}
                        className={
                          task.status === 'completed' ? 'text-neon-green' :
                          task.status === 'in_progress' ? 'text-neon-cyan' : 'text-white/30'
                        }
                      />
                    </motion.button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CategoryIcon size={12} className="text-white/30" />
                        <span className={`text-[10px] uppercase tracking-wider text-white/30`}>
                          {task.category}
                        </span>
                      </div>
                      <p className={`text-sm font-medium ${isCompleted ? 'line-through text-white/40' : 'text-white/85'}`}>
                        {task.title}
                      </p>
                      <p className="text-[11px] text-white/40 mt-0.5">{task.patient} - Room {task.room}</p>
                      <p className="text-[10px] text-white/25 mt-0.5">{task.description}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                        <div className="flex items-center gap-1 text-white/25">
                          <Clock size={10} />
                          <span className="text-[10px]">{task.due}</span>
                        </div>
                      </div>
                    </div>

                    <motion.button className="p-1 text-white/20 hover:text-white/40" whileTap={{ scale: 0.9 }}>
                      <MoreHorizontal size={14} />
                    </motion.button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              className="relative w-full max-w-md mx-3 mb-20 glass-card-strong p-5"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <h3 className="text-base font-semibold text-white/90 mb-4">New Task</h3>
              <div className="space-y-3">
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/90 placeholder-white/20 outline-none focus:border-cyan-400/40 transition-colors"
                  placeholder="Task title"
                />
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/90 placeholder-white/20 outline-none focus:border-cyan-400/40 transition-colors"
                  placeholder="Patient name"
                />
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/90 placeholder-white/20 outline-none focus:border-cyan-400/40 transition-colors resize-none"
                  placeholder="Description"
                  rows={2}
                />
                <div className="flex gap-2">
                  {(['low', 'medium', 'high', 'critical'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      className={`flex-1 text-[10px] py-1.5 rounded-lg border ${priorityColors[p]} capitalize`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <NeonButton fullWidth onClick={() => setShowAddModal(false)}>
                  Create Task
                </NeonButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
