import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { createInventoryListing, searchMedications } from '../../api/inventory';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { ErrorBanner } from '../../components/ErrorBanner';

// Zod Schema based on DAWAA-FE-REDESIGN-001 Section 3.3
const listingSchema = z.object({
  medicineId: z.string().optional(),
  medicineName: z.string().min(2, "Please enter a valid medicine name"),
  batchNumber: z.string().min(3).max(50).regex(/^[A-Za-z0-9-]+$/, "Alphanumeric and hyphens only"),
  expiryDate: z.string().refine((val) => {
    const d = new Date(val);
    return !isNaN(d.getTime()) && d > new Date();
  }, { message: "Expiry date must be in the future" }),
  quantityAvailable: z.number().int().positive("Quantity must be greater than 0"),
  unit: z.enum(['BOX', 'STRIP', 'VIAL', 'PIECE']),
  storageCondition: z.enum(['ROOM_TEMP', 'COLD_CHAIN']),
  unitPrice: z.number().nonnegative().optional(),
  notes: z.string().max(500).optional(),
});

type ListingFormState = z.infer<typeof listingSchema>;

export const ListingFormPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ListingFormState>({
    medicineId: '',
    medicineName: '',
    batchNumber: '',
    expiryDate: '',
    quantityAvailable: 1,
    unit: 'BOX',
    storageCondition: 'ROOM_TEMP',
    unitPrice: undefined,
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ListingFormState, string>>>({});
  
  // Combobox state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  // Specific state for rules
  const [showColdChainWarning, setShowColdChainWarning] = useState(false);
  const [flaggedErrorMsg, setFlaggedErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: suggestions } = useQuery({
    queryKey: ['medicationsSearch', debouncedSearch],
    queryFn: () => searchMedications(debouncedSearch),
    enabled: debouncedSearch.length > 2,
  });

  const mutation = useMutation({
    mutationFn: createInventoryListing,
    onSuccess: (res) => {
      if (res.status === 'FLAGGED') {
        setFlaggedErrorMsg("This item has been flagged as a controlled substance and cannot be listed for swapping. A system administrator has been notified. Contact support if this is incorrect.");
      } else {
        // Navigation + toast usually goes here.
        navigate('/inventory', { state: { message: "Item listed successfully. The matching engine will run within 30 minutes." } });
      }
    },
    onError: (error: any) => {
       const msg = error.response?.data?.message || "An unexpected server error occurred.";
       setFlaggedErrorMsg(msg);
    }
  });

  const handleBlur = (field: keyof ListingFormState) => {
    try {
      listingSchema.pick({ [field]: true } as any).parse({ [field]: formData[field] });
      setErrors(prev => ({ ...prev, [field]: undefined }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: err.issues[0].message }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFlaggedErrorMsg(null);
    try {
      listingSchema.parse(formData);
      
      // COLD_CHAIN intercepts
      if (formData.storageCondition === 'COLD_CHAIN') {
        setShowColdChainWarning(true);
        return; 
      }
      
      const { medicineId, ...payload } = formData;
      mutation.mutate({ ...payload, gtin: medicineId });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrs: any = {};
        err.issues.forEach(issue => {
          if (issue.path[0]) newErrs[issue.path[0]] = issue.message;
        });
        setErrors(newErrs);
      }
    }
  };

  const handleConfirmColdChain = () => {
    setShowColdChainWarning(false);
    const { medicineId, ...payload } = formData;
    mutation.mutate({ ...payload, gtin: medicineId });
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8 animate-in fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline">Add Dead Stock Item</h2>
        <p className="text-on-surface-variant mt-1 font-body">List inventory to be matched automatically.</p>
      </div>

      {flaggedErrorMsg && (
        <ErrorBanner message={flaggedErrorMsg} />
      )}

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-8 rounded-2xl shadow-card border border-surface-container space-y-6">
        
        {/* Combobox: Medicine Name */}
        <div className="relative">
          <label className="block text-sm font-bold font-body text-on-surface mb-2">Medicine Name</label>
          <input
            type="text"
            className={`w-full px-4 py-3 rounded-xl border ${errors.medicineName ? 'border-error bg-error-container/20' : 'border-outline-variant/60 focus:border-primary'} font-body text-sm outline-none transition-colors`}
            placeholder="Search for medication (e.g., Augmentin)"
            value={searchTerm || formData.medicineName}
            onChange={(e) => {
              const val = e.target.value;
              setSearchTerm(val);
              setFormData({ ...formData, medicineName: val, medicineId: '' });
              setShowOptions(true);
            }}
            onFocus={() => setShowOptions(true)}
            onBlur={() => setTimeout(() => { setShowOptions(false); handleBlur('medicineId'); }, 200)}
          />
          {errors.medicineId && <p className="text-error text-xs mt-1 font-body font-bold">{errors.medicineId}</p>}
          
          {showOptions && suggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-card-hover max-h-60 overflow-y-auto">
              {suggestions.map((s: any) => (
                <button
                  key={s.id}
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-surface-container text-sm font-body border-b border-surface-container-low last:border-0"
                  onClick={() => {
                    setFormData({ ...formData, medicineId: s.id, medicineName: `${s.tradeName} (${s.scientificName})` });
                    setSearchTerm('');
                    setShowOptions(false);
                    setErrors({ ...errors, medicineId: undefined, medicineName: undefined });
                  }}
                >
                  <span className="font-bold block">{s.tradeName}</span>
                  <span className="text-on-surface-variant text-xs">{s.scientificName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Batch Number */}
          <div>
            <label className="block text-sm font-bold font-body text-on-surface mb-2">Batch Number</label>
            <input
              type="text"
              className={`w-full px-4 py-3 rounded-xl border ${errors.batchNumber ? 'border-error' : 'border-outline-variant/60 focus:border-primary'} font-mono text-sm outline-none uppercase uppercase transition-colors`}
              value={formData.batchNumber}
              onChange={e => setFormData({ ...formData, batchNumber: e.target.value.toUpperCase() })}
              onBlur={() => handleBlur('batchNumber')}
            />
            {errors.batchNumber && <p className="text-error text-xs mt-1 font-body font-bold">{errors.batchNumber}</p>}
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-bold font-body text-on-surface mb-2">Expiry Date</label>
            <input
              type="date"
              className={`w-full px-4 py-3 rounded-xl border ${errors.expiryDate ? 'border-error' : 'border-outline-variant/60 focus:border-primary'} font-body text-sm outline-none transition-colors`}
              value={formData.expiryDate}
              onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
              onBlur={() => handleBlur('expiryDate')}
            />
            {errors.expiryDate && <p className="text-error text-xs mt-1 font-body font-bold">{errors.expiryDate}</p>}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-bold font-body text-on-surface mb-2">Quantity Available</label>
            <input
              type="number"
              min="1"
              className={`w-full px-4 py-3 rounded-xl border ${errors.quantityAvailable ? 'border-error' : 'border-outline-variant/60 focus:border-primary'} font-body text-sm outline-none transition-colors`}
              value={formData.quantityAvailable}
              onChange={e => setFormData({ ...formData, quantityAvailable: parseInt(e.target.value) || 0 })}
              onBlur={() => handleBlur('quantityAvailable')}
            />
            {errors.quantityAvailable && <p className="text-error text-xs mt-1 font-body font-bold">{errors.quantityAvailable}</p>}
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-bold font-body text-on-surface mb-2">Unit</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 focus:border-primary font-body text-sm outline-none bg-surface-container-lowest"
              value={formData.unit}
              onChange={e => setFormData({ ...formData, unit: e.target.value as any })}
            >
              <option value="BOX">Box</option>
              <option value="STRIP">Strip</option>
              <option value="VIAL">Vial</option>
              <option value="PIECE">Piece</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Unit Price */}
          <div>
            <label className="block text-sm font-bold font-body text-on-surface mb-2">Unit Price (Optional)</label>
            <div className="relative">
              <input
                type="number"
                placeholder="e.g. 120.50"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-outline-variant/60 focus:border-primary font-body text-sm outline-none"
                value={formData.unitPrice || ''}
                onChange={e => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || undefined })}
              />
              <span className="absolute right-4 top-3 text-sm font-bold text-on-surface-variant font-label">EGP</span>
            </div>
          </div>

          {/* Storage Condition Toggle */}
          <div>
            <label className="block text-sm font-bold font-body text-on-surface mb-2">Storage Condition</label>
            <div className="flex bg-surface-container-low p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, storageCondition: 'ROOM_TEMP' })}
                className={`flex-1 py-2 text-xs font-bold font-label tracking-wide rounded-lg transition-all ${formData.storageCondition === 'ROOM_TEMP' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
              >
                ROOM TEMP
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, storageCondition: 'COLD_CHAIN' })}
                className={`flex-1 py-2 text-xs font-bold font-label tracking-wide rounded-lg transition-all ${formData.storageCondition === 'COLD_CHAIN' ? 'bg-tertiary-fixed text-tertiary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}
              >
                COLD CHAIN
              </button>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-bold font-body text-on-surface mb-2">Notes (Optional)</label>
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 focus:border-primary font-body text-sm outline-none resize-none h-24"
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            maxLength={500}
          />
          <div className="text-right text-xs text-on-surface-variant font-mono mt-1">
            {formData.notes?.length || 0}/500
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold shadow-primary-sm hover:shadow-primary active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100 flex items-center gap-2"
          >
            {mutation.isPending && <span className="material-symbols-outlined animate-spin text-[20px]" data-icon="progress_activity">progress_activity</span>}
            List Item
          </button>
        </div>
      </form>

      <ConfirmDialog 
        open={showColdChainWarning}
        title="Cold Chain Exclusion"
        message="Cold-chain items cannot be verified remotely and will be excluded from the matching pool. Items requiring 2–8°C storage are not eligible for swaps. Continue?"
        variant="warning"
        confirmLabel="Continue — Save with Exclusion"
        onConfirm={handleConfirmColdChain}
        onCancel={() => setShowColdChainWarning(false)}
      />
    </div>
  );
};

export default ListingFormPage;
