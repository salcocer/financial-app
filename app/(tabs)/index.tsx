import ListHeading from '@/components/ListHeading';
import SubscriptionCard from '@/components/SubscriptionCard';
import UpcomingSubscriptionCard from '@/components/UpcomingSubscriptionCard';
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, UPCOMING_SUBSCRIPTIONS } from '@/constants/data';
import { icons } from '@/constants/icons';
import images from '@/constants/images';
import { useUserStore } from '@/lib/store/userStore';
import { formatCurrency } from '@/lib/utlis';
import BalanceWidget from '@/widgets/BalanceWidget';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
    const { t } = useTranslation();
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
    const username = useUserStore(state => state.username);
    const imageUrl = useUserStore(state => state.imageUrl);
    const displayName = username || t('home.defaultGreetingName');

    // Keep the home screen widget in sync with the balance shown here
    useEffect(() => {
        BalanceWidget.updateSnapshot({
            label: t('home.balanceLabel'),
            amount: formatCurrency(HOME_BALANCE.amount),
        });
    }, [t]);

    return (
        <SafeAreaView className="flex-1 bg-background  p-5">
            <FlatList
                ListHeaderComponent={() => (
                    <>
                        <View className="home-header">
                            <View className="home-user">
                                <Image
                                    source={imageUrl ? { uri: imageUrl } : images.avatar}
                                    className="home-avatar"
                                />
                                <Text className="home-user-name">{displayName}</Text>
                            </View>
                            <Image source={icons.add} className="home-add-icon" />
                        </View>

                        <View className="home-balance-card">
                            <Text className="home-balance-label">{t('home.balanceLabel')}</Text>
                            <View className="home-balance-row">
                                <Text className="home-balance-amount">
                                    {formatCurrency(HOME_BALANCE.amount)}
                                </Text>
                                <Text className="home-balance-date">
                                    {dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}
                                </Text>
                            </View>
                        </View>

                        <View className="mb-5">
                            <ListHeading title={t('home.upcomingSectionTitle')} />
                            <FlatList
                                horizontal
                                data={UPCOMING_SUBSCRIPTIONS}
                                keyExtractor={item => item.name}
                                renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
                                showsHorizontalScrollIndicator={false}
                                ListEmptyComponent={() => (
                                    <Text className="text-center text-gray-500">
                                        {t('home.noUpcomingSubscriptions')}
                                    </Text>
                                )}
                            />
                        </View>

                        <ListHeading title={t('home.allSubscriptionsSectionTitle')} />
                    </>
                )}
                data={HOME_SUBSCRIPTIONS}
                keyExtractor={item => item.id}
                extraData={expandedSubscriptionId} // Ensure the list re-renders when expandedSubscriptionId changes
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pb-20"
                ItemSeparatorComponent={() => <View className="h-2" />} // Add spacing between items
                ListEmptyComponent={() => (
                    <Text className="text-center text-gray-500">{t('home.noSubscriptions')}</Text>
                )}
                renderItem={({ item }) => (
                    <SubscriptionCard
                        {...item}
                        expanded={expandedSubscriptionId === item.id}
                        onPress={() =>
                            setExpandedSubscriptionId(currentId =>
                                currentId === item.id ? null : item.id
                            )
                        }
                    />
                )}
            />
        </SafeAreaView>
    );
}
