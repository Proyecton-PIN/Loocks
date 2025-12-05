import { Colors } from '@/constants/theme';
import { Outfit } from '@/lib/domain/models/outift';
import clsx from 'clsx';
import React from 'react';
import { FlatList, Image, View } from 'react-native';

interface Props {
  data: Partial<Outfit>;
  className?: string;
}

export default function OutfitCard({ data, className }: Props) {
  return (
    <View
      className={clsx('rounded-xl overflow-clip p-[10]', className)}
      style={{
        backgroundColor: Colors.white,
      }}
    >
      <FlatList
        data={data.articulos}
        numColumns={2}
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
            resizeMode="contain"
          />
        )}
      />
    </View>
  );
}
