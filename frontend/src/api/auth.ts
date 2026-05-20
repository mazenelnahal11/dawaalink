import { api } from './index';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  pharmacyName: string;
  district: string;
  ownerName: string;
  commercialRegNo: string;
  pharmacistContact: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  pharmacyId: string;
  status: string;
  pharmacyName?: string;
  district?: string;
  profileImageUrl?: string;
}

export interface VerifyPayload {
  email: string;
  code: string;
}

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/login', payload);
  return data;
};

export const registerUser = async (payload: RegisterPayload): Promise<{ pharmacyId: string }> => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

export const verifyUser = async (payload: VerifyPayload): Promise<{ message: string }> => {
  const { data } = await api.post('/auth/verify', payload);
  return data;
};
