import { Link } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView className="flex-1  bg-background p-5">
      <Text className="text-5xl font-sans-extra-bold text-black">Home</Text>

      <Link
        href="/onboarding"
        className="mt-4 rounded bg-primary text-white p-4 font-sans-semibold"
      >
        Go to Onboarding
      </Link>

      <Link
        href="/(auth)/sign-in"
        className="mt-4 rounded bg-primary text-white p-4 font-sans-semibold"
      >
        Go to Sign In
      </Link>

      <Link
        href="/(auth)/sign-up"
        className="mt-4 rounded bg-primary text-white p-4 font-sans-semibold"
      >
        Go to Sign Up
      </Link>

      {/* <Link
        className="mt-4 rounded bg-primary text-white p-4 font-sans-semibold"
        href="/subscriptions/spotify"
      >
        Spotify Subscription
      </Link>

      <Link
        className="mt-4 rounded bg-primary text-white p-4 font-sans-semibold"
        href={{
          pathname: "/subscriptions/[id]",
          params: { id: "claude-max" },
        }}
      >
        Claude Max Subscription
      </Link> */}
    </SafeAreaView>
  );
}
