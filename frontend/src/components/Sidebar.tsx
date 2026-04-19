import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FolderOpen, CheckSquare, LogOut } from 'lucide-react';
import useAuth from '../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menu = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/clients', icon: Users, label: 'Clientes' },
    { path: '/projects', icon: FolderOpen, label: 'Projetos' },
    { path: '/tasks', icon: CheckSquare, label: 'Tarefas' },
  ];

  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800 h-screen flex flex-col">
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl">💰</div>
          <h1 className="text-2xl font-bold tracking-tight">FreelaFlow</h1>
        </div>
      </div>

      <div className="flex-1 p-3">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl mb-1 transition-colors ${
                isActive ? 'bg-emerald-500 text-white' : 'hover:bg-zinc-800 text-zinc-300'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-sm font-bold">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">{user?.name}</p>
            <p className="text-xs text-zinc-500">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:bg-zinc-800 rounded-2xl mt-2"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
}