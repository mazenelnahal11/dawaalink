import { api } from "./index";

export type AuditLogEntry = {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  pharmacyName: string;
  details: string;
};

export type FlaggedItem = {
  id: string;
  itemId: string;
  medicineName: string;
  batchNumber: string;
  pharmacyName: string;
  flaggedAt: string;
  reason: string;
};

export const getAuditLogs = async (params: { page?: number, size?: number }): Promise<AuditLogEntry[]> => {
  const query = new URLSearchParams(params as any).toString();
  const { data } = await api.get(`/admin/audit?${query}`);
  return data;
};

export const getFlaggedItems = async (): Promise<FlaggedItem[]> => {
  const { data } = await api.get(`/admin/flags`);
  return data;
};

export const unlockItem = async (itemId: string, authorizedReason: string): Promise<void> => {
  await api.post(`/admin/flags/${itemId}/unlock`, { reason: authorizedReason });
};

export const banPharmacy = async (pharmacyId: string, reason: string): Promise<void> => {
  await api.post(`/admin/pharmacy/${pharmacyId}/ban`, { reason });
};

export type PharmacyInfo = {
  id: string;
  commercialName: string;
  taxId: string;
  district: string;
  address: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
};

export const getPharmaciesByStatus = async (status: 'PENDING' | 'ACTIVE' | 'SUSPENDED'): Promise<PharmacyInfo[]> => {
  const { data } = await api.get(`/admin/pharmacies?status=${status}`);
  return data;
};

export const approvePharmacy = async (pharmacyId: string): Promise<void> => {
  await api.post(`/admin/pharmacies/${pharmacyId}/activate`);
};
