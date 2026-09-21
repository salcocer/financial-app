import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SignIn = () => {
  return (
    <View>
      <Text>Sign-in</Text>
      <Link href="/(auth)/sign-up">Create Account</Link>
    </View>
  );
};

export default SignIn;

// Because auth folder is wrapped in parentheses, the word auth will never appear in the URL.
// These routes will resolve directly to sign in and sign up pages.
// These parenteheses are purely for organization and will not affect the URL structure.

// Layouts --> Group
// Expo router uses stack navigation by default and each layout adds its own header.
// we can also create a layout specifically for the auth group.
// To remove the header from the sign in and sign up pages.
