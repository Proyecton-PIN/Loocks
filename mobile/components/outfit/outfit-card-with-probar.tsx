import CustomCamera from '@/components/camera/custom-camera';
import ImageAnalyzingModal from '@/components/camera/image-analyzing-modal';
import { useOutfit } from '@/hooks/useOutfits';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import OutfitCard from './outfit-card';

interface Props {
  data: any;
  outfit: any;
  index: number;
}

export default function OutfitCardWithProbar({
  data,
  outfit,
  index,
}: Props) {
  const probarEnAvatar = useOutfit((s) => s.probarEnAvatar);
  const [isLoading, setIsLoading] = useState(false);

  const handleProbarOutfit = (uri: string) => {
    if (!outfit?.articulos || outfit.articulos.length === 0) return;
    setIsLoading(true);
    probarEnAvatar(uri, outfit.articulos).then((_) => setIsLoading(false));
  };

  return (
    <View style={{ height: 310}}>
      <Pressable
        onPress={() => {
          useOutfit.getState().selectOutfit?.(data);
          router.push('/ver-outfit' as any);
        }}
      >
        <OutfitCard
          data={outfit}
          className="h-[260]"
        />
      </Pressable>

      <View className="flex-row items-center justify-between pt-2">
        <Text className="text-sm text-gray-600">
          {data.fechaInicio.toDateString()}
        </Text>
        
        <CustomCamera
          onTakeImage={handleProbarOutfit}
          trigger={(solicitarPermisos) => (
            <Pressable onPress={solicitarPermisos} className="p-2">
              <Ionicons name="sparkles" size={18} color="#5639F8" />
            </Pressable>
          )}
        />
      </View>

      <ImageAnalyzingModal show={isLoading} text="Generando vista previa" />
    </View>
  );
}
