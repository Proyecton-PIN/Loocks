import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

export default function RootLayout() {
  return (
    <View className="flex-1">
      <StatusBar style="auto" />
      <Stack />
    </View>
  );
}
