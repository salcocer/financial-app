import { formatCurrency } from '@/lib/utlis';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';

const UpcomingSubscriptionCard = ({
    name,
    price,
    currency,
    daysLeft,
    icon,
}: UpcomingSubscriptionCardProps) => {
    const { t } = useTranslation();
    return (
        <View className="upcoming-card">
            <View className="upcoming-row">
                <Image source={icon} className="upcoming-icon" />
                <View>
                    <Text className="upcoming-price">{formatCurrency(price, currency)}</Text>
                    <Text className="upcoming-meta" numberOfLines={1}>
                        {daysLeft > 1
                            ? t('upcomingCard.daysLeft', { count: daysLeft })
                            : t('upcomingCard.lastDay')}
                    </Text>
                </View>
            </View>

            <Text className="upcoming-name" numberOfLines={1}>
                {name}
            </Text>
        </View>
    );
};

export default UpcomingSubscriptionCard;
