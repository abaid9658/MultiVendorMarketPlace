import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FEATURES = [
  { icon: 'factory', label: 'Vendor Management' },
  { icon: 'request_quote', label: 'RFQ Automation' },
  { icon: 'compare_arrows', label: 'Bid Comparison' },
  { icon: 'analytics', label: 'Real-time Analytics' },
];

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
      {/* Left Panel — Brand Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary flex-col justify-between p-2xl overflow-hidden">
        {/* Mesh gradient backdrop */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-20 w-[420px] h-[420px] rounded-full bg-secondary/30 blur-[110px]" />
          <div className="absolute top-1/3 -right-24 w-[380px] h-[380px] rounded-full bg-tertiary/20 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[320px] h-[320px] rounded-full bg-secondary-fixed-dim/10 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        <div className="relative z-10 flex items-center gap-sm">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary-fixed-dim flex items-center justify-center shadow-glow-indigo">
            <span className="material-symbols-outlined text-white text-[22px]">hub</span>
          </div>
          <div>
            <h1 className="text-headline-sm text-white font-bold leading-none">VendorPro</h1>
            <p className="text-on-primary-container text-code-sm tracking-wide uppercase mt-0.5">Enterprise Portal</p>
          </div>
        </div>

        <div className="relative z-10">
          <span className="inline-flex items-center gap-xs text-on-secondary-fixed-variant bg-white/8 border border-white/10 px-sm py-xs rounded-full text-code-sm font-medium mb-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-subtle" />
            Trusted by procurement teams worldwide
          </span>
          <h2 className="text-headline-lg text-white font-extrabold leading-tight tracking-tight">
            Streamline your vendor relationships
            <span className="text-secondary-fixed-dim"> &amp; quotation workflows</span>
          </h2>
          <p className="text-on-primary-container text-body-lg mt-md max-w-md leading-relaxed">
            Manage vendors, automate RFQs, compare proposals side-by-side, and track procurement performance — all in one place.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-sm">
          {FEATURES.map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-sm bg-white/[0.06] border border-white/10 rounded-xl p-md backdrop-blur-sm hover:bg-white/[0.1] transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary-fixed-dim text-[18px]">{icon}</span>
              </div>
              <span className="text-white text-body-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-lg relative">
        <div className="w-full max-w-[400px] animate-fade-in">
          {/* Mobile brand */}
          <div className="lg:hidden mb-xl text-center">
            <div className="inline-flex items-center gap-xs mb-xs">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary to-secondary-fixed-dim flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[18px]">hub</span>
              </div>
              <h1 className="text-headline-sm font-bold text-primary">VendorPro</h1>
            </div>
            <p className="text-on-surface-variant text-body-sm">Enterprise Portal</p>
          </div>

          <div className="card !p-xl shadow-card">
            <h2 className="text-headline-md font-bold text-primary mb-xs tracking-tight">
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-body-md text-on-surface-variant mb-lg">
              {isRegister ? 'Join VendorPro to start managing vendors today.' : 'Please sign in to continue to your dashboard.'}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
              {isRegister && (
                <div>
                  <label className="text-label-md text-on-surface-variant block mb-xs">FULL NAME</label>
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
                <label className="text-label-md text-on-surface-variant block mb-xs">EMAIL ADDRESS</label>
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
                <div className="flex justify-between items-baseline mb-xs">
                  <label className="text-label-md text-on-surface-variant">PASSWORD</label>
                  {!isRegister && (
                    <button type="button" className="text-code-sm text-secondary font-semibold hover:underline">
                      Forgot password?
                    </button>
                  )}
                </div>
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
                className="btn-primary w-full justify-center gap-xs mt-sm !py-[11px] text-[13.5px]"
              >
                {loading ? (
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">{isRegister ? 'person_add' : 'login'}</span>
                )}
                {loading ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
              </button>
            </form>

            <p className="text-center text-body-sm text-on-surface-variant mt-lg">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
              {' '}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-secondary font-semibold hover:underline"
              >
                {isRegister ? 'Sign in' : 'Create one'}
              </button>
            </p>
          </div>

          <p className="text-center text-code-sm text-outline mt-lg flex items-center justify-center gap-xs">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            VendorPro Enterprise © {new Date().getFullYear()} · Secure &amp; Encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;