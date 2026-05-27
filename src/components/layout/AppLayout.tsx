import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ToastContainer from '../ui/Toast';
import { useToast } from '../../hooks/useToast';
import { createContext, useContext } from 'react';
import type { ToastType } from '../ui/Toast';

interface ToastCtx {
  addToast: (msg: string, type?: ToastType) => void;
}
export const ToastContext = createContext<ToastCtx>({ addToast: () => {} });
export const useAppToast = () => useContext(ToastContext);

interface Props {
  onLogout: () => void;
  user: { name: string; role: string };
}

export default function AppLayout({ onLogout, user }: Props) {
  const { toasts, addToast, dismissToast } = useToast();

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="flex h-screen overflow-hidden bg-[#0f1117]">
        <Sidebar onLogout={onLogout} />
        <div className="flex flex-col flex-1 min-w-0">
          <TopBar user={user} />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}
