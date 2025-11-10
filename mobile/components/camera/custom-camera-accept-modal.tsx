import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Modal, Pressable, Text, View } from 'react-native';

interface Props {
  visible: boolean;
  uri?: string;
  onSave(): void;
  onRepeat(): void;
  onClose(): void;
}

export default function CustomCameraAcceptModal({
  visible,
  uri,
  onSave,
  onClose,
  onRepeat,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide">
      <View className="flex-1 bg-black">
        <Image
          source={{ uri }}
          className="flex-1 w-full h-full"
          resizeMode="contain"
        />

        <View className="absolute left-0 right-0 bottom-10 flex-row justify-around px-5">
          <Pressable
            onPress={onSave}
            className="bg-blue-600 px-4 py-3 rounded-md"
          >
            <Text className="text-white font-bold">Guardar</Text>
          </Pressable>

          <Pressable
            onPress={onRepeat}
            className="bg-gray-700 px-4 py-3 rounded-md"
          >
            <Text className="text-white">Repetir</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={onClose}
          className="absolute top-10 left-5 bg-black/60 p-2 rounded-md"
        >
          <Ionicons name="close" size={20} color={'white'} />
        </Pressable>
      </View>
    </Modal>
  );
}
