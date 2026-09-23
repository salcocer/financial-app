import { useAuth, useUser } from '@clerk/expo';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Settings = () => {
    const { signOut } = useAuth();
    const { user } = useUser();

    const initial = (
        user?.firstName?.charAt(0) ??
        user?.primaryEmailAddress?.emailAddress?.charAt(0) ??
        '?'
    ).toUpperCase();
    const displayName = user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Account';

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className="list-title mb-5">Settings</Text>

            <View className="settings-user-card">
                <View className="settings-user-avatar">
                    <Text className="settings-user-initial">{initial}</Text>
                </View>
                <View className="min-w-0 flex-1">
                    <Text numberOfLines={1} className="settings-user-name">
                        {displayName}
                    </Text>
                    {user?.primaryEmailAddress?.emailAddress && (
                        <Text numberOfLines={1} className="settings-user-email">
                            {user.primaryEmailAddress.emailAddress}
                        </Text>
                    )}
                </View>
            </View>

            <TouchableOpacity
                className="settings-signout-button"
                onPress={handleSignOut}
                activeOpacity={0.85}>
                <Text className="settings-signout-text">Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Settings;
