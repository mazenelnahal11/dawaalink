import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSwaps, acceptSwap, declineSwap } from '../../api/swaps';
import { SwapTicketCard, type SwapTicketDTO } from '../../components/SwapTicketCard';
import { ErrorBanner } from '../../components/ErrorBanner';

export const SwapMatchesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: matches, isLoading, isError, refetch } = useQuery({
    queryKey: ['swapMatches'],
    queryFn: () => getSwaps({ status: 'PENDING,PARTIAL_ACCEPT' }),
  });

  const acceptMutation = useMutation({
    mutationFn: acceptSwap,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['swapMatches'] }),
    onError: () => setErrorMsg("Failed to accept swap match. It may have expired or been taken by another pharmacy.")
  });

  const declineMutation = useMutation({
    mutationFn: declineSwap,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['swapMatches'] }),
    onError: () => setErrorMsg("Failed to decline swap match. Please try again.")
  });

  // Map to mock ticket schema since backend returns SwapCycle generic structure for list view
  const mapCycleToTicket = (cycle: any): SwapTicketDTO => ({
    cycleId: cycle.cycleId,
    medicineName: cycle.medicineName,
    batchNumber: cycle.batchNumber || "UNKNWN",
    expiryDate: cycle.expiryDate || new Date().toISOString(),
    daysUntilExpiry: 90,
    quantityOffered: cycle.quantity,
    unit: cycle.unit || "BOX",
    storageCondition: "ROOM_TEMP",
    offeringPharmacy: cycle.partnerPharmacyName,
    offeringDistrict: "Unspecified District",
    distanceKm: 5.2,
    willReceive: [],
    ticketExpiresAt: new Date(Date.now() + 86400000).toISOString(),
  });

  return (
    <div className="p-8 space-y-8 animate-in fade-in max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline">Swap Matches</h2>
          <p className="text-on-surface-variant mt-1 font-body">Review algorithmically generated exchange opportunities.</p>
        </div>
      </div>

      {errorMsg && <ErrorBanner message={errorMsg} onRetry={() => setErrorMsg(null)} />}
      {isError && !errorMsg && <ErrorBanner message="Failed to load swap matches. Check your network or contact support." onRetry={() => refetch()} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
           Array.from({ length: 6 }).map((_, i) => (
             <div key={i} className="animate-pulse bg-surface-container-low h-48 rounded-2xl w-full"></div>
           ))
        ) : matches && matches.length > 0 ? (
          matches.map((match) => (
            <SwapTicketCard 
              key={match.cycleId} 
              ticket={mapCycleToTicket(match)} 
              mode="compact" 
              onAccept={acceptMutation.mutate}
              onDecline={declineMutation.mutate}
            />
          ))
        ) : (
          <div className="col-span-full p-16 text-center bg-surface-container-lowest rounded-2xl border border-surface-container">
            <span className="material-symbols-outlined text-6xl text-primary mb-4 opacity-50" data-icon="handshake">handshake</span>
            <h3 className="text-xl font-bold font-headline mb-2">No Active Matches</h3>
            <p className="text-on-surface-variant max-w-md mx-auto">The matching engine automatically finds pairs based on value and district. New matches will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapMatchesPage;
