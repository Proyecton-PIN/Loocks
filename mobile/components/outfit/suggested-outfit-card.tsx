import { AddIcon, IAIcon } from '@/constants/icons';
import { Colors } from '@/constants/theme';
import { useOutfit } from '@/hooks/useOutfits';
import { Outfit } from '@/lib/domain/models/outfits';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import CustomCamera from '../camera/custom-camera';
import ImageAnalyzingModal from '../camera/image-analyzing-modal';
import OutfitCard from './outfit-card';

interface Props {
  data: Partial<Outfit>;
}

export default function SuggestedOutfitCard({ data }: Props) {
  const createOutfit = useOutfit((s) => s.createOutfit);
  const probarEnAvatar = useOutfit((s) => s.probarEnAvatar);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View
      className="w-[210] rounded-xl p-[10]"
      style={{ backgroundColor: Colors.white }}
    >
      <OutfitCard data={data} className="h-[260] w-full" />
      <View
        className="flex-row h-[50] justify-between 
        items-end rounded-xl overflow-clip "
      >
        <Pressable
          onPress={() => createOutfit(data)}
          className="rounded-xl flex-row items-center 
            justify-between gap-4 h-[36] w-[100]"
          style={{
            borderColor: Colors.gray,
            borderWidth: 2,
            paddingHorizontal: 16,
          }}
        >
          <Text style={{ color: Colors.muted }}>Añadir</Text>
          <AddIcon size={13} color={Colors.muted} />
        </Pressable>
        <CustomCamera
          onTakeImage={(uri) => {
            if (!uri) return;
            if (!data.articulos || data.articulos.length === 0) return;
            setIsLoading(true);
            probarEnAvatar(uri, data.articulos).then((_) =>
              setIsLoading(false),
            );
          }}
          trigger={(solicitarPermisos) => (
            <Pressable onPress={solicitarPermisos}>
              <IAIcon />
            </Pressable>
          )}
        />
      </View>
      <ImageAnalyzingModal show={isLoading} text="Generando vista previa" />
    </View>
  );
}
