import { useArticulos } from '@/hooks/useArticulos';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import EditArticuloModal from './edit-articulo-modal';

interface Props {
  data?: any;
  onClose(): void;
}

function hexToSimpleName(hex?: string) {
  if (!hex) return hex;
  const map: Record<string, string> = {
    '#000000': 'Negro',
    '#ffffff': 'Blanco',
    '#ff0000': 'Rojo',
    '#00ff00': 'Verde',
    '#0000ff': 'Azul',
    '#ffff00': 'Amarillo',
    '#808080': 'Gris',
    '#ffa500': 'Naranja',
    '#800080': 'Morado',
    '#ffc0cb': 'Rosa',
  };

  const h = hex.trim().toLowerCase();
  return map[h] ?? hex;
}

export default function PrendaDetailsModal({ data, onClose }: Props) {
  const [editing, setEditing] = useState(false);
  const { updateArticulo } = useArticulos();

  if (!data) return null;

  const handleSave = async (dto: Partial<any>) => {
    await updateArticulo(data.id, dto);
    setEditing(false);
    onClose();
  };

  return (
    <Modal visible={!!data} animationType="slide" transparent={false}>
      <View className="flex-1 bg-black px-4 py-6">
        <ScrollView>
          {data.imageUrl ? (
            <Image
              source={{ uri: data.imageUrl }}
              className="w-full h-80 rounded-xl mb-4"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-72 bg-neutral-900 rounded-xl mb-4 items-center justify-center">
              <Ionicons name="shirt-outline" size={56} color="#777" />
            </View>
          )}

          <View className="px-2">
            <Text className="text-white text-3xl font-extrabold mb-1">{data.nombre ?? 'Sin nombre'}</Text>

            <View className="flex-row items-center space-x-2 mb-3">
              {data.marca && (
                <View className="bg-neutral-800 px-3 py-1 rounded-full">
                  <Text className="text-sm text-white">{data.marca}</Text>
                </View>
              )}

              {data.tipo && (
                <View className="bg-blue-700 px-3 py-1 rounded-full">
                  <Text className="text-sm text-white">{data.tipo}</Text>
                </View>
              )}

              {data.tipoPrenda && (
                <View className="bg-purple-700 px-3 py-1 rounded-full">
                  <Text className="text-sm text-white">{data.tipoPrenda}</Text>
                </View>
              )}
            </View>

            <Text className="text-gray-300 mb-2">ID: {data.id}</Text>

            {/* Primary color with swatch */}
            {data.colorPrimario && (
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 rounded mr-3" style={{ backgroundColor: data.colorPrimario }} />
                <Text className="text-gray-200">{hexToSimpleName(data.colorPrimario)}</Text>
              </View>
            )}

            {/* Secondary colors */}
            {data.coloresSecundarios && Array.isArray(data.coloresSecundarios) && data.coloresSecundarios.length > 0 && (
              <View className="mb-3">
                <Text className="text-gray-400 mb-2">Colores secundarios</Text>
                <View className="flex-row flex-wrap">
                  {data.coloresSecundarios.map((secondaryColor: any, index: number) => (
                    <View
                      key={index}
                      className="flex-row items-center bg-neutral-800 px-2 py-1 rounded mr-2 mb-2"
                    >
                      <View className="w-5 h-5 rounded mr-2" style={{ backgroundColor: secondaryColor }} />
                      <Text className="text-white">{hexToSimpleName(secondaryColor)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View className="flex-row space-x-4 mt-2">
              {data.estacion && <Text className="text-gray-400">Estación: {data.estacion}</Text>}
              {typeof data.usos !== 'undefined' && <Text className="text-gray-400">Usos: {data.usos}</Text>}
            </View>

            <View className="mt-3">
              {data.fechaCompra && (
                <Text className="text-gray-300">Comprada: {new Date(data.fechaCompra).toLocaleDateString()}</Text>
              )}
              {data.fechaUltimoUso && (
                <Text className="text-gray-300">Último uso: {new Date(data.fechaUltimoUso).toLocaleDateString()}</Text>
              )}
            </View>

            {/* Tags as pills */}
            {data.tags && Array.isArray(data.tags) && data.tags.length > 0 && (
              <View className="mt-4 ">
                <Text className="text-gray-400 mb-2">Tags</Text>
                <View className="flex-row flex-wrap">
                  {data.tags.map((tag: any, tIdx: number) => (
                    <View key={tIdx} className="bg-neutral-800 px-3 py-1 rounded mr-2 mb-2">
                      <Text className="text-white">{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View className="mt-4">
              <Text className="text-gray-400">Armario: {data.armario?.nombre ?? (data.armario ? 'Asociado' : '—')}</Text>
              <Text className="text-gray-400">Outfits: {Array.isArray(data.outfits) ? data.outfits.length : 0}</Text>
              <Text className="text-gray-400">Prestamos: {Array.isArray(data.prestamos) ? data.prestamos.length : 0}</Text>
            </View>
          </View>
        </ScrollView>

        <View className="flex-row justify-around mt-6">
          <Pressable onPress={() => setEditing(true)} className="bg-blue-700 px-4 py-3 rounded-md">
            <Text className="text-white">Editar</Text>
          </Pressable>

          <Pressable onPress={onClose} className="bg-gray-700 px-4 py-3 rounded-md">
            <Text className="text-white">Cerrar</Text>
          </Pressable>
        </View>

        <EditArticuloModal data={data} visible={editing} onClose={() => setEditing(false)} onSave={handleSave} />
      </View>
    </Modal>
  );
}
