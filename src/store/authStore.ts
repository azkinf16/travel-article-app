import { create } from "zustand";

interface AuthState {
  user: { id: string; username: string } | null;
  token: string | null;
  setUser: (user: { id: string; username: string }, token: string) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user, token) => set({ user, token }),
  clearUser: () => set({ user: null, token: null }),
}));
