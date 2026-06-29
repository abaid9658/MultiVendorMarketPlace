import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TopBar = ({ searchValue, onSearch }) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    toast.success(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode enabled`);
  };

  return (
    <header className="fixed top-0 right-0 h-[64px] left-[280px] bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center px-lg z-40">
      {/* Search */}
      <div className="flex items-center gap-lg flex-1">
        <div className="relative w-full max-w-[400px]">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchValue || ''}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-full pl-[44px] pr-md py-[7px] text-body-md focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-outline"
            placeholder="Search vendors, quotes..."
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-lg">
        <div className="flex gap-xs">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-sm text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-container-high"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            <span className="material-symbols-outlined text-[22px]">
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          <button
            className="relative p-sm text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-container-high"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border border-surface-container-lowest"></span>
          </button>
          <button
            className="p-sm text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-container-high"
            title="Messages"
          >
            <span className="material-symbols-outlined text-[22px]">mail</span>
          </button>
        </div>

        <div className="h-7 w-px bg-outline-variant"></div>

        <button
          onClick={() => navigate('/quotations?new=true')}
          className="btn-primary flex items-center gap-xs"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          New RFQ
        </button>
      </div>
    </header>
  );
};

export default TopBar;
