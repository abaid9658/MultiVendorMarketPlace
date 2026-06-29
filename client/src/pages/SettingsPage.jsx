import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [form, setForm] = useState({
    organizationName: '',
    contactEmail: '',
    contactNumber: '',
    address: '',
    currency: 'USD',
    taxRate: 5,
    enableEmailNotifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data.success) {
          setForm(res.data.data);
        }
      } catch {
        toast.error('Failed to load system settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/settings', form);
      if (res.data.success) {
        toast.success('Settings updated successfully');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    toast.success(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode enabled`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-md text-on-surface-variant">
          <span className="material-symbols-outlined text-[44px] animate-spin text-secondary">progress_activity</span>
          <p className="text-body-md">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg animate-fade-in max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-headline-md font-bold text-primary tracking-tight">System Settings</h2>
        <p className="text-body-md text-on-surface-variant mt-0.5">Manage organization settings and portal preferences.</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-lg">
        {/* Organization Information */}
        <div className="card flex flex-col gap-md">
          <h3 className="text-headline-sm font-semibold text-primary border-b border-outline-variant pb-md flex items-center gap-sm">
            <span className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-secondary text-[19px]">domain</span>
            </span>
            Organization Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div>
              <label className="text-label-md text-on-surface-variant block mb-xs">ORGANIZATION NAME</label>
              <input
                type="text"
                className="input-field"
                value={form.organizationName}
                onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                placeholder="VendorPro Ltd"
                required
              />
            </div>
            <div>
              <label className="text-label-md text-on-surface-variant block mb-xs">CONTACT EMAIL</label>
              <input
                type="email"
                className="input-field"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                placeholder="procurement@vendorpro.com"
                required
              />
            </div>
            <div>
              <label className="text-label-md text-on-surface-variant block mb-xs">CONTACT NUMBER</label>
              <input
                type="text"
                className="input-field"
                value={form.contactNumber}
                onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <label className="text-label-md text-on-surface-variant block mb-xs">CURRENCY</label>
              <select
                className="input-field"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-label-md text-on-surface-variant block mb-xs">CORPORATE ADDRESS</label>
            <input
              type="text"
              className="input-field"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="123 Procurement Blvd, Suite 400"
            />
          </div>
        </div>

        {/* Configuration settings */}
        <div className="card flex flex-col gap-md">
          <h3 className="text-headline-sm font-semibold text-primary border-b border-outline-variant pb-md flex items-center gap-sm">
            <span className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-secondary text-[19px]">tune</span>
            </span>
            System Configurations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div>
              <label className="text-label-md text-on-surface-variant block mb-xs">STANDARD TAX RATE (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="input-field"
                value={form.taxRate}
                onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })}
              />
            </div>

            <div className="flex items-center justify-between sm:pt-lg">
              <div>
                <p className="text-body-md font-semibold text-primary">Email Notifications</p>
                <p className="text-body-sm text-on-surface-variant">Send alerts on activity milestones</p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, enableEmailNotifications: !form.enableEmailNotifications })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${form.enableEmailNotifications ? 'bg-secondary' : 'bg-surface-container-highest'
                  }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${form.enableEmailNotifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Theme Preferences */}
        <div className="card flex flex-col gap-md">
          <h3 className="text-headline-sm font-semibold text-primary border-b border-outline-variant pb-md flex items-center gap-sm">
            <span className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-secondary text-[19px]">palette</span>
            </span>
            Appearance &amp; Branding
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-md font-semibold text-primary">Theme Mode</p>
              <p className="text-body-sm text-on-surface-variant">Switch between light and dark backgrounds</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="btn-secondary flex items-center gap-xs px-lg"
            >
              <span className="material-symbols-outlined text-[18px]">
                {theme === 'light' ? 'dark_mode' : 'light_mode'}
              </span>
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-sm justify-end">
          <button type="submit" disabled={saving} className="btn-primary px-xl py-sm flex items-center justify-center gap-xs">
            {saving ? (
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">save</span>
            )}
            {saving ? 'Saving preferences...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;