import { create } from 'zustand';

export type ToastPayload = {
  id: string;
  type: 'MATCH' | 'STATUS' | 'ALERT' | 'NEAR_EXPIRY';
  title: string;
  message: string;
  link?: string;
};

interface NotificationState {
  toasts: ToastPayload[];
  addToast: (toast: Omit<ToastPayload, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    // Auto dismiss after 5s
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, 5000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}));
