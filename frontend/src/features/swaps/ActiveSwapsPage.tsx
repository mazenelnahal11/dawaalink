import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSwaps, confirmReceipt } from '../../api/swaps';
import { ErrorBanner } from '../../components/ErrorBanner';
import { StatusChip } from '../../components/StatusChip';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export const ActiveSwapsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receiptConfirmId, setReceiptConfirmId] = useState<string | null>(null);

  const { data: activeSwaps, isLoading, isError, refetch } = useQuery({
    queryKey: ['activeSwapsTransfer'],
    queryFn: () => getSwaps({ status: 'IN_TRANSFER' }),
  });

  const confirmMutation = useMutation({
    mutationFn: confirmReceipt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeSwapsTransfer'] });
      setReceiptConfirmId(null);
    },
    onError: () => setErrorMsg("Failed to confirm receipt. Contact support if this persists.")
  });

  return (
    <div className="p-8 space-y-8 animate-in fade-in max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl" data-icon="local_shipping">local_shipping</span>
            Active Swaps
          </h2>
          <p className="text-on-surface-variant mt-1 font-body">Track and verify incoming deliveries from other pharmacies.</p>
        </div>
      </div>

      {errorMsg && <ErrorBanner message={errorMsg} onRetry={() => setErrorMsg(null)} />}
      {isError && !errorMsg && <ErrorBanner message="Failed to load active transfers." onRetry={() => refetch()} />}

      <div className="bg-surface-container-lowest rounded-2xl shadow-card border border-surface-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead className="bg-surface-container-low text-[10px] font-label font-bold text-outline uppercase tracking-wider border-b border-surface-container">
              <tr>
                <th className="px-6 py-4">Medicine Item</th>
                <th className="px-6 py-4">From Pharmacy</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-sm">
              {isLoading ? (
                <tr>
                   <td colSpan={4} className="p-6">
                     <div className="w-full h-12 bg-surface-container-high animate-pulse rounded-lg"></div>
                   </td>
                </tr>
              ) : activeSwaps && activeSwaps.length > 0 ? (
                activeSwaps.map((swap) => (
                  <tr key={swap.cycleId} className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-on-surface">{swap.medicineName}</div>
                      <div className="text-[10px] text-on-surface-variant font-mono mt-0.5">QTY: {swap.quantity} • Batch {swap.batchNumber}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold">{swap.partnerPharmacyName}</td>
                    <td className="px-6 py-4">
                      <StatusChip status={swap.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                       {swap.direction === 'RECEIVED' ? (
                         <button 
                           onClick={() => setReceiptConfirmId(swap.cycleId)}
                           className="px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-primary-sm hover:shadow-primary active:scale-95 transition-all"
                         >
                           Confirm Receipt
                         </button>
                       ) : (
                         <span className="text-xs text-on-surface-variant font-bold italic">Awaiting partner receipt</span>
                       )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-4 opacity-50" data-icon="inventory_2">inventory_2</span>
                    <h3 className="text-xl font-bold font-headline mb-2 text-on-surface">No Active Deliveries</h3>
                    <p className="max-w-md mx-auto">You have no swaps currently in transfer. Check the Swap Matches tab for new opportunities.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog 
        open={!!receiptConfirmId}
        title="Confirm Receipt"
        message="Please verify that the physical medication matches the quantity and batch number specified in the swap agreement. Have you successfully received the correct item?"
        confirmLabel={confirmMutation.isPending ? 'Confirming...' : 'Yes, Confirm Receipt'}
        onConfirm={() => receiptConfirmId && confirmMutation.mutate(receiptConfirmId)}
        onCancel={() => setReceiptConfirmId(null)}
      />
    </div>
  );
};

export default ActiveSwapsPage;
