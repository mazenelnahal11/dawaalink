import React from 'react';
import { useAuthStore } from '../../store/AuthStore';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="p-8 space-y-8 animate-in fade-in max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline">Pharmacy Profile</h2>
        <p className="text-on-surface-variant mt-1 font-body">Manage your pharmacy identity and licensing information.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-card border border-surface-container space-y-6">
        <div className="flex items-center gap-6 pb-6 border-b border-surface-container-low">
          <div className="w-24 h-24 rounded-full border-4 border-primary-fixed overflow-hidden bg-surface-container">
             <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrCR-5ck0arRNFMuKfYZGW69dWzjJh5NLKl6wg1YEK7GwwCWR1_VPhdzChAH6zsWt2yjuV2rYq3B_QhkMERDgUCLdRyX0wMiTxc_1ocVnaC06Hs85EgoMGxz-YkAdOZzlmX-8xtEsvxnMfjRqWcsSZjPm1qoYjch3dpO6CqVfl7_drArb3aRfMIZ-LM9tG1LvRFokoe-hIt0q7TK_CkpIv4z5Dqom8NEuoLDDzUXVBRbq3omEjGW87_4-By9ZDzdTDTP5Ji6qYGwpN" alt="Manager Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-headline">{user?.pharmacyName || 'Your Pharmacy'}</h3>
            <p className="text-on-surface-variant font-body">Owner: {user?.name}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full font-label tracking-wide uppercase">Verified License</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 font-body">
           <div>
             <label className="block text-sm font-bold text-on-surface mb-2">District</label>
             <input type="text" className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest focus:border-primary outline-none" defaultValue={user?.district} disabled />
             <p className="text-xs text-on-surface-variant mt-1">Location locked for matching algorithms.</p>
           </div>
           <div>
             <label className="block text-sm font-bold text-on-surface mb-2">Contact Email</label>
             <input type="email" className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 focus:border-primary outline-none" defaultValue={user?.email} />
           </div>
        </div>
        
        <div className="pt-4 flex justify-end">
           <button className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold shadow-primary-sm hover:shadow-primary transition-all">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
