import { useOutfit } from '@/hooks/useOutfits';
import React, { useEffect } from 'react';
import { BackHandler, Image, Modal, View } from 'react-native';

export default function ProbadorOutfitModal() {
  const isOpenProbadorOutfit = useOutfit((s) => s.isOpenProbadorOutfit);
  const outfitProbadoImg = useOutfit((s) => s.outfitProbadoImg);
  const unSelectProbarEnAvatar = useOutfit((s) => s.unSelectProbarEnAvatar);

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
        <Image source={{ uri: `data:image/png;base64,${outfitProbadoImg}` }} />
      </View>
    </Modal>
  );
}
