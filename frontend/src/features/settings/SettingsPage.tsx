import React from 'react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline">Settings</h2>
        <p className="text-on-surface-variant mt-1 font-body">Configure system preferences and matching algorithms.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-card border border-surface-container overflow-hidden">
        <div className="p-6 border-b border-surface-container-low flex justify-between items-center">
           <div>
             <h4 className="font-bold font-headline">Auto-Accept Matches</h4>
             <p className="text-sm text-on-surface-variant font-body">Automatically accept incoming matches that meet threshold rules.</p>
           </div>
           <div className="w-12 h-6 bg-surface-container-high rounded-full relative">
             <div className="absolute left-1 top-1 w-4 h-4 bg-outline-variant rounded-full"></div>
           </div>
        </div>

        <div className="p-6 border-b border-surface-container-low">
           <h4 className="font-bold font-headline mb-4">Notification Preferences</h4>
           <div className="space-y-4">
             <label className="flex items-center gap-3">
               <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary" defaultChecked />
               <span className="text-sm font-body">Email on incoming matches</span>
             </label>
             <label className="flex items-center gap-3">
               <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary" defaultChecked />
               <span className="text-sm font-body">Email on pending receipt confirmations</span>
             </label>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
