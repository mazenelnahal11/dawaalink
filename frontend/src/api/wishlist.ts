import { api } from "./index";

export type WishlistItem = {
  id: string;
  medicineName: string;
  gtin: string;
  quantityNeeded: number;
  minAcceptableExpiry: string;
};

export const getWishlist = async (): Promise<WishlistItem[]> => {
  const { data } = await api.get('/wishlist');
  return data;
};

export const addToWishlist = async (payload: { gtin?: string; medicineName: string; quantityNeeded: number; minAcceptableExpiry?: string }): Promise<WishlistItem> => {
  const { data } = await api.post('/wishlist', payload);
  return data;
};

export const removeFromWishlist = async (id: string): Promise<void> => {
  await api.delete(`/wishlist/${id}`);
};
