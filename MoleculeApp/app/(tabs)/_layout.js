import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: { position: "absolute" },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index" // This corresponds to index.js file
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chatbot" // This would be chatbot.js or chatbot/index.js
        options={{
          title: "Chatbot",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="chatbubble-ellipses" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="news" // This would be news.js or news/index.js
        options={{
          title: "News",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="newspaper" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile" // This would be profile.js or profile/index.js
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="person-circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}