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
    <header className="fixed top-0 right-0 h-[68px] left-[272px] bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-lg z-40">
      {/* Search */}
      <div className="flex items-center gap-lg flex-1">
        <div className="relative w-full max-w-[380px] group">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[19px] group-focus-within:text-secondary transition-colors">
            search
          </span>
          <input
            type="text"
            value={searchValue || ''}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-full pl-[42px] pr-[68px] py-[9px] text-body-sm focus:outline-none focus:border-secondary focus:ring-[3.5px] focus:ring-secondary/10 focus:bg-white transition-all placeholder:text-outline"
            placeholder="Search vendors, quotes..."
          />
          <kbd className="hidden sm:flex absolute right-[10px] top-1/2 -translate-y-1/2 items-center gap-0.5 text-[10px] font-mono text-outline bg-surface-container-high border border-outline-variant rounded-md px-[6px] py-[2px]">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-md">
        <div className="flex gap-1">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-[9px] text-on-surface-variant hover:text-secondary transition-colors rounded-xl hover:bg-secondary-container/60"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            <span className="material-symbols-outlined text-[21px]">
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          <button
            className="relative p-[9px] text-on-surface-variant hover:text-secondary transition-colors rounded-xl hover:bg-secondary-container/60"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[21px]">notifications</span>
            <span className="absolute top-[7px] right-[7px] w-[7px] h-[7px] bg-error rounded-full border-[1.5px] border-surface-container-lowest"></span>
          </button>
          <button
            className="p-[9px] text-on-surface-variant hover:text-secondary transition-colors rounded-xl hover:bg-secondary-container/60"
            title="Messages"
          >
            <span className="material-symbols-outlined text-[21px]">mail</span>
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