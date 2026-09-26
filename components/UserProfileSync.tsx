import { useUserStore } from '@/lib/store/userStore';
import { useUser } from '@clerk/expo';
import { useEffect } from 'react';

/**
 * Renders nothing. Waits for the persisted user store to finish hydrating from
 * AsyncStorage and for Clerk to finish loading, then seeds the store from the
 * Clerk user only if no cached profile was found on disk.
 */
export default function UserProfileSync() {
    const { isLoaded: isClerkLoaded, user } = useUser();
    const hasHydrated = useUserStore(state => state.hasHydrated);
    const username = useUserStore(state => state.username);
    const setUser = useUserStore(state => state.setUser);

    useEffect(() => {
        if (!hasHydrated || !isClerkLoaded || !user) return;
        if (username) return;

        setUser({
            username:
                user.fullName ?? user.firstName ?? user.primaryEmailAddress?.emailAddress ?? null,
            imageUrl: user.imageUrl ?? null,
        });
    }, [hasHydrated, isClerkLoaded, user, username, setUser]);

    return null;
}
