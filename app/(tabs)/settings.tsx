import images from '@/constants/images';
import { useUserStore } from '@/lib/store/userStore';
import { useAuth, useUser } from '@clerk/expo';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Settings = () => {
    const { signOut } = useAuth();
    const { user } = useUser();
    const username = useUserStore(state => state.username);
    const imageUrl = useUserStore(state => state.imageUrl);
    const clearUser = useUserStore(state => state.clearUser);

    const displayName = username || user?.primaryEmailAddress?.emailAddress || 'Account';

    const handleSignOut = async () => {
        await signOut();
        clearUser();
    };

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className="list-title mb-5">Settings</Text>

            <View className="settings-user-card">
                <View className="settings-user-avatar">
                    <Image
                        source={imageUrl ? { uri: imageUrl } : images.avatar}
                        className="home-avatar"
                    />
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
                activeOpacity={0.85}
            >
                <Text className="settings-signout-text">Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Settings;
