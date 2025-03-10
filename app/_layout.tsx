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
      <Stack.Screen name="index" options={{ title: "Index" }} />
      <Stack.Screen name="Landing" options={{ title: "Landing" }} />
      <Stack.Screen name="Register" options={{ title: "Register" }} />
      <Stack.Screen name="quadra_screens/screen1" options={{ title: "Quadra Screen 1" }} />
      <Stack.Screen name="quadra_screens/screen2" options={{ title: "Quadra Screen 2" }} />
      <Stack.Screen name="quadra_screens/screen3" options={{ title: "Quadra Screen 3" }} />
    </Stack>
  );
}
