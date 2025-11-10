import { Mood } from '@/lib/domain/models/mood';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface Props {
  data: Mood;
}

export default function MoodCard({ data }: Props) {
  return (
    <View className="flex-row bg-neutral-900 p-4 rounded-xl mb-3 items-center">
      <Ionicons name="happy-outline" size={24} color="#00aaff" />
      <Text className="text-white ml-3 text-base">{data.name}</Text>
    </View>
  );
}
