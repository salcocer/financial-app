import { scheduleProfileReminderNotification } from '@/lib/notifications';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Subscriptions = () => {
    const { t } = useTranslation();

    const handleSendNotification = async () => {
        await scheduleProfileReminderNotification();
    };

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className="text-xl font-bold text-success">{t('subscriptions.title')}</Text>

            <TouchableOpacity
                className="subscriptions-notify-button"
                onPress={handleSendNotification}
                activeOpacity={0.85}
            >
                <Text className="subscriptions-notify-text">
                    {t('subscriptions.sendNotification')}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Subscriptions;
