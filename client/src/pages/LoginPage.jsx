import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return; }
    if (isRegister && !form.name) { toast.error('Name is required'); return; }

    setLoading(true);
    try {
      if (isRegister) {
        await register(form.name, form.email, form.password);
        toast.success('Account created! Welcome to VendorPro');
      } else {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-container flex-col justify-between p-2xl">
        <div>
          <h1 className="text-headline-lg text-on-primary font-bold text-white">VendorPro</h1>
          <p className="text-on-primary-container text-body-lg mt-xs">Enterprise Portal</p>
        </div>

        <div>
          <h2 className="text-headline-md text-white font-bold leading-tight">
            Streamline your<br />vendor relationships &<br />quotation workflows
          </h2>
          <p className="text-on-primary-container text-body-md mt-md opacity-80">
            Manage vendors, create quotations, compare proposals, and track procurement performance — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-md">
          {[
            { icon: 'factory', label: 'Vendor Management' },
            { icon: 'request_quote', label: 'RFQ Automation' },
            { icon: 'compare_arrows', label: 'Bid Comparison' },
            { icon: 'analytics', label: 'Real-time Analytics' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-sm bg-white/10 rounded-xl p-md">
              <span className="material-symbols-outlined text-white text-[20px]">{icon}</span>
              <span className="text-white text-body-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-lg">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile brand */}
          <div className="lg:hidden mb-xl text-center">
            <h1 className="text-headline-sm font-bold text-primary">VendorPro</h1>
            <p className="text-on-surface-variant text-body-sm">Enterprise Portal</p>
          </div>

          <div className="card shadow-sm">
            <h2 className="text-headline-sm font-bold text-primary mb-xs">
              {isRegister ? 'Create Account' : 'Sign In'}
            </h2>
            <p className="text-body-md text-on-surface-variant mb-lg">
              {isRegister ? 'Join VendorPro to manage your vendors' : 'Welcome back! Please sign in to continue'}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
              {isRegister && (
                <div>
                  <label className="text-label-md text-on-surface-variant block mb-xs">Full Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Alex Sterling"
                    autoComplete="name"
                  />
                </div>
              )}

              <div>
                <label className="text-label-md text-on-surface-variant block mb-xs">Email Address</label>
                <input
                  type="email"
                  className="input-field"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="text-label-md text-on-surface-variant block mb-xs">Password</label>
                <input
                  type="password"
                  className="input-field"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center justify-center gap-xs mt-sm"
              >
                {loading ? (
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">{isRegister ? 'person_add' : 'login'}</span>
                )}
                {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-body-sm text-on-surface-variant mt-lg">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
              {' '}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-secondary font-semibold hover:underline"
              >
                {isRegister ? 'Sign In' : 'Create one'}
              </button>
            </p>
          </div>

          <p className="text-center text-code-sm text-outline mt-lg">
            VendorPro Enterprise © {new Date().getFullYear()} · Secure & Encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
