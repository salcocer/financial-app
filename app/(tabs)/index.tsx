import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link
        href="/onboarding"
        className="mt-4 rounded bg-primary text-white p-4"
      >
        Go to Onboarding
      </Link>

      <Link
        href="/(auth)/sign-in"
        className="mt-4 rounded bg-primary text-white p-4"
      >
        Go to Sign In
      </Link>

      <Link
        href="/(auth)/sign-up"
        className="mt-4 rounded bg-primary text-white p-4"
      >
        Go to Sign Up
      </Link>

      <Link href="/subscriptions/spotify">Spotify Subscription</Link>

      <Link
        href={{
          pathname: "/subscriptions/[id]",
          params: { id: "claude-max" },
        }}
      >
        Claude Max Subscription
      </Link>
    </View>
  );
}

/*

# Expo Router

File-Based Routing. Files automatically become routes in your app. 
                    Create a file and it becomes a route. Create a folder and it becomes a route group.
                    app/onboarding.tsx  --->  /onboarding

Route Groups. Organize screens without affecting the URLs. 
                  (auth)/_layout.tsx
                        /SignIn
                        /SignUp

Stack Navigator. Screens share a common layout. 
                 Layouts that ley multiple screens share the same navigation parent. 
                 Every screen in a group inherits its layout. 


Bottom Tabs. Main screens live inside tab navigation. 
            The dynamic routes, that let one file handle many detail pages. 
            [id].tsx

Expo Router Link. Navigation Links. Navigate between screens using the Link component.
                  <Link href="/onboarding">Go to Onboarding</Link>

*/
