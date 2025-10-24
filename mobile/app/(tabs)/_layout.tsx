import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 15,
          width: '95%',                    
          marginRight: '2%',
          paddingTop: 10,
          marginLeft: '2%',      
          elevation: 5,                  
          backgroundColor: '#111',        
          borderRadius: 25,               
          height: 70,                     
          paddingBottom: Platform.OS === 'ios' ? 5 : 0,
          shadowColor: 'white',       
          shadowOpacity: 0.25,
          shadowOffset: { width: 0, height: 5 },
          shadowRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarActiveTintColor: '#CFF018',
        tabBarInactiveTintColor: '#5539F7',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'principal') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'armario') iconName = focused ? 'cube' : 'cube-outline';
          else if (route.name === 'calendario') iconName = focused ? 'calendar' : 'calendar-outline';

          return <Ionicons name={iconName as any} size={26} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginBottom: 0,             // labels pegados al icono
        },
      })}
    >
      <Tabs.Screen name="principal" options={{ title: 'Principal' }} />
      <Tabs.Screen name="armario" options={{ title: 'Armario' }} />
      <Tabs.Screen name="calendario" options={{ title: 'Calendario' }} />
    </Tabs>
  );
}
