// app/_layout.js
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Layout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "index") {
            iconName = "home";
          } else if (route.name === "video") {
            iconName = "play-circle";
          } else if (route.name === "profile") {
            iconName = "person";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
        showLabel: false,
      }}
    />
  );
};

export default Layout;
