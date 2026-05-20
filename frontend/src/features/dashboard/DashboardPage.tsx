import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardKPI, getNearExpiry, getActiveMatches, getRecentHistory, exportInventoryReport } from '../../api/dashboard';
import { Link, useNavigate } from 'react-router-dom';
import { UrgencyBadge } from '../../components/UrgencyBadge';
import { StatusChip } from '../../components/StatusChip';
import { WishlistSection } from './WishlistSection';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: kpi, isLoading: loadingKpi } = useQuery({ queryKey: ['dashboardKPI'], queryFn: getDashboardKPI });
  const { data: nearExpiry } = useQuery({ queryKey: ['nearExpiry'], queryFn: () => getNearExpiry(90) });
  const { data: activeMatches } = useQuery({ queryKey: ['activeMatches'], queryFn: getActiveMatches });
  const { data: recentHistory } = useQuery({ queryKey: ['recentHistory'], queryFn: getRecentHistory });

  if (loadingKpi) {
    return <div className="p-8"><div className="animate-pulse bg-surface-container-high h-32 rounded-xl mb-4 w-full"></div></div>;
  }

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline">Pharmacy Dashboard</h2>
          <p className="text-on-surface-variant mt-1 font-body">Real-time overview of your clinical barter ecosystem.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => exportInventoryReport('pdf')}
            className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container-low transition-colors"
          >
            Export Report
          </button>
          <button 
            onClick={() => navigate('/inventory/new')}
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-primary-sm hover:shadow-primary active:scale-95 transition-all"
          >
            Add Dead Stock Item
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Items */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary shadow-card hover:shadow-card-hover transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary-fixed rounded-lg text-primary">
              <span className="material-symbols-outlined" data-icon="inventory_2">inventory_2</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider font-label">Total Items Listed</p>
          <h3 className="text-4xl font-extrabold text-on-surface mt-2 font-headline">{kpi?.totalItemsListed || 0}</h3>
        </div>
        {/* Matches Found */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary shadow-card hover:shadow-card-hover transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary-container rounded-lg text-primary">
              <span className="material-symbols-outlined" data-icon="search_insights">search_insights</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider font-label">Matches This Week</p>
          <h3 className="text-4xl font-extrabold text-on-surface mt-2 font-headline">{kpi?.matchesThisWeek || 0}</h3>
        </div>
        {/* Swaps Completed */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary shadow-card hover:shadow-card-hover transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary-fixed rounded-lg text-primary">
              <span className="material-symbols-outlined" data-icon="check_circle">check_circle</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider font-label">Swaps Completed</p>
          <h3 className="text-4xl font-extrabold text-on-surface mt-2 font-headline">{kpi?.totalSwapsCompleted || 0}</h3>
        </div>
        {/* Value Recovered */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary shadow-card hover:shadow-card-hover transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary-fixed rounded-lg text-primary">
              <span className="material-symbols-outlined" data-icon="payments">payments</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider font-label">Value Recovered</p>
          <h3 className="text-4xl font-extrabold text-on-surface mt-2 font-headline">
            {kpi?.estimatedValueRecoveredEGP ? (kpi.estimatedValueRecoveredEGP >= 1000 ? `${(kpi.estimatedValueRecoveredEGP / 1000).toFixed(1)}k EGP` : `${kpi.estimatedValueRecoveredEGP} EGP`) : "0 EGP"}
          </h3>
          <p className="text-[10px] text-outline mt-1 font-bold font-label">ESTIMATED EGP</p>
        </div>
      </div>

      {/* Dashboard Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Near-Expiry Alerts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-headline font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-error" data-icon="notification_important">notification_important</span>
              Near-Expiry Stock Alerts
            </h3>
            <Link to="/inventory" className="text-primary text-sm font-bold hover:underline">View All Inventory</Link>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-card border border-surface-container">
            <div className="grid grid-cols-1 divide-y divide-surface-container-low">
              {Array.isArray(nearExpiry) && nearExpiry.length > 0 ? (
                nearExpiry.sort((a, b) => a.daysToExpiry - b.daysToExpiry).map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors group">
                    <div className="flex items-center gap-4">
                      {/* Urgency Icon Background Logic */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.daysToExpiry < 30 ? 'bg-error-container text-error' : item.daysToExpiry < 60 ? 'bg-tertiary-fixed text-tertiary' : 'bg-surface-container-high text-primary'}`}>
                        <span className="material-symbols-outlined" data-icon="medication">{item.daysToExpiry < 30 ? 'medication' : item.daysToExpiry < 60 ? 'medication_liquid' : 'vaccines'}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface font-body">{item.medicineName}</h4>
                        <p className="text-xs text-on-surface-variant font-body">Batch: <span className="font-mono">{item.batchNumber}</span> • Qty: {item.quantityAvailable} {item.unit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 text-right">
                      <div>
                        <p className="text-[10px] font-bold text-outline-variant uppercase font-label">Expiry</p>
                        <UrgencyBadge daysToExpiry={item.daysToExpiry} />
                      </div>
                      <button className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        List for Swap
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl text-primary mb-2" data-icon="check_circle">check_circle</span>
                  <p>No items approaching expiry. Your stock is healthy.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Right Column: Matches & Wishlist */}
        <div className="space-y-8">
          {/* Active Matches */}
          <div className="space-y-4">
            <h3 className="text-xl font-headline font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" data-icon="handshake">handshake</span>
              Active Matches
            </h3>
            <div className="space-y-4">
              {Array.isArray(activeMatches) && activeMatches.length > 0 ? (
                activeMatches.map((match) => (
                  <div key={match.cycleId} className="bg-surface-container-lowest p-5 rounded-2xl shadow-card border border-surface-container relative overflow-hidden group hover:shadow-card-hover transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[10px] font-label font-bold text-primary uppercase mb-1">{match.direction === 'RECEIVED' ? 'INCOMING MATCH' : 'OUTGOING MATCH'}</p>
                        <h4 className="font-bold text-on-surface font-headline leading-tight">{match.medicineName}</h4>
                      </div>
                      <span className="material-symbols-outlined text-primary" data-icon="sync_alt">sync_alt</span>
                    </div>
                    <div className="space-y-2 mb-4 font-body">
                      <div className="flex justify-between text-xs">
                        <span className="text-on-surface-variant">Partner:</span>
                        <span className="font-bold text-on-surface">{match.partnerPharmacyName}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-on-surface-variant">Quantity:</span>
                        <span className="font-bold text-on-surface">{match.quantity} Units</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-container-low mt-2">
                      <button className="py-2 rounded-lg bg-surface-container text-on-surface-variant text-xs font-bold hover:bg-error-container hover:text-error transition-colors">Decline</button>
                      <button className="py-2 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-primary-sm hover:shadow-primary transition-all active:scale-95">Accept Swap</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-surface-container text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl text-primary mb-2 opacity-50" data-icon="handshake">handshake</span>
                  <p className="text-sm">No active matches right now. New matches appear here automatically.</p>
                </div>
              )}
            </div>
          </div>

          {/* Wishlist Section */}
          <WishlistSection />
        </div>
      </div>

      {/* Recent Swap History Table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-card border border-surface-container overflow-hidden">
        <div className="p-6 border-b border-surface-container-low flex justify-between items-center">
          <h3 className="font-headline text-xl font-bold">Recent Swap History</h3>
          <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
            <span className="material-symbols-outlined" data-icon="filter_list">filter_list</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead className="bg-surface-container-low text-[10px] font-label font-bold text-outline uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Transaction Date</th>
                <th className="px-6 py-4">Medicine Item</th>
                <th className="px-6 py-4">Counterparty</th>
                <th className="px-6 py-4">Direction</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-sm">
              {Array.isArray(recentHistory) && recentHistory.length > 0 ? (
                recentHistory.map((swap) => (
                  <tr key={swap.cycleId} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-4 font-medium">{new Date(swap.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold">{swap.medicineName}</div>
                      <div className="text-[10px] text-on-surface-variant">QTY: {swap.quantity} • Batch: <span className="font-mono">{swap.batchNumber}</span></div>
                    </td>
                    <td className="px-6 py-4">{swap.partnerPharmacyName}</td>
                    <td className="px-6 py-4">
                      {swap.direction === 'SENT' ? (
                        <span className="flex items-center gap-1 text-green-600 font-bold">
                          <span className="material-symbols-outlined text-sm" data-icon="arrow_upward">arrow_upward</span>
                          Sent
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-primary font-bold">
                          <span className="material-symbols-outlined text-sm" data-icon="arrow_downward">arrow_downward</span>
                          Received
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusChip status={swap.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {swap.status === 'COMPLETED' ? (
                        <Link to={`/swaps/history/${swap.cycleId}`} className="text-primary font-bold hover:underline">Details</Link>
                      ) : swap.status === 'IN_TRANSFER' ? (
                        <Link to={`/swaps/active`} className="text-primary font-bold hover:underline">Track</Link>
                      ) : (
                        <Link to={`/matches`} className="text-primary font-bold hover:underline">View Ticket</Link>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">No recent swaps found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="p-4 text-right border-t border-surface-container-low">
            <Link to="/swaps/history" className="text-primary text-sm font-bold hover:underline font-label uppercase tracking-wide">View Full History →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
