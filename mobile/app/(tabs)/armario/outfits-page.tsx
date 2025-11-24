import OutfitCard from '@/components/outfit/outfit-card';
import SuggestedOutfitsRow from '@/components/outfit/suggested-outfits-row';
import { useOutfit } from '@/hooks/useOutfits';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';

export default function OutfitsPage() {
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
          <SuggestedOutfitsRow />
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
        <View className="flex-1">
          <OutfitCard
            data={e.item.outfit}
            className={clsx(
              'flex-1 h-[260]',
              e.index % 1 === 1 ? 'ml-[5]' : 'mr-[5]',
            )}
          />
          <Text className="py-2">{e.item.fechaInicio.toDateString()}</Text>
        </View>
      )}
    />
  );
}
