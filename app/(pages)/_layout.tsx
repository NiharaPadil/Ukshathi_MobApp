import { Stack } from 'expo-router';

export default function PagesLayout() {
  return (
    <Stack>
      <Stack.Screen name="Landing" />
      <Stack.Screen name="NotificationsScreen" />
      <Stack.Screen name="AboutUsScreen" />
      <Stack.Screen name="ContactScreen" />
      <Stack.Screen name="Queries" />
    </Stack>
  );
}
