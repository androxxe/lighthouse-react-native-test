import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import twrnc from "twrnc";

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: twrnc.color("purple-500"),
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          tabBarLabel: "Today",
          tabBarIcon: ({ focused }) => (
            <Feather name="home" size={20} color={focused ? twrnc.color("purple-500") : twrnc.color("slate-500")} />
          ),
        }}
      />
      <Tabs.Screen
        name="upcoming"
        options={{
          tabBarLabel: "Upcoming",
          tabBarIcon: ({ focused }) => (
            <Feather name="calendar" size={20} color={focused ? twrnc.color("purple-500") : twrnc.color("slate-500")} />
          ),
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          tabBarLabel: "Browse",
          tabBarIcon: ({ focused }) => (
            <Feather name="search" size={20} color={focused ? twrnc.color("purple-500") : twrnc.color("slate-500")} />
          ),
        }}
      />
    </Tabs>
  );
}
