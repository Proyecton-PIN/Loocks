import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function ArmarioLayout() {
  return (
    <View className="flex-1 bg-[#F3F3F3]">
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
