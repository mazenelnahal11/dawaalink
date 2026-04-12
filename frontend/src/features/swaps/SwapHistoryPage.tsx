import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSwaps, downloadSwapRecord } from '../../api/swaps';
import { ErrorBanner } from '../../components/ErrorBanner';
import { StatusChip } from '../../components/StatusChip';


export const SwapHistoryPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const { data: history, isLoading, isError, refetch } = useQuery({
    queryKey: ['swapHistory', page],
    queryFn: () => getSwaps({ status: 'COMPLETED,CANCELLED,TIMED_OUT', page, size: 20, sort: 'createdAt,desc' }),
  });

  const handleDownload = async (cycleId: string) => {
    try {
      setDownloadError(null);
      const blob = await downloadSwapRecord(cycleId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `swap_record_${cycleId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      setDownloadError("Failed to download swap record. It may not exist or require administrative access.");
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl" data-icon="history">history</span>
            Swap History
          </h2>
          <p className="text-on-surface-variant mt-1 font-body">Complete regulatory audit trail of all past transactions.</p>
        </div>
      </div>

      {downloadError && <ErrorBanner message={downloadError} onRetry={() => setDownloadError(null)} />}
      {isError && !downloadError && <ErrorBanner message="Failed to load swap history." onRetry={() => refetch()} />}

      <div className="bg-surface-container-lowest rounded-2xl shadow-card border border-surface-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead className="bg-surface-container-low text-[10px] font-label font-bold text-outline uppercase tracking-wider border-b border-surface-container">
              <tr>
                <th className="px-6 py-4">Transaction Date</th>
                <th className="px-6 py-4">Medicine Item</th>
                <th className="px-6 py-4">Counterparty</th>
                <th className="px-6 py-4">Direction</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Regulatory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-sm">
              {isLoading ? (
                <tr>
                   <td colSpan={6} className="p-6">
                     <div className="w-full h-12 bg-surface-container-high animate-pulse rounded-lg mb-2"></div>
                     <div className="w-full h-12 bg-surface-container-high animate-pulse rounded-lg"></div>
                   </td>
                </tr>
              ) : history && history.length > 0 ? (
                history.map((swap) => (
                  <tr key={swap.cycleId} className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="px-6 py-4 font-medium text-on-surface">{new Date(swap.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-on-surface">{swap.medicineName}</div>
                      <div className="text-[10px] text-on-surface-variant font-mono mt-0.5">QTY: {swap.quantity} • Batch {swap.batchNumber}</div>
                    </td>
                    <td className="px-6 py-4">{swap.partnerPharmacyName}</td>
                    <td className="px-6 py-4">
                      {swap.direction === 'SENT' ? (
                        <span className="flex items-center gap-1 text-green-600 font-bold">
                          <span className="material-symbols-outlined text-sm" data-icon="arrow_upward">arrow_upward</span> Sent
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-primary font-bold">
                          <span className="material-symbols-outlined text-sm" data-icon="arrow_downward">arrow_downward</span> Received
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusChip status={swap.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                       {swap.status === 'COMPLETED' ? (
                         <button 
                           onClick={() => handleDownload(swap.cycleId)}
                           className="flex items-center justify-end gap-1 text-primary hover:text-primary-container font-bold text-xs transition-colors ml-auto group-hover:underline"
                         >
                           <span className="material-symbols-outlined text-[16px]" data-icon="download">download</span> Record
                         </button>
                       ) : (
                         <span className="text-on-surface-variant text-xs italic">N/A</span>
                       )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-4 opacity-50" data-icon="history">history</span>
                    <h3 className="text-xl font-bold font-headline mb-2 text-on-surface">No History Found</h3>
                    <p className="max-w-md mx-auto">Past swap transactions will be documented here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
          <button 
            disabled={page === 0} 
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:text-primary disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-xs font-bold font-mono text-outline">PAGE {page + 1}</span>
          <button 
            disabled={!history || history.length < 20} 
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 text-sm font-bold text-primary hover:text-primary-container disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapHistoryPage;
