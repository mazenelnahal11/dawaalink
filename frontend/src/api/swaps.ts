import { api } from "./index";
import { type SwapTicketDTO } from "../components/SwapTicketCard";
import { type SwapCycle } from "./dashboard";

export const getSwaps = async (params: { status?: string, limit?: number, sort?: string, from?: string, to?: string, page?: number, size?: number }): Promise<SwapCycle[]> => {
  const query = new URLSearchParams(params as any).toString();
  const { data } = await api.get(`/swaps?${query}`);
  return data;
};

export const getSwapTicket = async (cycleId: string): Promise<SwapTicketDTO> => {
  const { data } = await api.get(`/swaps/${cycleId}/ticket`);
  return data;
};

export const acceptSwap = async (cycleId: string): Promise<void> => {
  await api.post(`/swaps/${cycleId}/accept`);
};

export const declineSwap = async (cycleId: string): Promise<void> => {
  await api.post(`/swaps/${cycleId}/decline`);
};

export const confirmReceipt = async (cycleId: string): Promise<void> => {
  await api.post(`/swaps/${cycleId}/confirm-receipt`);
};

export const downloadSwapRecord = async (cycleId: string): Promise<Blob> => {
  const { data } = await api.get(`/swaps/${cycleId}/record`, { responseType: 'blob' });
  return data;
};
