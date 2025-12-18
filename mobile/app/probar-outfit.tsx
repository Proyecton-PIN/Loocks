import CustomCamera from '@/components/camera/custom-camera';
import ImageAnalyzingModal from '@/components/camera/image-analyzing-modal';
import OutfitCard from '@/components/outfit/outfit-card';
import { Colors } from '@/constants/theme';
import { useOutfit } from '@/hooks/useOutfits';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, Text, View } from 'react-native';

export default function ProbarOutfitScreen() {
  const router = useRouter();
  const logs = useOutfit((s) => s.logs);
  const loadOutfits = useOutfit((s) => s.loadOutfits);
  const probarEnAvatar = useOutfit((s) => s.probarEnAvatar);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOutfitIndex, setSelectedOutfitIndex] = useState<number | null>(
    null
  );
  const [showCamera, setShowCamera] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadOutfits();
    }, [loadOutfits])
  );

  const handleProbarOutfit = (uri: string) => {
    if (selectedOutfitIndex === null) return;
    const outfit = logs[selectedOutfitIndex];
    if (!outfit.outfit?.articulos || outfit.outfit.articulos.length === 0)
      return;

    setIsLoading(true);
    probarEnAvatar(uri, outfit.outfit.articulos).then((_) =>
      setIsLoading(false)
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors.white }}>
      <View className="flex-1">
        <View className="flex-row items-center pt-[60px] px-5 py-6 border-b border-gray-200">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <View className="flex-1 ml-4">
            <Text
              style={{
                fontFamily: 'Satoshi',
                fontWeight: '700',
                fontSize: 24,
              }}
            >
              Elige un outfit
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Selecciona un outfit y hazte una foto para probártelo
            </Text>
          </View>
        </View>

        <FlatList
          className="flex-1"
          contentContainerClassName="px-5 py-4"
          data={logs}
          numColumns={2}
          ItemSeparatorComponent={() => <View className="h-4" />}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => setSelectedOutfitIndex(index)}
              className="flex-1 rounded-xl overflow-hidden"
              style={{
                opacity: selectedOutfitIndex === index ? 1 : 0.6,
                borderWidth: selectedOutfitIndex === index ? 3 : 0,
                borderColor:
                  selectedOutfitIndex === index ? Colors.primary : 'transparent',
              }}
            >
              <OutfitCard data={item.outfit} className="h-[180]" />
              <View className="bg-white px-3 py-2">
                <Text className="text-xs text-gray-500">
                  {item.fechaInicio.toDateString()}
                </Text>
              </View>
            </Pressable>
          )}
        />

        {selectedOutfitIndex !== null && (
          <View className="px-5 pb-4 gap-3">
            <CustomCamera
              onTakeImage={handleProbarOutfit}
              trigger={(solicitarPermisos) => (
                <Pressable
                  onPress={() => {
                    solicitarPermisos();
                  }}
                  className="bg-purple-600 rounded-xl py-4 flex-row items-center justify-center gap-2"
                >
                  <Ionicons name="camera" size={20} color="white" />
                  <Text className="text-white font-semibold text-base">
                    Hacerte una foto
                  </Text>
                </Pressable>
              )}
            />
          </View>
        )}
      </View>

      <ImageAnalyzingModal show={isLoading} text="Generando vista previa" />
    </SafeAreaView>
  );
}
