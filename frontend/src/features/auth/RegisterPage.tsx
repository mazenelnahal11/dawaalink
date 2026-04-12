import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../../api/auth';

export default function RegisterPage() {
  const [form, setForm] = useState({
    pharmacyName: '',
    district: '',
    ownerName: '',
    commercialRegNo: '',
    pharmacistContact: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerUser(form);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center animate-fade-in">
          <div className="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary text-4xl">check_circle</span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight mb-3">Registration Successful!</h1>
          <p className="text-on-surface-variant font-body mb-8">
            Your pharmacy account has been created. You can now sign in to start listing your dead stock.
          </p>
          <Link
            to="/login"
            className="inline-block bg-primary text-on-primary px-8 py-3.5 rounded-xl font-bold text-sm shadow-primary-sm hover:shadow-primary active:scale-95 transition-all"
          >
            Continue to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-fixed opacity-20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-primary-sm">
            <span className="material-symbols-outlined text-on-primary text-3xl">local_pharmacy</span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">Request Access</h1>
          <p className="text-on-surface-variant mt-2 font-body">Register your pharmacy on DawaaLink</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-8 rounded-2xl shadow-card border border-outline-variant/15 space-y-5">
          {error && (
            <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[18px]">error</span>
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2 font-body">Pharmacy Name</label>
              <input
                required value={form.pharmacyName} onChange={(e) => set('pharmacyName', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all font-body bg-surface-container-lowest"
                placeholder="Al-Shefa Pharmacy"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2 font-body">District</label>
              <input
                required value={form.district} onChange={(e) => set('district', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all font-body bg-surface-container-lowest"
                placeholder="Zamalek"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-2 font-body">Owner Name</label>
            <input
              required value={form.ownerName} onChange={(e) => set('ownerName', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all font-body bg-surface-container-lowest"
              placeholder="Dr. Ahmed Hassan"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2 font-body">Commercial Reg. No.</label>
              <input
                required value={form.commercialRegNo} onChange={(e) => set('commercialRegNo', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all font-mono bg-surface-container-lowest"
                placeholder="CR-123456"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2 font-body">Pharmacist Contact</label>
              <input
                required value={form.pharmacistContact} onChange={(e) => set('pharmacistContact', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all font-body bg-surface-container-lowest"
                placeholder="+20 1XX XXX XXXX"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-2 font-body">Email Address</label>
            <input
              type="email" required value={form.email} onChange={(e) => set('email', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all font-body bg-surface-container-lowest"
              placeholder="admin@alshefa.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-2 font-body">Password</label>
            <input
              type="password" required minLength={6} value={form.password} onChange={(e) => set('password', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all font-body bg-surface-container-lowest"
              placeholder="Min. 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold text-sm shadow-primary-sm hover:shadow-primary active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
            {loading ? 'Registering...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-on-surface-variant font-body">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
