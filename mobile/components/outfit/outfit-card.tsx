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
    <View className={clsx('rounded-xl overflow-clip ', className)}>
      <FlatList
        data={data.articulos}
        numColumns={2}
        scrollEnabled={false}
        ItemSeparatorComponent={(_) => <View className="h-[10px]" />}
        renderItem={(e) => (
          <View
            className={clsx(
              'flex-1',
              e.index % 2 === 1 ? 'ml-[5px]' : 'mr-[5px]',
            )}
          >
            <Image
              source={{ uri: e.item.imageUrl }}
              className="flex-1"
              style={{
                resizeMode: 'center',
              }}
              height={115}
            />
          </View>
        )}
      />
    </View>
  );
}
