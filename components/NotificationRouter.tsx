import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';

/**
 * Renders nothing. Routes the user to the screen named in a notification's
 * `data.screen` payload when they tap it — whether the app was already
 * running or was launched fresh by the tap.
 */
export default function NotificationRouter() {
    const response = Notifications.useLastNotificationResponse();

    useEffect(() => {
        if (!response) return;

        const screen = response.notification.request.content.data?.screen;
        if (screen === 'subscriptions') {
            router.push('/(tabs)/subscriptions');
        }

        Notifications.clearLastNotificationResponse();
    }, [response]);

    return null;
}
