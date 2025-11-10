import { Prenda } from '@/lib/domain/models/prenda';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Modal, Pressable, Text, View } from 'react-native';

interface Props {
  data?: Prenda;
  onClose(): void;
}

export default function PrendaDetailsModal({ data, onClose }: Props) {
  return (
    <Modal visible={!!data} animationType="slide" transparent={false}>
      <View className="flex-1 bg-black px-4 py-6">
        {data?.imageUrl ? (
          <Image
            source={{ uri: data.imageUrl }}
            className="w-full h-2/3 rounded-xl mb-4"
            resizeMode="contain"
          />
        ) : (
          <View className="w-full h-2/3 bg-neutral-900 rounded-xl mb-4 items-center justify-center">
            <Ionicons name="shirt-outline" size={48} color="#555" />
          </View>
        )}

        <View className="px-2">
          <Text className="text-white text-2xl font-bold mb-2">
            {data?.nombre ?? 'Prenda'}
          </Text>
          {data?.tipo && (
            <Text className="text-gray-400 mb-1">Tipo: {data.tipo}</Text>
          )}
          {data?.colorPrimario && (
            <Text className="text-gray-400 mb-1">
              Color: {data.colorPrimario}
            </Text>
          )}
          {data?.fechaCompra && (
            <Text className="text-gray-400 mb-1">
              Comprada: {new Date(data.fechaCompra).toLocaleDateString()}
            </Text>
          )}
        </View>

        <View className="flex-row justify-around mt-6">
          <Pressable
            onPress={onClose}
            className="bg-gray-700 px-4 py-3 rounded-md"
          >
            <Text className="text-white">Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
