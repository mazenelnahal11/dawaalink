import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../api/auth';
import { useAuthStore } from '../../store/AuthStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      login(
        {
          id: res.pharmacyId,
          pharmacyId: res.pharmacyId,
          pharmacyStatus: res.status as 'PENDING' | 'ACTIVE' | 'FLAGGED',
          name: email.split('@')[0],
          email,
          role: res.role as 'OWNER' | 'PHARMACIST' | 'EMPLOYEE' | 'ADMIN',
        },
        res.token,
      );
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-fixed opacity-20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary opacity-5 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-primary-sm">
            <span className="material-symbols-outlined text-on-primary text-3xl">local_pharmacy</span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">Welcome back</h1>
          <p className="text-on-surface-variant mt-2 font-body">Sign in to your DawaaLink account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-8 rounded-2xl shadow-card border border-outline-variant/15 space-y-5">
          {error && (
            <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[18px]">error</span>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-on-surface mb-2 font-body">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all font-body bg-surface-container-lowest"
              placeholder="you@pharmacy.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-2 font-body">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all font-body bg-surface-container-lowest"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold text-sm shadow-primary-sm hover:shadow-primary active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-on-surface-variant font-body">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">Request Access</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
