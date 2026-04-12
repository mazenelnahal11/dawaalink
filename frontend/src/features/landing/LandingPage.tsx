import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen">
      {/* ─── Top Navigation ─── */}
      <nav className="flex justify-between items-center w-full px-8 py-4 sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-outline-variant/15">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">local_pharmacy</span>
          </div>
          <span className="text-lg font-bold text-on-surface font-headline tracking-tight">DawaaLink</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant font-label">
          <a className="hover:text-primary transition-colors" href="#how-it-works">How it works</a>
          <a className="hover:text-primary transition-colors" href="#stats">Trust & Safety</a>
          <a className="hover:text-primary transition-colors" href="#cta">Pharmacy Types</a>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-primary px-4 py-2 hover:bg-primary-fixed/30 rounded-xl transition-all">
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-semibold text-sm shadow-primary-sm hover:shadow-primary hover:bg-primary-container transition-all active:scale-95">
            Request Access
          </button>
        </div>
      </nav>

      <main>
        {/* ─── Hero Section ─── */}
        <section className="relative pt-20 pb-24 px-8 overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-fixed opacity-30 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary opacity-5 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="animate-fade-in">
              <span className="inline-block py-1.5 px-4 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold tracking-widest uppercase mb-6 font-label">
                The Clinical Curator
              </span>
              <h1 className="font-headline text-5xl lg:text-7xl font-extrabold text-on-surface leading-[1.08] mb-8 tracking-tight">
                Stop Losing Money on{' '}
                <span className="text-primary italic">Expired Stock</span>
              </h1>
              <p className="text-on-surface-variant text-lg lg:text-xl leading-relaxed mb-10 max-w-xl font-body">
                Convert your dead inventory into active assets. DawaaLink is the first clinical-grade barter system designed specifically for pharmacists to swap excess medication safely and cash-free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold text-lg shadow-primary-sm hover:shadow-primary hover:bg-primary-container transition-all flex items-center justify-center gap-2 group active:scale-95">
                  Request Access
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-surface-container-high text-on-surface px-8 py-4 rounded-xl font-bold text-lg hover:bg-surface-container-highest transition-all active:scale-95">
                  Sign In
                </button>
              </div>
            </div>

            {/* Hero Graphic */}
            <div className="relative animate-fade-in-delayed hidden lg:block">
              <div className="bg-surface-container-low rounded-[2rem] p-4 relative overflow-hidden shadow-card-hover">
                {/* Gradient placeholder illustration */}
                <div className="rounded-[1.5rem] w-full h-[460px] bg-gradient-to-br from-primary-fixed via-surface-container-high to-primary-fixed-dim flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-40 h-40 border-2 border-primary/30 rounded-2xl rotate-12" />
                    <div className="absolute bottom-20 right-16 w-32 h-32 border-2 border-primary/20 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 border border-primary/10 rounded-3xl rotate-45" />
                  </div>
                  <div className="text-center z-10">
                    <span className="material-symbols-outlined text-primary text-7xl mb-4 block opacity-80">swap_horiz</span>
                    <p className="text-primary font-headline font-extrabold text-2xl">Clinical Barter</p>
                    <p className="text-on-surface-variant text-sm mt-1 font-body">Algorithmically matched swaps</p>
                  </div>
                </div>

                {/* Floating Glass Metric */}
                <div className="absolute bottom-8 left-8 right-8 bg-surface-container-lowest/80 backdrop-blur-sm p-5 rounded-2xl border border-outline-variant/20 flex items-center justify-between shadow-card">
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 font-label">Active Swaps Today</p>
                    <p className="text-3xl font-bold text-primary font-headline">2,841</p>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-9 h-9 rounded-full bg-primary-fixed border-2 border-white flex items-center justify-center text-[10px] font-bold text-primary">A</div>
                    <div className="w-9 h-9 rounded-full bg-secondary-container border-2 border-white flex items-center justify-center text-[10px] font-bold text-on-secondary-container">M</div>
                    <div className="w-9 h-9 rounded-full bg-primary border-2 border-white flex items-center justify-center text-[10px] font-bold text-on-primary">+12</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── How it Works ─── */}
        <section id="how-it-works" className="py-20 px-8 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-label">Simple Process</span>
              <h2 className="font-headline text-3xl lg:text-4xl font-extrabold text-on-surface mt-3 tracking-tight">How DawaaLink Works</h2>
              <p className="text-on-surface-variant mt-3 max-w-xl mx-auto font-body">Three steps to transform dead inventory into value.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '01', icon: 'inventory_2', title: 'List your dead stock', desc: 'Upload items approaching expiry. Our system validates batch numbers and storage conditions automatically.' },
                { step: '02', icon: 'search_insights', title: 'Get matched instantly', desc: 'Our algorithmic engine scans the entire network to find pharmacies that need exactly what you have.' },
                { step: '03', icon: 'swap_horiz', title: 'Complete the swap', desc: 'Accept the match, confirm receipt, and both pharmacies recover value — completely cash-free.' },
              ].map((item) => (
                <div key={item.step} className="bg-surface-container-lowest p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all group">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[11px] font-extrabold text-primary/40 font-headline">{item.step}</span>
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-primary group-hover:text-on-primary transition-colors">{item.icon}</span>
                    </div>
                  </div>
                  <h3 className="text-on-surface font-bold text-lg font-headline mb-2">{item.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed font-body">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Stats ─── */}
        <section id="stats" className="py-16 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all border-l-4 border-primary">
                <p className="text-4xl font-extrabold text-primary font-headline mb-2">30+</p>
                <p className="text-on-surface font-semibold mb-1">Items expire monthly</p>
                <p className="text-on-surface-variant text-sm font-body">Average independent pharmacy loss on dead inventory per location.</p>
              </div>
              <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all border-l-4 border-primary">
                <p className="text-4xl font-extrabold text-primary font-headline mb-2">9/10</p>
                <p className="text-on-surface font-semibold mb-1">Pharmacies barter informally</p>
                <p className="text-on-surface-variant text-sm font-body">Unstructured swapping leads to lack of records and regulatory risk.</p>
              </div>
              <div className="bg-primary p-8 rounded-2xl shadow-primary transition-all text-on-primary">
                <p className="text-4xl font-extrabold font-headline mb-2">100%</p>
                <p className="font-semibold mb-1">Cash-free exchange</p>
                <p className="text-on-primary/80 text-sm font-body">Preserve your liquidity by trading what you have for what you need.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section id="cta" className="py-24 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-primary to-primary-container rounded-[2rem] p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white blur-[80px]" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white blur-[80px]" />
              </div>
              <h2 className="font-headline text-4xl lg:text-5xl font-extrabold text-on-primary mb-6 tracking-tight relative z-10">
                Ready to clear your dead stock?
              </h2>
              <p className="text-on-primary/80 text-lg lg:text-xl mb-10 max-w-2xl mx-auto font-body relative z-10">
                Join the clinical barter revolution and stop losing money today.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-primary px-12 py-4 rounded-xl font-bold text-lg hover:bg-primary-fixed transition-all shadow-xl active:scale-95 relative z-10">
                Request Access
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="w-full flex flex-col md:flex-row justify-between items-center px-12 py-10 border-t border-outline-variant/15 bg-surface-container-low">
        <div className="mb-6 md:mb-0">
          <p className="text-sm font-bold text-primary font-headline mb-1">DawaaLink</p>
          <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-label">© 2024 DawaaLink. Clinical Precision in Barter.</p>
        </div>
        <div className="flex gap-6 text-sm text-on-surface-variant font-label">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
