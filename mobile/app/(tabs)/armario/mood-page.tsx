import MoodCard from '@/components/mood/mood-card';
import { Mood } from '@/lib/domain/models/mood';
import React, { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

export default function MoodPage() {
  const [moods] = useState<Mood[]>([]);

  return (
    <View>
      <Pressable
        className="border border-dashed border-neutral-600 
        rounded-xl py-4 mb-6 items-center"
      >
        <Text className="text-white">+ Añadir mood</Text>
      </Pressable>

      <FlatList
        data={moods}
        renderItem={(item) => <MoodCard data={item.item} />}
        numColumns={1}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center mt-10">
            No hay moods todavía
          </Text>
        }
      />
    </View>
  );
}
