import OutfitCard from '@/components/outfit/outfit-card';
import SuggestedOutfitCard from '@/components/outfit/suggested-outfit-card';
import { useOutfit } from '@/hooks/useOutfits';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';

export default function OutfitsPage() {
  const suggestions = useOutfit((s) => s.suggested);
  const logs = useOutfit((s) => s.logs);
  const loadOutfits = useOutfit((s) => s.loadOutfits);

  useEffect(() => {
    loadOutfits();
  }, []);

  return (
    <FlatList
      className="flex-1"
      contentContainerClassName="px-5"
      ListHeaderComponent={
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
          <Text
            style={{
              fontFamily: 'Satoshi',
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: 0,
              marginTop: 30,
              marginBottom: 12,
            }}
          >
            {logs.length} Outfits
          </Text>
        </View>
      }
      data={logs}
      numColumns={2}
      nestedScrollEnabled
      ItemSeparatorComponent={(_) => <View className="h-10" />}
      renderItem={(e) => (
        <View
          className={clsx(
            'bg-red-500 flex-1',
            e.index % 1 === 1 ? 'ml-[5]' : 'mr-[5]',
          )}
        >
          <OutfitCard data={e.item} className="h-[260]" />
        </View>
      )}
    />
  );
}
