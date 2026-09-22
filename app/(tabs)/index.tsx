import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { formatCurrency } from "@/lib/utlis";
import dayjs from "dayjs";
import React, { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  return (
    <SafeAreaView className="flex-1  bg-background p-5">
      <View className="home-header">
        <View className="home-user">
          <Image source={images.avatar} className="home-avatar" />
          <Text className="home-user-name">{HOME_USER.name}</Text>
        </View>
        <Image source={icons.add} className="home-add-icon" />
      </View>

      <View className="home-balance-card">
        <Text className="home-balance-label">Balance</Text>
        <View className="home-balance-row">
          <Text className="home-balance-amount">
            {formatCurrency(HOME_BALANCE.amount)}
          </Text>
          <Text className="home-balance-date">
            {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
          </Text>
        </View>
      </View>

      <View>
        <ListHeading title="Upcoming Subscriptions" />
        {/* <UpcomingSubscriptionCard data={UPCOMING_SUBSCRIPTIONS[0]} /> */}
        <FlatList
          horizontal
          data={UPCOMING_SUBSCRIPTIONS}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text className="text-center text-gray-500">
              No upcoming subscriptions
            </Text>
          )}
        />
      </View>

      <View>
        <ListHeading title="All Subscriptions" />
        <SubscriptionCard
          {...HOME_SUBSCRIPTIONS[0]}
          expanded={expandedSubscriptionId === HOME_SUBSCRIPTIONS[0].id}
          onPress={() =>
            setExpandedSubscriptionId((currentId) =>
              currentId === HOME_SUBSCRIPTIONS[0].id
                ? null
                : HOME_SUBSCRIPTIONS[0].id,
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}
