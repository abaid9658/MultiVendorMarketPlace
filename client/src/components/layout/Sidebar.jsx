import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'dashboard' },
  { to: '/vendors', label: 'Vendors', icon: 'factory' },
  { to: '/quotations', label: 'Quotations', icon: 'request_quote' },
  { to: '/comparison', label: 'Comparison', icon: 'compare_arrows' },
];

const Sidebar = ({ onNewRFQ }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[272px] bg-primary-container flex flex-col p-md overflow-y-auto z-50">
      {/* Brand */}
      <div className="mb-xl flex items-center gap-sm px-sm pt-sm">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary to-secondary-fixed-dim flex items-center justify-center shrink-0 shadow-glow-indigo">
          <span className="material-symbols-outlined text-white text-[19px]">hub</span>
        </div>
        <div className="overflow-hidden">
          <h1 className="text-body-lg font-bold text-white leading-none truncate">VendorPro</h1>
          <p className="text-[10px] tracking-wider uppercase text-on-primary-container/80 mt-0.5">Enterprise Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        <p className="text-[10px] tracking-[0.12em] uppercase text-on-primary-container/50 px-md mb-xs font-semibold">Workspace</p>
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `relative flex items-center gap-md px-md py-[10px] rounded-xl transition-all text-body-md select-none cursor-pointer ${isActive
                ? 'bg-white/[0.08] text-white font-semibold'
                : 'text-on-primary-container hover:bg-white/[0.05] hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="nav-active-bar" />}
                <span
                  className={`material-symbols-outlined text-[20px] ${isActive ? 'text-secondary-fixed-dim' : ''}`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 500" } : undefined}
                >
                  {icon}
                </span>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}

        <button
          onClick={onNewRFQ}
          className="mt-lg w-full bg-gradient-to-r from-secondary to-secondary-fixed-dim text-white py-[10px] px-lg text-label-md tracking-wide rounded-xl hover:shadow-glow-indigo hover:brightness-105 transition-all active:scale-[0.98] flex items-center justify-center gap-xs shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          New RFQ
        </button>
      </nav>

      {/* Bottom */}
      <div className="mt-auto pt-md border-t border-white/[0.08] flex flex-col gap-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-md px-md py-[10px] rounded-xl transition-colors text-body-md ${isActive ? 'bg-white/[0.08] text-white' : 'text-on-primary-container hover:bg-white/[0.05] hover:text-white'
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span>Settings</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-md px-md py-[10px] rounded-xl transition-colors text-body-md text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 w-full text-left"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Logout</span>
        </button>

        {/* User info */}
        <div className="mt-sm flex items-center gap-md p-sm bg-white/[0.05] rounded-xl border border-white/[0.06]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary-fixed to-secondary-fixed-dim text-on-secondary-fixed flex items-center justify-center font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-body-sm font-semibold text-white truncate">{user?.name || 'Admin'}</p>
            <p className="text-code-sm text-on-primary-container/70 truncate">{user?.role === 'admin' ? 'System Admin' : 'User'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;