import CustomCamera from '@/components/camera/custom-camera';
import ImageAnalyzingModal from '@/components/camera/image-analyzing-modal';
import { useArticulos } from '@/hooks/useArticulos';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function ArmarioLayout() {
  const generateDetails = useArticulos((s) => s.generateDetails);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View className="flex-1">
      <Stack screenOptions={{ headerShown: false }} />
      <CustomCamera
        onTakeImage={(uri) => {
          setIsLoading(true);
          generateDetails(uri).then(() => {
            setIsLoading(false);
          });
        }}
        className="absolute bottom-5 right-5"
      />
      <ImageAnalyzingModal show={isLoading} />
    </View>
  );
}
