import { useOutfit } from '@/hooks/useOutfits';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import SuggestedOutfitCard from './suggested-outfit-card';

export default function SuggestedOutfitsRow() {
  const suggestions = useOutfit((s) => s.suggested);

  return (
    <View>
      <Text
        style={{
          fontFamily: 'Satoshi',
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: 0,
          marginBottom: 12,
        }}
      >
        Sugerencias
      </Text>
      <FlatList
        ItemSeparatorComponent={() => <View className="w-5" />}
        data={suggestions}
        horizontal
        renderItem={(e) => <SuggestedOutfitCard data={e.item} />}
      />
    </View>
  );
}
