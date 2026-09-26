import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Subscriptions = () => {
    const { t } = useTranslation();
    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className="text-xl font-bold text-success">{t('subscriptions.title')}</Text>
        </SafeAreaView>
    );
};

export default Subscriptions;
