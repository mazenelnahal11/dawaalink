import React from 'react';
import { CountdownTimer } from './CountdownTimer';
import { UrgencyBadge } from './UrgencyBadge';
import { useAuthStore } from '../store/AuthStore';

export type SwapLegSummary = {
  medicineName: string;
  quantity: number;
  unit: string;
  fromPharmacy: string;
  fromDistrict: string;
};

export type SwapTicketDTO = {
  cycleId: string;
  medicineName: string;      
  batchNumber: string;
  expiryDate: string;        
  daysUntilExpiry: number;
  quantityOffered: number;
  unit: "BOX" | "STRIP" | "VIAL" | "PIECE";
  storageCondition: "ROOM_TEMP" | "COLD_CHAIN";
  offeringPharmacy: string;
  offeringDistrict: string;
  distanceKm: number;
  willReceive: SwapLegSummary[];  
  ticketExpiresAt: string;            
};

type Props = {
  ticket: SwapTicketDTO;
  mode: "compact" | "expanded";
  onAccept?: (cycleId: string) => void;
  onDecline?: (cycleId: string) => void;
};

export const SwapTicketCard: React.FC<Props> = ({ ticket, mode, onAccept, onDecline }) => {
  const { user } = useAuthStore();
  const role = user?.role || 'OWNER';

  if (mode === 'compact') {
    return (
      <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-card border border-surface-container relative overflow-hidden group hover:shadow-card-hover transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-[10px] font-bold font-label text-primary uppercase mb-1">Incoming Match</p>
            <h4 className="font-bold text-on-surface font-headline leading-tight">{ticket.medicineName}</h4>
          </div>
          <span className="material-symbols-outlined text-primary" data-icon="sync_alt">sync_alt</span>
        </div>
        <div className="space-y-2 mb-4 font-body">
          <div className="flex justify-between text-xs">
            <span className="text-on-surface-variant">Partner:</span>
            <span className="font-bold text-on-surface">{ticket.offeringPharmacy}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-on-surface-variant">Quantity:</span>
            <span className="font-bold text-on-surface">{ticket.quantityOffered} {ticket.unit}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-on-surface-variant">Expires in:</span>
            <CountdownTimer expiresAt={ticket.ticketExpiresAt} />
          </div>
        </div>

        {role === 'EMPLOYEE' ? (
          <div className="pt-2 mt-2 border-t border-surface-container-low text-center">
            <p className="text-xs text-on-surface-variant italic">Awaiting Owner decision</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 pt-2 mt-2 border-t border-surface-container-low">
            <button 
              onClick={() => onDecline && onDecline(ticket.cycleId)}
              className="py-2 rounded-lg bg-surface-container text-on-surface-variant text-xs font-bold hover:bg-error-container hover:text-error transition-colors"
            >
              Decline
            </button>
            <button 
              onClick={() => onAccept && onAccept(ticket.cycleId)}
              className="py-2 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-primary-sm hover:shadow-primary transition-all active:scale-95"
            >
              Accept Swap
            </button>
          </div>
        )}
      </div>
    );
  }

  // Expanded Mode
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-card-hover border border-surface-container overflow-hidden w-full max-w-3xl mx-auto">
      <div className="bg-primary text-on-primary px-6 py-4 flex justify-between items-center">
        <span className="text-xs font-bold uppercase tracking-widest font-label">Swap Ticket</span>
        <CountdownTimer expiresAt={ticket.ticketExpiresAt} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Left Column */}
        <div className="p-6 border-b md:border-b-0 md:border-r border-outline-variant/30 flex flex-col gap-4">
          <h5 className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label">You Offer</h5>
          <h3 className="font-headline text-2xl font-bold text-on-surface leading-tight">{ticket.medicineName}</h3>
          
          <div className="space-y-4 font-body mt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">Batch No.</span>
              <span className="font-mono text-sm font-semibold">{ticket.batchNumber}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">Expiry Date</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{new Date(ticket.expiryDate).toLocaleDateString()}</span>
                <UrgencyBadge daysToExpiry={ticket.daysUntilExpiry} showDays={false} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">Quantity</span>
              <span className="text-sm font-semibold">{ticket.quantityOffered} {ticket.unit}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">Storage</span>
              {ticket.storageCondition === 'ROOM_TEMP' 
                ? <span className="px-2 py-1 bg-surface-container text-on-surface-variant text-[10px] font-bold rounded-md font-label uppercase">Room Temp</span>
                : <span className="px-2 py-1 bg-tertiary-fixed text-tertiary text-[10px] font-bold rounded-md font-label uppercase">Cold Chain</span>}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-surface-container mt-2">
              <span className="text-sm text-on-surface-variant">To Pharmacy</span>
              <div className="text-right">
                <p className="text-sm font-bold">{ticket.offeringPharmacy}</p>
                <p className="text-[10px] text-on-surface-variant">{ticket.offeringDistrict} • <span className="text-primary font-bold">{ticket.distanceKm} km away</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="p-6 flex flex-col gap-4 bg-surface-bright">
          <h5 className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label">You Receive</h5>
          
          <div className="space-y-3 flex-1 overflow-y-auto">
            {ticket.willReceive.map((leg, idx) => (
              <div key={idx} className="bg-surface-container-low rounded-xl p-4 flex gap-3 border border-surface-container">
                <span className="material-symbols-outlined text-primary mt-0.5" data-icon="inventory_2">inventory_2</span>
                <div>
                  <h4 className="font-bold font-headline text-on-surface leading-tight">{leg.medicineName}</h4>
                  <p className="text-sm text-on-surface font-body mt-1">{leg.quantity} {leg.unit}</p>
                  <p className="text-[10px] text-on-surface-variant font-body mt-1">From: {leg.fromPharmacy} ({leg.fromDistrict})</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-surface-container-low bg-surface-container-lowest">
        {role === 'EMPLOYEE' ? (
          <p className="text-on-surface-variant text-sm italic text-center font-body">Only Owner or Pharmacist can accept or decline swaps.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => onDecline && onDecline(ticket.cycleId)}
              className="py-3 rounded-xl bg-surface-container text-on-surface-variant font-bold hover:bg-error-container hover:text-error transition-colors font-label uppercase text-sm tracking-wider"
            >
              Decline
            </button>
            <button 
              onClick={() => onAccept && onAccept(ticket.cycleId)}
              className="py-3 rounded-xl bg-primary text-on-primary font-bold shadow-primary-sm hover:shadow-primary active:scale-95 transition-all font-label uppercase text-sm tracking-wider"
            >
              Accept Swap
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
