import { Link } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  return (
    <SafeAreaView className="flex-1  bg-background p-5">
      <Text>Sign-up</Text>
      <Link href="/(auth)/sign-in">Already have an account? Sign In</Link>
    </SafeAreaView>
  );
};

export default SignUp;
