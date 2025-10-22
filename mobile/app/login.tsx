import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export default function login() {
  return (
    <View className="flex-1 items-center justify-center">
      <Pressable className="flex-row items-center gap-3 bg-black rounded-lg py-4 px-6">
        <AntDesign name="google" size={24} color="white" />
        <Text className="text-white text-xl">Inicia sesión con Google</Text>
      </Pressable>
    </View>
  );
}
