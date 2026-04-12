import { api } from "./index";

export type InventoryItem = {
  id: string;
  medicineName: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  unit: string;
  storageCondition: 'ROOM_TEMP' | 'COLD_CHAIN';
  status: 'ACTIVE' | 'LOCKED' | 'FLAGGED';
  notes?: string;
};

export const getInventory = async (statusList?: string[]): Promise<InventoryItem[]> => {
  const queryParams = statusList && statusList.length > 0 ? `?status=${statusList.join(',')}&sort=expiryDate,asc` : '?sort=expiryDate,asc';
  const { data } = await api.get(`/inventory${queryParams}`);
  return data;
};

export const deleteInventoryItem = async (id: string): Promise<void> => {
  await api.delete(`/inventory/${id}`);
};

export const createInventoryListing = async (payload: any): Promise<any> => {
  const { data } = await api.post('/inventory', payload);
  return data;
};

export const searchMedications = async (q: string): Promise<any[]> => {
  const { data } = await api.get(`/medications?q=${q}`);
  return data;
};
