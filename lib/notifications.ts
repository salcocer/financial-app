import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const PROFILE_REMINDER_SCREEN = 'subscriptions';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export async function ensureAndroidChannel() {
    if (Platform.OS !== 'android') return;

    await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.DEFAULT,
    });
}

export async function requestNotificationPermissions(): Promise<boolean> {
    if (!Device.isDevice) return false;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    if (existingStatus === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

export async function scheduleProfileReminderNotification() {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return false;

    await ensureAndroidChannel();

    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Finly',
            body: 'Continue with your profile...',
            data: { screen: PROFILE_REMINDER_SCREEN },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 5,
            repeats: false,
        },
    });

    return true;
}
