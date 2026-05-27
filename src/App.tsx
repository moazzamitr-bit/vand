import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Competitions from './pages/Competitions';
import InvitationCodes from './pages/InvitationCodes';
import OfficialMembers from './pages/OfficialMembers';
import Payments from './pages/Payments';
import Users from './pages/Users';
import ChangePassword from './pages/ChangePassword';

interface AuthState {
  email: string;
  role: string;
}

function getDisplayName(email: string): string {
  const parts = email.split('@')[0].replace(/[._]/g, ' ');
  return parts.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default function App() {
  const [auth, setAuth] = useState<AuthState | null>(null);

  const handleLogin = (email: string, role: string) => setAuth({ email, role });
  const handleLogout = () => setAuth(null);

  if (!auth) return <Login onLogin={handleLogin} />;

  const user = { name: getDisplayName(auth.email), role: auth.role };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout onLogout={handleLogout} user={user} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/invitation-codes" element={<InvitationCodes />} />
          <Route path="/official-members" element={<OfficialMembers />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/users" element={<Users />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
