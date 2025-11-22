import { AddIcon, IAIcon } from '@/constants/icons';
import { Colors } from '@/constants/theme';
import { Outfit } from '@/lib/domain/models/outift';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import OutfitCard from './outfit-card';

interface Props {
  data: Partial<Outfit>;
}

export default function SuggestedOutfitCard({ data }: Props) {
  return (
    <View
      className="w-[210] rounded-xl p-[10]"
      style={{ backgroundColor: Colors.white }}
    >
      <OutfitCard data={data} className="h-[260] w-[210]" />
      <View
        className="flex-row h-[50] justify-between 
        items-end rounded-xl overflow-clip"
      >
        <Pressable
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
        <IAIcon />
      </View>
    </View>
  );
}
