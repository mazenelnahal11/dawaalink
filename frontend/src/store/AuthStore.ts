import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  pharmacyId: string;
  pharmacyStatus: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  name: string;
  email: string;
  role: 'OWNER' | 'PHARMACIST' | 'EMPLOYEE' | 'ADMIN';
  pharmacyName?: string;
  district?: string;
  profileImageUrl?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// Persistent store logic
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('dawaalink-auth');
      },
    }),
    {
      name: 'dawaalink-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const getAuthToken = () => useAuthStore.getState().token;
export const logout = () => useAuthStore.getState().logout();
