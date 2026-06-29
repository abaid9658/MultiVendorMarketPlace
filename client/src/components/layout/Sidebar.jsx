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
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-surface-container-lowest border-r border-outline-variant flex flex-col p-lg overflow-y-auto z-50">
      {/* Brand */}
      <div className="mb-2xl">
        <h1 className="text-headline-sm font-bold text-primary">VendorPro</h1>
        <p className="text-label-md text-on-surface-variant/70">Enterprise Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-xs">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-md px-md py-sm rounded-lg transition-all text-body-md select-none cursor-pointer ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`
            }
          >
            <span className="material-symbols-outlined text-[22px]">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}

        <button
          onClick={onNewRFQ}
          className="mt-lg w-full bg-primary text-on-primary py-sm px-lg text-label-md rounded-lg hover:opacity-85 transition-opacity active:scale-[0.98] flex items-center justify-center gap-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New RFQ
        </button>
      </nav>

      {/* Bottom */}
      <div className="mt-auto pt-lg border-t border-outline-variant flex flex-col gap-xs">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-md px-md py-sm rounded-lg transition-colors text-body-md ${
              isActive ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">settings</span>
          <span>Settings</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-md px-md py-sm rounded-lg transition-colors text-body-md text-error hover:bg-error-container/30 w-full text-left"
        >
          <span className="material-symbols-outlined text-[22px]">logout</span>
          <span>Logout</span>
        </button>

        {/* User info */}
        <div className="mt-sm flex items-center gap-md p-sm bg-surface-container-low rounded-xl">
          <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-body-sm font-semibold text-primary truncate">{user?.name || 'Admin'}</p>
            <p className="text-code-sm text-outline truncate">{user?.role === 'admin' ? 'System Admin' : 'User'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
