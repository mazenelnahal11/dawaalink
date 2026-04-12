import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFlaggedItems, unlockItem } from '../../api/admin';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { ErrorBanner } from '../../components/ErrorBanner';

export const AdminFlagsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [unlockTarget, setUnlockTarget] = useState<{ id: string, name: string } | null>(null);
  const [reason, setReason] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: flaggedItems, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminFlaggedItems'],
    queryFn: getFlaggedItems,
  });

  const unlockMutation = useMutation({
    mutationFn: () => unlockItem(unlockTarget!.id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFlaggedItems'] });
      setUnlockTarget(null);
      setReason("");
      setErrorMsg(null);
    },
    onError: () => setErrorMsg("Failed to unlock item. Ensure you have the proper administrative override privileges.")
  });

  const handleConfirmUnlock = () => {
    if (!reason.trim()) {
      setErrorMsg("You must provide an authorization reason to override a system flag.");
      return;
    }
    unlockMutation.mutate();
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-extrabold text-error tracking-tight font-headline flex items-center gap-2">
          <span className="material-symbols-outlined text-[32px]" data-icon="flag">flag</span>
          Flagged Items Requires Review
        </h2>
        <p className="text-on-surface-variant mt-1 font-body">System flags for controlled substances or suspicious listings that require administrative override.</p>
      </div>

      {errorMsg && <ErrorBanner message={errorMsg} onRetry={() => setErrorMsg(null)} />}
      {isError && !errorMsg && <ErrorBanner message="Failed to load flagged items. Check network connectivity." onRetry={() => refetch()} />}

      <div className="bg-surface-container-lowest rounded-2xl shadow-card border border-error-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead className="bg-error-container/20 text-[10px] font-label font-bold text-on-surface uppercase tracking-wider border-b border-surface-container">
              <tr>
                <th className="px-6 py-4">Flagged At</th>
                <th className="px-6 py-4">Medicine Item</th>
                <th className="px-6 py-4">Pharmacy</th>
                <th className="px-6 py-4">System Algorithm Reason</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-sm">
              {isLoading ? (
                <tr>
                   <td colSpan={5} className="p-6">
                     <div className="w-full h-12 bg-surface-container-high animate-pulse rounded-lg"></div>
                   </td>
                </tr>
              ) : flaggedItems && flaggedItems.length > 0 ? (
                flaggedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-error-container/10 transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs">{new Date(item.flaggedAt).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-error">{item.medicineName}</div>
                      <div className="text-[10px] text-on-surface-variant font-mono mt-0.5">Batch: {item.batchNumber}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold">{item.pharmacyName}</td>
                    <td className="px-6 py-4 text-on-surface font-mono text-xs">{item.reason}</td>
                    <td className="px-6 py-4 text-right">
                       <button 
                         onClick={() => setUnlockTarget({ id: item.itemId, name: item.medicineName })}
                         className="px-4 py-2 bg-surface-container text-on-surface font-bold text-xs rounded-xl hover:bg-primary hover:text-on-primary transition-all"
                       >
                         Review & Unlock
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-4 opacity-50" data-icon="verified_user">verified_user</span>
                    <h3 className="text-xl font-bold font-headline mb-2 text-on-surface">No Flags Detected</h3>
                    <p className="max-w-md mx-auto">The ecosystem is currently operating without security violations.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog 
        open={!!unlockTarget}
        title="Administrative Override"
        message={`You are about to unlock ${unlockTarget?.name}. This will bypass the system algorithm and push the inventory back into the active matching pool. Please provide your authorization reason for the audit trail.`}
        confirmLabel={unlockMutation.isPending ? 'Unlocking...' : 'Unlock Inventory'}
        onConfirm={handleConfirmUnlock}
        onCancel={() => { setUnlockTarget(null); setReason(""); setErrorMsg(null); }}
      />
      
      {/* Inject Reason Input inside the opened Dialog visually (hacky via fixed positioned div if required, but ideally ConfirmDialog takes children. Since it doesn't, we will overlay it.) */}
      {unlockTarget && (
         <div className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center">
            <div className="mt-8 relative z-[70] w-full max-w-sm ml-6 px-2 pointer-events-auto">
               <input 
                 type="text" 
                 placeholder="Authorization override reason..."
                 value={reason}
                 onChange={(e) => setReason(e.target.value)}
                 className="w-full px-4 py-2 rounded-lg border border-outline focus:border-primary outline-none font-body text-sm shadow-sm"
               />
            </div>
         </div>
      )}
    </div>
  );
};

export default AdminFlagsPage;
