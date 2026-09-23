import { formatCurrency, formatStatusLabel, formatSubscriptionDateTime } from '@/lib/utlis';
import clsx from 'clsx';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SubscriptionCard = ({
    name,
    price,
    currency,
    icon,
    billing,
    color,
    category,
    plan,
    renewalDate,
    onPress,
    expanded,
    paymentMethod,
    startDate,
    status,
}: SubscriptionCardProps) => {
    return (
        <AnimatedPressable
            layout={LinearTransition.duration(250)}
            onPress={onPress}
            className={clsx('sub-card', expanded ? 'sub-card-expanded' : 'bg-card')}
            style={!expanded && color ? { backgroundColor: color } : undefined}>
            <View className="sub-head">
                <View className="sub-main">
                    <Image source={icon} className="sub-icon" />
                    <View className="sub-copy">
                        <Text numberOfLines={1} className="sub-title">
                            {name}
                        </Text>
                        <Text numberOfLines={1} className="sub-meta" ellipsizeMode="tail">
                            {category?.trim() ||
                                plan?.trim() ||
                                (renewalDate ? formatSubscriptionDateTime(renewalDate) : '')}
                        </Text>
                    </View>
                </View>

                <View className="sub-price-box">
                    <Text className="sub-price">{formatCurrency(price, currency)}</Text>
                    <Text className="sub-billing">{billing}</Text>
                </View>
            </View>

            {expanded && (
                <Animated.View
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(150)}
                    className="sub-bdy">
                    <View className="sub-detail">
                        <View className="sub-row">
                            <Text className="sub-label">Payment: </Text>
                            <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                                {paymentMethod?.trim()}
                            </Text>
                        </View>
                        <View className="sub-row">
                            <Text className="sub-label">Category: </Text>
                            <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                                {category?.trim() || plan?.trim()}
                            </Text>
                        </View>
                        <View className="sub-row">
                            <Text className="sub-label">Started: </Text>
                            <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                                {startDate ? formatSubscriptionDateTime(startDate) : ''}
                            </Text>
                        </View>
                        <View className="sub-row">
                            <Text className="sub-label">Renewal: </Text>
                            <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                                {renewalDate ? formatSubscriptionDateTime(renewalDate) : ''}
                            </Text>
                        </View>
                        <View className="sub-row">
                            <Text className="sub-label">Status: </Text>
                            <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                                {status ? formatStatusLabel(status) : ''}
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            )}
        </AnimatedPressable>
    );
};

export default SubscriptionCard;
