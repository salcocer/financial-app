import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserProfile {
    username: string | null;
    imageUrl: string | null;
}

interface UserStore extends UserProfile {
    hasHydrated: boolean;
    setUser: (profile: UserProfile) => void;
    clearUser: () => void;
    setHasHydrated: (hasHydrated: boolean) => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        set => ({
            username: null,
            imageUrl: null,
            hasHydrated: false,
            setUser: profile => set(profile),
            clearUser: () => set({ username: null, imageUrl: null }),
            setHasHydrated: hasHydrated => set({ hasHydrated }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: state => ({ username: state.username, imageUrl: state.imageUrl }),
            onRehydrateStorage: () => state => {
                state?.setHasHydrated(true);
            },
        }
    )
);
