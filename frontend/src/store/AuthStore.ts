import { create } from 'zustand';

interface User {
  id: string;
  pharmacyId: string;
  pharmacyStatus: 'PENDING' | 'ACTIVE' | 'FLAGGED';
  name: string;
  email: string;
  role: 'OWNER' | 'PHARMACIST' | 'EMPLOYEE' | 'ADMIN';
  pharmacyName?: string;
  district?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// In-memory store logic
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));

export const getAuthToken = () => useAuthStore.getState().token;
export const logout = () => useAuthStore.getState().logout();
