import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ presentation: "modal" }} />
      <Stack.Screen name="register" options={{ presentation: "modal" }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="maths" />
      <Stack.Screen name="chemistry" />
      <Stack.Screen name="biology" />
      <Stack.Screen name="physics" />
    </Stack>
  );
}