import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, SquareCheck as CheckSquare, Users, TriangleAlert as AlertTriangle, MessageCircle, User } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare },
  { path: '/patients', label: 'Patients', icon: Users },
  { path: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { path: '/chat', label: 'Chat', icon: MessageCircle },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function MainLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden gradient-bg">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-3 mb-3">
          <div className="glass-card-strong px-2 py-2 flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                    relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors
                    ${isActive ? 'text-neon-cyan' : 'text-white/30'}
                  `}
                  whileTap={{ scale: 0.9 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute inset-0 bg-cyan-400/10 rounded-xl border border-cyan-400/20"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon size={18} className="relative z-10" />
                  <span className="text-[9px] relative z-10 font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="absolute -top-0.5 w-1 h-1 rounded-full bg-neon-cyan"
                      layoutId="navDot"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
