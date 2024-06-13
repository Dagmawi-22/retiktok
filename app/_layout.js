import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Layout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "index") {
            iconName = "home-outline";
          } else if (route.name === "video") {
            iconName = "play-circle-outline";
          } else if (route.name === "profile") {
            iconName = "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#000",
          shadowOpacity: 0,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 5,
          width: "125%",
        },
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="video" options={{ headerShown: false }} />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
};

export default Layout;
