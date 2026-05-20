import React, { useState, useRef } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { api } from '../../api';

export const ProfilePage: React.FC = () => {
  const { user, login, token } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, you'd upload to S3/Cloudinary and get a URL.
    // For this demo/fast dev, we'll convert to Base64 to show it works immediately.
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        await api.patch('/pharmacies/profile-image', { imageUrl: base64String });
        
        // Update local store
        if (user && token) {
           login({ ...user, profileImageUrl: base64String }, token);
        }
      } catch (err) {
        console.error("Failed to upload image", err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline">Pharmacy Profile</h2>
          <p className="text-on-surface-variant mt-1 font-body">Manage your pharmacy identity and licensing information.</p>
        </div>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-primary-fixed text-primary text-[10px] font-bold rounded-full uppercase tracking-tighter">License ID: {user?.pharmacyId.split('-')[0]}</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-card border border-surface-container space-y-8 relative overflow-hidden">
        {/* Profile Header Card */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 pb-8 border-b border-surface-container-low">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl border-4 border-primary-fixed/30 overflow-hidden bg-surface-container shadow-inner transition-all group-hover:border-primary">
               {user?.profileImageUrl ? (
                 <img src={user.profileImageUrl} alt="Pharmacy Profile" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-outline-variant">
                    <span className="material-symbols-outlined text-5xl" data-icon="store">store</span>
                 </div>
               )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-on-primary rounded-xl flex items-center justify-center shadow-primary hover:scale-110 transition-transform active:scale-95"
              disabled={uploading}
            >
              <span className="material-symbols-outlined text-sm">{uploading ? 'sync' : 'photo_camera'}</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
              <h3 className="text-3xl font-black font-headline text-on-surface tracking-tight">
                {user?.pharmacyName || 'Pharmacy Brand'}
              </h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full font-label tracking-widest uppercase border border-green-200">
                Active & Verified
              </span>
            </div>
            <p className="text-on-surface-variant font-body text-lg">Managed by <span className="font-bold text-on-surface">{user?.name}</span></p>
            
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
               <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded-xl text-on-surface-variant text-xs font-bold">
                 <span className="material-symbols-outlined text-sm" data-icon="location_on">location_on</span>
                 {user?.district || 'Location not set'}
               </div>
               <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded-xl text-on-surface-variant text-xs font-bold">
                 <span className="material-symbols-outlined text-sm" data-icon="mail">mail</span>
                 {user?.email}
               </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 font-body">
           <div className="space-y-2">
             <label className="block text-xs font-black text-outline uppercase tracking-widest ml-1">Assigned District</label>
             <div className="flex items-center justify-between w-full px-5 py-4 rounded-2xl border border-outline-variant/60 bg-surface-container-low text-on-surface-variant">
               <span className="font-bold">{user?.district || 'Unassigned'}</span>
               <span className="material-symbols-outlined text-sm opacity-40" data-icon="lock">lock</span>
             </div>
             <p className="text-[10px] text-on-surface-variant mt-1 px-1">Location is locked for regulatory and matching accuracy.</p>
           </div>

           <div className="space-y-2">
             <label className="block text-xs font-black text-outline uppercase tracking-widest ml-1">Registered Email</label>
             <input 
               type="email" 
               className="w-full px-5 py-4 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold" 
               defaultValue={user?.email} 
             />
           </div>
        </div>
        
        {/* Action Bar */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-xs text-on-surface-variant font-body">Last profile update: Today at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
           <button className="w-full md:w-auto bg-primary text-on-primary px-10 py-4 rounded-2xl font-black shadow-primary hover:shadow-primary-lg hover:-translate-y-0.5 active:scale-95 transition-all uppercase tracking-widest text-xs">
             Save Profile Changes
           </button>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute -bottom-10 -right-10 opacity-[0.02] pointer-events-none">
           <span className="material-symbols-outlined text-[200px]" data-icon="verified_user">verified_user</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
