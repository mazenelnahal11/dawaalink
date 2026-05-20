import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyUser } from '../../api/auth';

export default function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // If no email is provided, they shouldn't be here
      navigate('/login');
    }
  }, [location, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await verifyUser({ email, code });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { replace: true, state: { message: 'Account verified successfully. You can now sign in.' } });
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid verification code. Please try again.');
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
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-primary-sm">
            <span className="material-symbols-outlined text-on-primary text-3xl">mark_email_read</span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">Verify Email</h1>
          <p className="text-on-surface-variant mt-2 font-body">We've sent a 6-digit code to <strong>{email}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-8 rounded-2xl shadow-card border border-outline-variant/15 space-y-5">
          {success ? (
             <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 border border-green-200">
               <span className="material-symbols-outlined text-[18px]">check_circle</span>
               Verification successful! Redirecting...
             </div>
          ) : (
            <>
              {error && (
                <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-[18px]">error</span>
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-on-surface mb-2 font-body">Verification Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-4 py-3 text-center tracking-[0.5em] text-xl rounded-xl border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body bg-surface-container-lowest uppercase"
                  placeholder="000000"
                />
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold text-sm shadow-primary-sm hover:shadow-primary active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                {loading ? 'Verifying...' : 'Verify Account'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
