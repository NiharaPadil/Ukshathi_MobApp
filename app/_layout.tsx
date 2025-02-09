import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false, // Hide the header for all screens by default
      }}
    >
      {/* Define screens here */}
      <Stack.Screen name="Landing" options={{ title: "Landing" }} />
      <Stack.Screen name="Register" options={{ title: "Register" }} />
      <Stack.Screen name="Quadra_nodes" options={{ title: "Quadra_nodes" }} />
    </Stack>
  );
}
