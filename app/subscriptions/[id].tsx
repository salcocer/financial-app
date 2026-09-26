import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

const SubscriptionDetails = () => {
    const { t } = useTranslation();
    const { id } = useLocalSearchParams<{ id: string }>();
    return (
        <View>
            <Text>
                {t('subscriptionDetail.title')}: {id}
            </Text>
            <Link href="/">{t('subscriptionDetail.goBack')}</Link>
        </View>
    );
};

export default SubscriptionDetails;
