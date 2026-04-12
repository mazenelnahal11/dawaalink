import React, { useState } from 'react';
import { useAuthStore, logout } from '../../store/AuthStore';

export const TopHeader: React.FC = () => {
  const { user } = useAuthStore();
  const [showProfileDrop, setShowProfileDrop] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // mock state for WS notifications 
  const notifications = [
    { title: "New Match", time: "2 min ago", type: "sync_alt" }
  ];

  return (
    <header className="flex justify-between items-center w-full px-8 py-4 sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-outline-variant/20 h-16">
      <div className="flex items-center bg-surface-container-low px-4 py-2 rounded-full w-96 transition-all focus-within:bg-surface-container-lowest focus-within:ring-2 ring-primary/20">
        <span className="material-symbols-outlined text-outline" data-icon="search">search</span>
        <input 
          className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-outline-variant outline-none font-body" 
          placeholder="Search medicines or batches..." 
          type="text"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
          >
            <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute top-12 right-0 w-80 bg-surface-container-lowest shadow-card-hover rounded-2xl border border-outline-variant/30 flex flex-col overflow-hidden">
               <div className="p-4 border-b border-surface-container flex justify-between items-center bg-surface-container-low">
                 <h4 className="font-bold font-headline">Notifications</h4>
                 <button className="text-xs text-primary font-bold hover:underline font-label uppercase">Mark Read</button>
               </div>
               <div className="flex flex-col max-h-64 overflow-y-auto">
                 {notifications.map((n, i) => (
                    <div key={i} className="p-4 border-b border-surface-container hover:bg-surface-container flex gap-3 items-center">
                       <span className="material-symbols-outlined text-primary" data-icon={n.type}>{n.type}</span>
                       <div className="flex-1">
                         <p className="font-bold text-sm text-on-surface">{n.title}</p>
                         <p className="text-xs text-on-surface-variant">{n.time}</p>
                       </div>
                    </div>
                 ))}
               </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-outline-variant/30"></div>

        <div className="flex items-center gap-3 relative">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-on-surface leading-none font-headline">{user?.pharmacyName || 'Pharmacy Name'}</p>
            <p className="text-xs text-on-surface-variant font-body">{user?.district || 'District'}</p>
          </div>
          
          <button onClick={() => setShowProfileDrop(!showProfileDrop)} className="rounded-full focus:outline-none">
            <img 
              alt="Pharmacy manager profile picture" 
              className="w-10 h-10 rounded-full border-2 border-primary-fixed/40 object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrCR-5ck0arRNFMuKfYZGW69dWzjJh5NLKl6wg1YEK7GwwCWR1_VPhdzChAH6zsWt2yjuV2rYq3B_QhkMERDgUCLdRyX0wMiTxc_1ocVnaC06Hs85EgoMGxz-YkAdOZzlmX-8xtEsvxnMfjRqWcsSZjPm1qoYjch3dpO6CqVfl7_drArb3aRfMIZ-LM9tG1LvRFokoe-hIt0q7TK_CkpIv4z5Dqom8NEuoLDDzUXVBRbq3omEjGW87_4-By9ZDzdTDTP5Ji6qYGwpN"
            />
          </button>

          {showProfileDrop && (
            <div className="absolute top-12 right-0 w-48 bg-surface-container-lowest shadow-card-hover rounded-2xl border border-outline-variant/30 flex flex-col py-2">
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2 hover:bg-surface-container-low text-error font-bold font-body"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
