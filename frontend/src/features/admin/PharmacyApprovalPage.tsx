import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPharmaciesByStatus, approvePharmacy } from '../../api/admin';
import type { PharmacyInfo } from '../../api/admin';
import { StatusChip } from '../../components/StatusChip';
import { ErrorBanner } from '../../components/ErrorBanner';

export const PharmacyApprovalPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: pendingPharmacies, isLoading, isError, refetch } = useQuery({
    queryKey: ['pendingPharmacies'],
    queryFn: () => getPharmaciesByStatus('PENDING'),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => approvePharmacy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingPharmacies'] });
    },
  });

  return (
    <div className="p-8 space-y-8 animate-in fade-in max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline flex items-center gap-2">
          <span className="material-symbols-outlined text-[32px] text-primary">verified_user</span>
          Pharmacy Approvals
        </h2>
        <p className="text-on-surface-variant mt-1 font-body">Review and authorize new pharmacy registrations.</p>
      </div>

      {isError && <ErrorBanner message="Failed to load pending pharmacies." onRetry={() => refetch()} />}

      <div className="bg-surface-container-lowest rounded-2xl shadow-card border border-outline-variant/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead className="bg-surface-container-low text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/10">
              <tr>
                <th className="px-6 py-4">Pharmacy Name</th>
                <th className="px-6 py-4">Commercial Reg #</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-sm">
              {isLoading ? (
                <tr>
                   <td colSpan={5} className="p-12 text-center">
                     <div className="flex justify-center">
                        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
                     </div>
                   </td>
                </tr>
              ) : Array.isArray(pendingPharmacies) && pendingPharmacies.length > 0 ? (
                pendingPharmacies.map((pharmacy: PharmacyInfo) => (
                  <tr key={pharmacy.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-5 font-bold text-on-surface">{pharmacy.commercialName}</td>
                    <td className="px-6 py-5 font-mono text-xs">{pharmacy.taxId}</td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-semibold">{pharmacy.district}</div>
                      <div className="text-[11px] text-on-surface-variant">{pharmacy.address}</div>
                    </td>
                    <td className="px-6 py-5">
                      <StatusChip status="PENDING" />
                    </td>
                    <td className="px-6 py-5 text-right">
                       <button 
                         onClick={() => approveMutation.mutate(pharmacy.id)}
                         disabled={approveMutation.isPending}
                         className="px-6 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-primary-sm hover:shadow-primary active:scale-95 transition-all disabled:opacity-50"
                       >
                         {approveMutation.isPending ? 'Processing...' : 'Approve'}
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-5xl mb-4 opacity-20 text-primary">check_circle</span>
                    <h3 className="text-xl font-bold font-headline mb-1 text-on-surface">All Clear</h3>
                    <p>There are no pending pharmacy registrations at this time.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PharmacyApprovalPage;
