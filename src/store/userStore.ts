import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  fullName: string | null;
  email: string | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (user: { fullName?: string; email: string; token: string }) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      fullName: null,
      email: null,
      token: null,
      isLoggedIn: false,

      login: ({ fullName, email, token }) =>
        set({
          fullName: fullName || null,
          email,
          token,
          isLoggedIn: true,
        }),

      logout: () =>
        set({
          fullName: null,
          email: null,
          token: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: 'user-storage', // key in localStorage
    },
  ),
);
