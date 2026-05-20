import { api } from "./index";
import type { SwapStatus } from "../components/StatusChip";

export type DashboardKPI = {
  totalItemsListed: number;
  matchesThisWeek: number;
  totalSwapsCompleted: number;
  estimatedValueRecoveredEGP: number;
};

export type NearExpiryItem = {
  id: string;
  medicineName: string;
  batchNumber: string;
  quantityAvailable: number;
  unit: string;
  expiryDate: string;
  daysToExpiry: number;
};

export type SwapCycle = {
  cycleId: string;
  status: SwapStatus;
  createdAt: string;
  partnerPharmacyName: string;
  medicineName: string;
  quantity: number;
  direction: 'SENT' | 'RECEIVED';
  batchNumber: string;
};

export const getDashboardKPI = async (): Promise<DashboardKPI> => {
  const { data } = await api.get('/dashboard');
  return data;
};

export const getNearExpiry = async (threshold: number = 90): Promise<NearExpiryItem[]> => {
  const { data } = await api.get(`/inventory/near-expiry?threshold=${threshold}`);
  return data;
};

export const getActiveMatches = async (): Promise<SwapCycle[]> => {
  const { data } = await api.get('/swaps?status=PENDING&status=PARTIAL_ACCEPT');
  return data;
};

export const getRecentHistory = async (): Promise<SwapCycle[]> => {
  const { data } = await api.get('/swaps?limit=10&sort=createdAt,desc');
  return data;
};

export const exportInventoryReport = async (format: 'csv' | 'pdf' = 'pdf') => {
  const endpoint = format === 'pdf' ? '/reports/inventory/pdf' : '/reports/inventory';
  const response = await api.get(endpoint, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `inventory_report.${format}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
