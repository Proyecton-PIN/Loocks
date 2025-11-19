import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

export default function RootLayout() {
  return (
    <View className="flex-1 bg-[#F3F3F3]">
      <StatusBar style="dark" />
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName="inicio"
      />
    </View>
  );
}
