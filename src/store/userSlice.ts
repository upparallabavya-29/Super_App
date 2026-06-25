import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/user.types';

interface UserState {
  user: User | null;
  registeredUsers: User[];
  isHydrated: boolean;
  setUser: (user: User) => void;
  registerUser: (user: User) => void;
  clearUser: () => void;
  setHydrated: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      registeredUsers: [],
      isHydrated: false,
      setUser: (user) => set({ user }),
      registerUser: (user) => set((state) => ({
        user,
        registeredUsers: [...state.registeredUsers.filter(u => u.email !== user.email && u.username !== user.username), user]
      })),
      clearUser: () => set({ user: null }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'super-app-user',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
