import UserProfileSync from '@/components/UserProfileSync';
import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import '@/global.css';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

if (!publishableKey) {
    throw new Error(
        'Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add your key to .env.local.\nRun: 1) clerk auth login  2) clerk link  3) clerk env pull — then restart the dev server.'
    );
}

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        'sans-bold': require('@/assets/fonts/PlusJakartaSans-Bold.ttf'),
        'sans-light': require('@/assets/fonts/PlusJakartaSans-Light.ttf'),
        'sans-medium': require('@/assets/fonts/PlusJakartaSans-Medium.ttf'),
        'sans-regular': require('@/assets/fonts/PlusJakartaSans-Regular.ttf'),
        'sans-semibold': require('@/assets/fonts/PlusJakartaSans-SemiBold.ttf'),
        'sans-extra-bold': require('@/assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
            <UserProfileSync />
            <Stack screenOptions={{ headerShown: false }} />
        </ClerkProvider>
    );
}
