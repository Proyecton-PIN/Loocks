import { useOutfit } from '@/hooks/useOutfits';
import React, { useEffect } from 'react';
import { BackHandler, Image, Modal, Pressable, Text, View } from 'react-native';

export default function ProbadorOutfitModal() {
  const isOpenProbadorOutfit = useOutfit((s) => s.isOpenProbadorOutfit);
  const outfitProbadoImg = useOutfit((s) => s.outfitProbadoImg);
  const unSelectProbarEnAvatar = useOutfit((s) => s.unSelectProbarEnAvatar);

  console.log(outfitProbadoImg);

  useEffect(() => {
    const onBackPress = () => {
      unSelectProbarEnAvatar();
      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => subscription.remove();
  }, []);

  return (
    <Modal visible={isOpenProbadorOutfit} animationType="slide">
      <View className="items-center justify-center flex-1">
        <Image
          source={{ uri: `data:image/png;base64,${outfitProbadoImg}` }}
          style={{
            width: 300,
            height: 500,
          }}
        />
        <Pressable
          className="p-2 bg-red-500 rounded-xl mt-10"
          onPress={unSelectProbarEnAvatar}
        >
          <Text className="text-white">Cerrar</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
