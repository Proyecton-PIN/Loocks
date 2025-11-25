import OutfitCard from '@/components/outfit/outfit-card';
import { Outfit } from '@/lib/domain/models/outift';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

export default function LooksPage() {
  const [outfits] = useState<Outfit[]>([]);

  return (
    <View className="flex-1">
      <Pressable
        onPress={() => router.push('/crear_outfit')}
        className="border border-dashed border-neutral-600 rounded-xl py-4 mb-6 items-center"
      >
        <Text className="text-white">+ Añadir outfit</Text>
      </Pressable>

      <FlatList
        key="outfits"
        data={outfits}
        renderItem={({ item }) => <OutfitCard data={item} />}
        numColumns={1}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center mt-10">
            No hay outfits todavía
          </Text>
        }
      />
    </View>
  );
}
