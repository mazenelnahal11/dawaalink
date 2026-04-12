import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '../../api/admin';
import { ErrorBanner } from '../../components/ErrorBanner';

export const AuditLogPage: React.FC = () => {
  const [page, setPage] = useState(0);

  const { data: logs, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminAuditLogs', page],
    queryFn: () => getAuditLogs({ page, size: 50 }),
  });

  return (
    <div className="p-8 space-y-8 animate-in fade-in max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[32px]" data-icon="manage_search">manage_search</span>
          System Audit Log
        </h2>
        <p className="text-on-surface-variant mt-1 font-body">Immutable chronological record of all administrative and system actions.</p>
      </div>

      {isError && <ErrorBanner message="Failed to load audit logs. Ensure you have network connectivity and admin rights." onRetry={() => refetch()} />}

      <div className="bg-surface-container-lowest rounded-2xl shadow-card border border-surface-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead className="bg-surface-container-low text-[10px] font-label font-bold text-outline uppercase tracking-wider border-b border-surface-container">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Actor ID</th>
                <th className="px-6 py-4">Pharmacy Context</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-sm">
              {isLoading ? (
                <tr>
                   <td colSpan={5} className="p-6">
                     <div className="w-full h-12 bg-surface-container-high animate-pulse rounded-lg"></div>
                   </td>
                </tr>
              ) : logs && logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-primary">{log.action}</td>
                    <td className="px-6 py-4 font-mono text-xs">{log.userId}</td>
                    <td className="px-6 py-4 font-semibold">{log.pharmacyName || 'SYSTEM'}</td>
                    <td className="px-6 py-4 text-on-surface-variant text-xs">{log.details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-4 opacity-50" data-icon="inventory_2">inventory_2</span>
                    <h3 className="text-xl font-bold font-headline mb-2 text-on-surface">No Audit Logs</h3>
                    <p className="max-w-md mx-auto">Either this system is newly initialized or logs have been archived.</p>
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
            Newer
          </button>
          <span className="text-xs font-bold font-mono text-outline">PAGE {page + 1}</span>
          <button 
            disabled={!logs || logs.length < 50} 
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 text-sm font-bold text-primary hover:text-primary-container disabled:opacity-50 transition-colors"
          >
            Older
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogPage;
