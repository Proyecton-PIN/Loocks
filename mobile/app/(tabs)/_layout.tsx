import { Tabs } from 'expo-router';
import '../../global.css';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false,tabBarStyle: { backgroundColor: '#000' } }}>
      <Tabs.Screen  name="principal" options={{ title: 'Principal' }} />
      <Tabs.Screen name="armario" options={{ title: 'Armario' }} />
      <Tabs.Screen name="calendario" options={{ title: 'Calendario' }} />
    </Tabs>
  );
}
