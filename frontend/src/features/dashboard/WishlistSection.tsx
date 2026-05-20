import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWishlist, addToWishlist, removeFromWishlist } from '../../api/wishlist';
import { searchMedications } from '../../api/inventory';

export const WishlistSection: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [qty, setQty] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedMed, setSelectedMed] = useState<{ gtin: string; tradeName: string } | null>(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: getWishlist
  });

  const { data: suggestions, isLoading: searching } = useQuery({
    queryKey: ['medicationsSearch', searchTerm],
    queryFn: () => searchMedications(searchTerm),
    enabled: searchTerm.length > 2 && !selectedMed
  });

  const addMutation = useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      setSearchTerm('');
      setQty(1);
      setShowSearch(false);
      setSelectedMed(null);
    }
  });

  const removeMutation = useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] })
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMed) {
      addMutation.mutate({ gtin: selectedMed.gtin, medicineName: selectedMed.tradeName, quantityNeeded: qty });
    } else if (searchTerm.trim()) {
      addMutation.mutate({ medicineName: searchTerm.trim(), quantityNeeded: qty });
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-2xl border border-surface-container-high">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-primary-sm">
            <span className="material-symbols-outlined" data-icon="auto_awesome">auto_awesome</span>
          </div>
          <div>
            <h3 className="text-lg font-headline font-bold text-on-surface">Exchange Wishlist</h3>
            <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest font-bold">What your pharmacy needs</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setShowSearch(!showSearch);
            setSelectedMed(null);
            setSearchTerm('');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            showSearch 
            ? 'bg-surface-container-highest text-on-surface' 
            : 'bg-primary-container text-on-primary shadow-primary-sm hover:shadow-primary hover:-translate-y-0.5'
          }`}
        >
          <span className="material-symbols-outlined text-sm">{showSearch ? 'close' : 'add_circle'}</span>
          {showSearch ? 'Cancel' : 'Add Item'}
        </button>
      </div>

      {/* Add Form */}
      {showSearch && (
        <form 
          onSubmit={handleSubmit}
          className="bg-surface-container-lowest p-6 rounded-2xl border-2 border-primary-fixed shadow-card-hover animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="md:col-span-2 space-y-2 relative">
              <label className="text-xs font-bold text-on-surface-variant uppercase ml-1">Search Medicine</label>
              {selectedMed ? (
                <div className="flex items-center justify-between bg-primary-fixed p-3 rounded-xl border border-primary-container">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary" data-icon="check_circle">check_circle</span>
                    <span className="font-bold text-sm text-on-primary-fixed">{selectedMed.tradeName}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setSelectedMed(null)}
                    className="text-on-primary-fixed-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm" data-icon="edit">edit</span>
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Type name here..."
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                  {searching && (
                    <div className="absolute right-3 top-3.5">
                       <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  {suggestions && suggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-2 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto ghost-shadow">
                      {suggestions.map((med: any) => (
                        <button
                          key={med.gtin}
                          type="button"
                          className="w-full text-left px-5 py-3 text-sm hover:bg-primary-fixed transition-colors flex justify-between items-center group border-b border-surface-container LAST:border-none"
                          onClick={() => setSelectedMed({ gtin: med.gtin, tradeName: med.tradeName })}
                        >
                          <div>
                            <div className="font-bold text-on-surface group-hover:text-primary transition-colors">{med.tradeName}</div>
                            <div className="text-[10px] text-on-surface-variant font-mono">{med.gtin}</div>
                          </div>
                          <span className="material-symbols-outlined text-outline-variant opacity-0 group-hover:opacity-100 transition-opacity" data-icon="add">add</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase ml-1">Quantity</label>
              <input 
                type="number" 
                min="1" 
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value))}
              />
            </div>

            <button 
              type="submit"
              disabled={(!selectedMed && !searchTerm.trim()) || addMutation.isPending}
              className="h-[52px] bg-primary text-on-primary rounded-xl font-bold text-sm shadow-primary hover:shadow-primary-lg active:scale-95 disabled:bg-surface-container-highest disabled:text-outline-variant disabled:shadow-none transition-all flex items-center justify-center gap-2"
            >
              {addMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined" data-icon="save">save</span>
                  Save to Wishlist
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Wishlist Items List */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="h-24 bg-surface-container rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : items && items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-surface-container-lowest p-5 rounded-2xl border border-surface-container hover:border-primary-fixed hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-2xl" data-icon="shopping_bag">shopping_bag</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-headline font-bold text-on-surface leading-tight">{item.medicineName}</h4>
                      <button 
                        onClick={() => removeMutation.mutate(item.id)}
                        className="p-2 text-outline-variant hover:text-error hover:bg-error-container rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <span className="material-symbols-outlined text-sm" data-icon="delete">delete</span>
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-low rounded-lg text-on-surface-variant border border-surface-container">
                        <span className="material-symbols-outlined text-xs" data-icon="numbers">numbers</span>
                        <span className="text-xs font-bold font-mono">{item.quantityNeeded} Units</span>
                      </div>
                      <div className="text-[10px] text-outline font-bold uppercase font-label">Status: Waiting</div>
                    </div>
                  </div>
                </div>
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                   <span className="material-symbols-outlined text-6xl" data-icon="star">star</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-lowest p-12 text-center rounded-3xl border border-dashed border-outline-variant">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl text-outline-variant" data-icon="inventory">inventory</span>
            </div>
            <h3 className="text-lg font-headline font-bold text-on-surface mb-2">No active needs recorded</h3>
            <p className="text-sm text-on-surface-variant max-w-sm mx-auto font-body">Adding items to your wishlist allows the matching engine to find the exact medicines you need for your inventory.</p>
          </div>
        )}
      </div>
    </div>
  );
};
