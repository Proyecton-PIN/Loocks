import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

export default function OutfitCard() {
  return (
    <View className="w-full bg-neutral-800 rounded-xl p-6 mb-3 items-center justify-center">
      <Ionicons name="color-palette-outline" size={40} color="#555" />
      <Text className="text-gray-500 mt-2 text-sm">Outfit</Text>
    </View>
  );
}
