import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={() => ({
        sceneStyle: {
          backgroundColor: '#000',
        },
        headerShown: false,
        tabBarActiveBackgroundColor: '#111',
        tabBarStyle: {
          paddingTop: 10,
          backgroundColor: '#111',
          height: 70,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 0,
          borderColor: 'transparent',
        },
        tabBarActiveTintColor: '#CFF018',
        tabBarInactiveTintColor: '#5539F7',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginBottom: 0, // labels pegados al icono
        },
      })}
    >
      <Tabs.Screen
        name="calendario"
        options={{
          title: 'Calendario',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="principal"
        options={{
          title: 'Principal',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="armario"
        options={{
          title: 'Armario',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
