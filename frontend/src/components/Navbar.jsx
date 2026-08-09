import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, Search, History, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analyze', icon: Search, label: 'Analyze' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const NavLinks = ({ onClick }) => (
    <>
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onClick}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-[rgba(0,212,255,0.15)] text-[#00d4ff]'
                : 'text-slate-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen bg-[#0d1526] border-r border-[rgba(255,255,255,0.06)] p-4 fixed left-0 top-0 z-40">
        <div className="flex items-center gap-2 px-2 mb-8 mt-2">
          <Shield size={24} className="text-[#00d4ff]" />
          <span className="font-bold text-white text-lg">ScamShield AI</span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          <NavLinks />
        </nav>
        <div className="border-t border-[rgba(255,255,255,0.06)] pt-4 mt-4">
          <div className="px-4 py-2 mb-2">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-slate-500 text-xs truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="btn-danger w-full justify-center text-sm py-2">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0d1526] border-b border-[rgba(255,255,255,0.06)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-[#00d4ff]" />
          <span className="font-bold text-white">ScamShield AI</span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-slate-400 hover:text-white p-1">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setOpen(false)}>
          <div className="absolute top-0 left-0 w-64 h-full bg-[#0d1526] p-4 pt-16" onClick={e => e.stopPropagation()}>
            <nav className="flex flex-col gap-1 mt-4">
              <NavLinks onClick={() => setOpen(false)} />
            </nav>
            <div className="border-t border-[rgba(255,255,255,0.06)] pt-4 mt-4">
              <button onClick={handleLogout} className="btn-danger w-full justify-center text-sm py-2">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
