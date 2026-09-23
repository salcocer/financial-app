import '@/global.css';
import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function AuthLayout() {
    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) {
        return <View className="auth-loading-screen" />;
    }

    if (isSignedIn) {
        return <Redirect href="/" />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}
