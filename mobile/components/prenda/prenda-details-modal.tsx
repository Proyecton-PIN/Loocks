import { useArticulos } from '@/hooks/useArticulos';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import EditArticuloModal from './edit-articulo-modal';

interface Props {
  data?: any;
  onClose(): void;
}

function hexToSimpleName(hex?: string) {
  if (!hex) return hex;

  // Normalize to #rrggbb
  let h = hex.trim().toLowerCase();
  if (h.startsWith('0x')) h = '#' + h.slice(2);
  if (!h.startsWith('#')) h = '#' + h;
  if (h.length === 4) h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];

  const named: Record<string, string> = {
    '#000000': 'Negro',
    '#ffffff': 'Blanco',
    '#ff0000': 'Rojo',
    '#8b0000': 'Rojo oscuro',
    '#b22222': 'Rojo ladrillo',
    '#ff7f50': 'Coral',
    '#ffa500': 'Naranja',
    '#ffd700': 'Dorado',
    '#ffff00': 'Amarillo',
    '#808000': 'Oliva',
    '#008000': 'Verde',
    '#00ff00': 'Verde claro',
    '#006400': 'Verde oscuro',
    '#00ffff': 'Cian',
    '#40e0d0': 'Turquesa',
    '#0000ff': 'Azul',
    '#1e90ff': 'Azul dodger',
    '#00008b': 'Azul oscuro',
    '#4b0082': 'Índigo',
    '#800080': 'Morado',
    '#ff00ff': 'Magenta',
    '#ffc0cb': 'Rosa',
    '#f5deb3': 'Beige',
    '#deb887': 'Marrón claro',
    '#a52a2a': 'Marrón',
    '#808080': 'Gris',
    '#2f4f4f': 'Gris oscuro',
    '#add8e6': 'Azul claro',
    '#f0e68c': 'Caqui',
  };

  if (named[h]) return named[h];

  // Fallback: find nearest named color by RGB distance
  function hexToRgb(hexStr: string) {
    const r = parseInt(hexStr.substr(1, 2), 16);
    const g = parseInt(hexStr.substr(3, 2), 16);
    const b = parseInt(hexStr.substr(5, 2), 16);
    return { r, g, b };
  }

  try {
    const target = hexToRgb(h);
    let bestName = h;
    let bestDist = Infinity;
    for (const [k, name] of Object.entries(named)) {
      const c = hexToRgb(k);
      const dr = c.r - target.r;
      const dg = c.g - target.g;
      const db = c.b - target.b;
      const dist = dr * dr + dg * dg + db * db;
      if (dist < bestDist) {
        bestDist = dist;
        bestName = name;
      }
    }
    return bestName;
  } catch (e) {
    return hex;
  }
}

export default function PrendaDetailsModal({ data, onClose }: Props) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { updateArticulo, deleteArticulo } = useArticulos();

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
            <View className="bg-neutral-900 rounded-xl p-4 shadow-md">
              <Text className="text-white text-3xl font-extrabold text-center mb-2">{data.nombre ?? 'Sin nombre'}</Text>

              <View className="flex-row justify-center items-center space-x-2 mb-3">
                {data.marca && (
                  <View className="bg-neutral-800 px-4 py-1 rounded-full">
                    <Text className="text-sm text-white">{data.marca}</Text>
                  </View>
                )}

                {data.tipoPrenda && (
                  <View className="bg-purple-700 px-4 py-1 rounded-full">
                    <Text className="text-sm text-white">{data.tipoPrenda}</Text>
                  </View>
                )}
              </View>

              <View className="flex-row justify-between items-center mb-3">
                <View>
                  <Text className="text-white text-sm">ID</Text>
                  <Text className="text-white text-lg font-medium">{data.id}</Text>
                </View>

                {data.colorPrimario && (
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full mr-3" style={{ backgroundColor: data.colorPrimario }} />
                    <View>
                      <Text className="text-white text-sm">Color</Text>
                      <Text className="text-white text-base">{hexToSimpleName(data.colorPrimario)}</Text>
                    </View>
                  </View>
                )}
              </View>

              {data.coloresSecundarios && Array.isArray(data.coloresSecundarios) && data.coloresSecundarios.length > 0 && (
                <View className="mb-3">
                  <Text className="text-white mb-2 font-semibold">Colores secundarios</Text>
                  <View className="flex-row flex-wrap">
                    {data.coloresSecundarios.map((secondaryColor: any, index: number) => (
                      <View
                        key={index}
                        className="flex-row items-center bg-neutral-800 px-3 py-1 rounded mr-2 mb-2"
                      >
                        <View className="w-6 h-6 rounded mr-2" style={{ backgroundColor: secondaryColor }} />
                        <Text className="text-white text-base">{hexToSimpleName(secondaryColor)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View className="h-px bg-neutral-700 my-3" />

              <View className="mb-2">
                {data.tipo && <Text className="text-white text-lg mb-1">Tipo: {data.tipo}</Text>}
                {data.estacion && <Text className="text-white text-lg mb-1">Estación: {data.estacion}</Text>}
                {typeof data.usos !== 'undefined' && <Text className="text-white text-lg">Usos: {data.usos}</Text>}
              </View>

              <View className="h-px bg-neutral-700 my-3" />

              <View className="mb-2">
                {data.fechaCompra && (
                  <Text className="text-white text-base">Comprada: {new Date(data.fechaCompra).toLocaleDateString()}</Text>
                )}
                {data.fechaUltimoUso && (
                  <Text className="text-white text-base">Último uso: {new Date(data.fechaUltimoUso).toLocaleDateString()}</Text>
                )}
              </View>

              {data.tags && Array.isArray(data.tags) && data.tags.length > 0 && (
                <View className="mt-3">
                  <Text className="text-white mb-2 font-semibold">Tags</Text>
                  <View className="flex-row flex-wrap">
                    {data.tags.map((tag: any, tIdx: number) => (
                      <View key={tIdx} className="bg-neutral-800 px-4 py-2 rounded-full mr-2 mb-2">
                        <Text className="text-white text-base">{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View className="h-px bg-neutral-700 my-3" />

              <View className="flex-row justify-between">
                <Text className="text-white">Armario: {data.armario?.nombre ?? (data.armario ? 'Asociado' : '—')}</Text>
                <Text className="text-white">Prestamos: {Array.isArray(data.prestamos) ? data.prestamos.length : 0}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="flex-row justify-around mt-6">
          <Pressable onPress={() => setEditing(true)} className="bg-blue-700 px-4 py-3 rounded-md">
            <Text className="text-white">Editar</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              Alert.alert('Eliminar prenda', '¿Seguro que quieres eliminar esta prenda?', [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Eliminar',
                  style: 'destructive',
                  onPress: async () => {
                    setDeleting(true);
                    try {
                      const ok = await deleteArticulo(data.id);
                      setDeleting(false);
                      if (ok) {
                        onClose();
                      } else {
                        Alert.alert('Error', 'No se pudo eliminar la prenda.');
                      }
                    } catch (e) {
                      setDeleting(false);
                      console.error(e);
                      Alert.alert('Error', 'No se pudo eliminar la prenda.');
                    }
                  },
                },
              ]);
            }}
            className="bg-red-600 px-4 py-3 rounded-md"
            disabled={deleting}
          >
            <Text className="text-white">{deleting ? 'Eliminando...' : 'Eliminar'}</Text>
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
