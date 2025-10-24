import { Tabs } from 'expo-router';


export default function TabLayout() {
  return (
     <Tabs
      screenOptions={{
        headerShown: false,       // Oculta el header automático de cada tab
        tabBarStyle: { backgroundColor: '#000' }, // Fondo negro en la barra inferior
        tabBarActiveTintColor: '#fff',            // Color activo (opcional)
        tabBarInactiveTintColor: '#888',          // Color inactivo (opcional)
      }}
    >
      <Tabs.Screen  name="principal" options={{ title: 'Principal' }} />
      <Tabs.Screen name="armario" options={{ title: 'Armario' }} />
      <Tabs.Screen name="calendario" options={{ title: 'Calendario' }} />
    </Tabs>
  );
}
