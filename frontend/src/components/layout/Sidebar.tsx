import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore';

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const role = user?.role || 'OWNER'; // default for UI display given strict no dummy auth rule (must be addressed in routing)

  // Navigation Items map
  const renderNavItem = (path: string, icon: string, label: string) => (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 font-semibold text-sm transition-all duration-200 mt-1 font-label ` +
        (isActive
          ? 'text-primary border-r-4 border-primary bg-surface-container-high translate-x-1'
          : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high')
      }
    >
      <span className="material-symbols-outlined" data-icon={icon}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );

  return (
    <aside className="fixed left-0 top-0 h-screen flex flex-col py-6 px-4 bg-surface-dim border-r-0 z-50 w-64 transition-transform lg:translate-x-0">
      <div className="mb-10 px-2 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary shadow-primary-sm">
          <span className="material-symbols-outlined" data-icon="local_pharmacy">local_pharmacy</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary font-headline">DawaaLink</h1>
          <p className="text-[10px] font-bold tracking-widest text-primary/60 uppercase font-label">Clinical Barter</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {['OWNER', 'PHARMACIST'].includes(role) && renderNavItem('/dashboard', 'dashboard', 'Dashboard')}
        
        {/* All valid roles see inventory */}
        {renderNavItem('/inventory', 'inventory_2', 'My Dead Stock')}
        
        {['OWNER', 'PHARMACIST'].includes(role) && (
          <>
            {renderNavItem('/matches', 'handshake', 'Swap Matches')}
            {renderNavItem('/swaps/active', 'swap_calls', 'Active Swaps')}
            {renderNavItem('/swaps/history', 'history', 'Swap History')}
          </>
        )}

        {role === 'OWNER' && (
          <>
            <div className="pt-6 pb-2 px-4">
              <p className="text-[10px] font-bold text-outline uppercase tracking-tighter font-label">Pharmacy Management</p>
            </div>
            {renderNavItem('/profile', 'local_pharmacy', 'Pharmacy Profile')}
            {renderNavItem('/settings', 'settings', 'Settings')}
          </>
        )}

        {role === 'ADMIN' && (
          <>
            <div className="pt-6 pb-2 px-4">
              <p className="text-[10px] font-bold text-outline uppercase tracking-tighter font-label">System Admin</p>
            </div>
            {renderNavItem('/admin/flags', 'flag', 'Flagged Items')}
            {renderNavItem('/admin/approvals', 'verified_user', 'Pharmacy Approvals')}
            {renderNavItem('/admin/audit', 'manage_search', 'Audit Log')}
          </>
        )}
      </nav>

      {['OWNER', 'PHARMACIST', 'EMPLOYEE'].includes(role) && (
        <div className="mt-auto px-2">
          <button 
            onClick={() => navigate('/inventory/new')}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-on-primary rounded-xl font-bold shadow-primary-sm hover:shadow-primary transition-all active:scale-95"
          >
            <span className="material-symbols-outlined" data-icon="add">add</span>
            <span>{role === 'OWNER' ? 'Add Item' : 'Add Dead Stock Item'}</span>
          </button>
        </div>
      )}
    </aside>
  );
};
