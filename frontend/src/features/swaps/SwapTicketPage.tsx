import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSwapTicket, acceptSwap, declineSwap } from '../../api/swaps';
import { SwapTicketCard } from '../../components/SwapTicketCard';
import { ErrorBanner } from '../../components/ErrorBanner';

export const SwapTicketPage: React.FC = () => {
  const { cycleId } = useParams<{ cycleId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: ticket, isLoading, isError } = useQuery({
    queryKey: ['swapTicket', cycleId],
    queryFn: () => getSwapTicket(cycleId!),
    enabled: !!cycleId,
  });

  const acceptMutation = useMutation({
    mutationFn: acceptSwap,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swapMatches'] });
      navigate('/matches');
    },
    onError: () => setErrorMsg("Failed to accept swap match. It may have expired or been resolved.")
  });

  const declineMutation = useMutation({
    mutationFn: declineSwap,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swapMatches'] });
      navigate('/matches');
    },
    onError: () => setErrorMsg("Failed to decline swap match. Please try again.")
  });

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto flex justify-center">
        <div className="animate-pulse bg-surface-container-high h-96 w-full max-w-3xl rounded-3xl"></div>
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-primary font-bold text-sm mb-4 flex items-center gap-1 hover:underline">
           <span className="material-symbols-outlined text-[16px]" data-icon="arrow_back">arrow_back</span> Back
        </button>
        <ErrorBanner message="This swap ticket does not exist or has expired." />
      </div>
    );
  }

  return (
    <div className="p-8 animate-in fade-in max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-primary font-bold text-sm flex items-center gap-1 hover:bg-surface-container px-3 py-1.5 rounded-full transition-colors">
           <span className="material-symbols-outlined text-[16px]" data-icon="arrow_back">arrow_back</span> Back to Matches
        </button>
        <p className="font-mono text-xs text-on-surface-variant font-bold">CYCLE_ID: {cycleId}</p>
      </div>

      {errorMsg && <div className="mb-6"><ErrorBanner message={errorMsg} /></div>}

      <div className="flex justify-center">
        <SwapTicketCard 
          ticket={ticket} 
          mode="expanded" 
          onAccept={(id) => acceptMutation.mutate(id)}
          onDecline={(id) => declineMutation.mutate(id)}
        />
      </div>
    </div>
  );
};

export default SwapTicketPage;
