import { Outfit } from '@/lib/domain/models/outift';
import clsx from 'clsx';
import React from 'react';
import { Image, View } from 'react-native';

interface Props {
  data: Partial<Outfit>;
  className?: string;
}

export default function OutfitCard({ data, className }: Props) {
  return (
    <View
      className={clsx('flex-wrap gap-[10] rounded-xl overflow-clip', className)}
    >
      {data.articulos?.slice(4).map((e, idx) => (
        <Image
          key={idx}
          className="bg-red-500 h-[115] w-[90]"
          source={{ uri: e.imageUrl }}
        />
      ))}
    </View>
  );
}
