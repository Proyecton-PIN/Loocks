import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

export default function RootLayout() {
  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: '#000',
          },
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTitle: 'loocks',
          headerTitleStyle: {
            color: 'white',
            fontSize: 30,
            fontWeight: 'semibold',
          },
        }}
      />
    </View>
  );
}
