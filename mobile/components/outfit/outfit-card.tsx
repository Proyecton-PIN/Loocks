import { Colors } from '@/constants/theme';
import { Outfit } from '@/lib/domain/models/outfits';
import clsx from 'clsx';
import React from 'react';
import { FlatList, Image, useWindowDimensions, View } from 'react-native';

interface Props {
  data: Partial<Outfit>;
  className?: string;
}

export default function OutfitCard({ data, className }: Props) {
  if (data.articulos?.length === 0) return;
  const dimensions = useWindowDimensions();

  return (
    <View
      className={clsx('rounded-xl overflow-clip p-[10]', className)}
      style={{
        backgroundColor: Colors.white,
      }}
    >
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data.articulos}
        numColumns={2}
        keyExtractor={(e) => e.id!.toString()}
        scrollEnabled={false}
        ItemSeparatorComponent={(_) => <View className="h-[10px]" />}
        renderItem={(e) => (
          <Image
            source={{ uri: e.item.imageUrl }}
            className={clsx(
              'flex-1',
              e.index % 2 === 1 ? 'ml-[5px]' : 'mr-[5px]',
            )}
            style={{
              resizeMode: 'contain',
            }}
            height={115}
          />
        )}
      />
    </View>
  );
}
