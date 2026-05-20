import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Patients from './pages/Patients';
import Alerts from './pages/Alerts';
import Chat from './pages/Chat';
import Profile from './pages/Profile';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Splash />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><MainLayout><Tasks /></MainLayout></ProtectedRoute>} />
      <Route path="/patients" element={<ProtectedRoute><MainLayout><Patients /></MainLayout></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><MainLayout><Alerts /></MainLayout></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><MainLayout><Chat /></MainLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
