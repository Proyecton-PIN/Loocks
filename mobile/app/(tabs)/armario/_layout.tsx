import CustomCamera from '@/components/camera/custom-camera';
import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function ArmarioLayout() {
  return (
    <View className="flex-1">
      <Stack screenOptions={{ headerShown: false }} />
      <CustomCamera
        onTakeImage={() => {}}
        className="absolute bottom-5 right-5"
      />
    </View>
  );
}
