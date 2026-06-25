import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Category } from '@/constants/categories';

interface CategoriesState {
  selected: Category[];
  isHydrated: boolean;
  toggleCategory: (category: Category) => void;
  clearCategories: () => void;
  setHydrated: () => void;
}

export const useCategoriesStore = create<CategoriesState>()(
  persist(
    (set, get) => ({
      selected: [],
      isHydrated: false,
      toggleCategory: (category) => {
        const current = get().selected;
        const exists = current.some((c) => c.id === category.id);
        if (exists) {
          set({ selected: current.filter((c) => c.id !== category.id) });
        } else {
          set({ selected: [...current, category] });
        }
      },
      clearCategories: () => set({ selected: [] }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'super-app-categories',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
