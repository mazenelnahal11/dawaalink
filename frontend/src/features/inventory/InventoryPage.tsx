import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInventory, deleteInventoryItem } from '../../api/inventory';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '../../components/ConfirmDialog';

type FilterTab = 'ALL' | 'ACTIVE' | 'LOCKED' | 'NEAR_EXPIRY' | 'FLAGGED';

export const InventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL');
  
  const [itemToDelete, setItemToDelete] = useState<{ id: string, name: string } | null>(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ['inventory', activeFilter],
    queryFn: () => {
      if (activeFilter === 'NEAR_EXPIRY') {
        // Technically near-expiry is a separate endpoint, but following the spec "data: GET /api/v1/inventory with query params", we'll mock filtering logic if using main inventory endpoint or hit it correctly.
        // In the design doc: "Filter bar: All | Active | Locked | Near-Expiry | Flagged". Let's assume filtering on front-end for now or requesting specific status.
        return getInventory(['ACTIVE']); // Simplification for UI
      }
      if (activeFilter === 'ALL') {
        return getInventory(['ACTIVE','LOCKED','FLAGGED']);
      }
      return getInventory([activeFilter]);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setItemToDelete(null);
    }
  });

  // Derived filter if we let frontend do minor filtering (like near-expiry which requires calculating dates)
  let displayItems = items || [];
  if (activeFilter === 'NEAR_EXPIRY') {
    displayItems = displayItems.filter(i => {
      const diff = new Date(i.expiryDate).getTime() - new Date().getTime();
      const days = diff / (1000 * 3600 * 24);
      return days <= 90 && days > 0;
    });
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline">My Dead Stock</h2>
          <p className="text-on-surface-variant mt-1 font-body">Manage your surplus active inventory.</p>
        </div>
        <button 
          onClick={() => navigate('/inventory/new')}
          className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-primary-sm hover:shadow-primary active:scale-95 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]" data-icon="add">add</span>
          Add Item
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-surface-container-low pb-2">
        {(['ALL', 'ACTIVE', 'LOCKED', 'NEAR_EXPIRY', 'FLAGGED'] as FilterTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold font-label tracking-wide transition-colors ${activeFilter === tab ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            {tab.replace('_', '-')}
          </button>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-card border border-surface-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead className="bg-surface-container-low text-[10px] font-label font-bold text-outline uppercase tracking-wider border-b border-surface-container">
              <tr>
                <th className="px-6 py-4">Medicine Item</th>
                <th className="px-6 py-4">Batch No.</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4">Unit</th>
                <th className="px-6 py-4">Storage</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8">
                     <div className="w-full h-8 bg-surface-container-high animate-pulse rounded-lg mb-2"></div>
                     <div className="w-full h-8 bg-surface-container-high animate-pulse rounded-lg"></div>
                  </td>
                </tr>
              ) : displayItems.length > 0 ? (
                displayItems.map((item) => {
                  const isFlagged = item.status === 'FLAGGED';
                  return (
                    <tr key={item.id} className={`transition-colors ${isFlagged ? 'bg-error-container/30' : 'hover:bg-surface-container-lowest'}`}>
                      <td className="px-6 py-4">
                        <div className={`font-bold ${isFlagged ? 'text-error' : 'text-on-surface'}`}>{item.medicineName}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-on-surface-variant text-xs">{item.batchNumber}</td>
                      <td className="px-6 py-4 font-semibold">{new Date(item.expiryDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-bold">{item.quantity}</td>
                      <td className="px-6 py-4 lowercase text-on-surface-variant">{item.unit}</td>
                      <td className="px-6 py-4">
                        {item.storageCondition === 'ROOM_TEMP' ? (
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase font-label">Room Temp</span>
                        ) : (
                          <span className="text-[10px] font-bold text-tertiary uppercase font-label">Cold Chain</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {item.status === 'LOCKED' ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-primary font-label px-2 py-1 bg-primary-fixed rounded-full inline-flex">
                            <span className="material-symbols-outlined text-[14px]" data-icon="lock">lock</span> Locked
                          </span>
                        ) : isFlagged ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-on-error-container font-label px-2 py-1 bg-error-container rounded-full inline-flex">
                            <span className="material-symbols-outlined text-[14px] text-error" data-icon="flag">flag</span> Flagged
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-green-700 font-label px-2 py-1 bg-green-100 rounded-full inline-flex">
                            <span className="material-symbols-outlined text-[14px]" data-icon="check_circle">check_circle</span> Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                         {item.status === 'ACTIVE' && (
                           <>
                             <button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-container-low" title="Edit">
                               <span className="material-symbols-outlined text-[20px]" data-icon="edit">edit</span>
                             </button>
                             <button onClick={() => setItemToDelete({ id: item.id, name: item.medicineName })} className="p-1.5 text-on-surface-variant hover:text-error transition-colors rounded-lg hover:bg-error-container" title="Delete">
                               <span className="material-symbols-outlined text-[20px]" data-icon="delete">delete</span>
                             </button>
                           </>
                         )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50" data-icon="inventory_2">inventory_2</span>
                    <p>No inventory items found matching the selected filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog 
        open={!!itemToDelete}
        title="Delete Item"
        message={`Are you sure you want to delete ${itemToDelete?.name}? This action cannot be undone and will permanently remove it from the matching engine.`}
        variant="danger"
        confirmLabel={deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        onConfirm={() => itemToDelete && deleteMutation.mutate(itemToDelete.id)}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};

export default InventoryPage;
