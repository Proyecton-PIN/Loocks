import { NewItemDataDTO } from '@/lib/domain/dtos/new-item-data-dto';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';

interface Props {
  data?: NewItemDataDTO;
  onSave(data: NewItemDataDTO): void;
  onClose(): void;
}

// Modal used after processPreview: shows processed image + AI details
// Allows the user to edit fields before saving. On save it returns a
// NewItemDataDTO to the caller which will POST to saveProcessed.
export default function EditDetailsModal({ data, onSave, onClose }: Props) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [primaryColor, setPrimaryColor] = useState<string | undefined>(undefined);
  const [secondaryColors, setSecondaryColors] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string | undefined>(undefined);
  const [seassons, setSeassons] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  const [isPrenda, setIsPrenda] = useState<boolean>(true);

  useEffect(() => {
    if (!data) return;
    const d = data as NewItemDataDTO & { rawDetails?: any; imageBase64?: string };
    const raw = (d as any).rawDetails;

    setImageUrl(d.details.imageUrl ?? (d.imageBase64 ? d.imageBase64 : undefined));
    setPrimaryColor((d.details as any).primaryColor ?? (d.details as any).colorPrimario ?? '');
    setSecondaryColors(
      Array.isArray((d.details as any).coloresSecundarios)
        ? (d.details as any).coloresSecundarios.join(', ')
        : Array.isArray((d.details as any).colors)
        ? (d.details as any).colors.map((c: any) => c.color).join(', ')
        : ''
    );
    setTags(
      Array.isArray((d.details as any).tagsIds)
        ? (d.details as any).tagsIds.join(', ')
        : Array.isArray(raw?.tags)
        ? raw.tags.join(', ')
        : ''
    );
    setSeassons(
      Array.isArray(raw?.seassons)
        ? raw.seassons.join(', ')
        : Array.isArray((d.details as any).seassons)
        ? (d.details as any).seassons.join(', ')
        : ''
    );
    setType((d.details as any).type ?? raw?.type ?? '');
    const isPr = typeof (d as any).isPrenda === 'boolean' ? (d as any).isPrenda : !!raw?.prenda;
    setIsPrenda(isPr);
  }, [data]);

  if (!data) return null;

  function buildDto(): NewItemDataDTO {
    const d = data!;
    const detalles: any = {
      ...d.details,
      imageUrl: imageUrl ?? d.details.imageUrl,
    };

    if (primaryColor) detalles.primaryColor = primaryColor;
    if (secondaryColors) {
      // prefer array of {color, percentage} for colors, but backend accepts simple list too
      detalles.colors = secondaryColors.split(',').map((s: string) => ({ color: s.trim() }));
      detalles.coloresSecundarios = secondaryColors.split(',').map((s: string) => s.trim());
    }
    if (tags) detalles.tags = tags.split(',').map((s: string) => s.trim());
    if (seassons) detalles.seassons = seassons.split(',').map((s: string) => s.trim());
    if (type) detalles.type = type;

    return {
      ...d,
      details: detalles,
      isPrenda,
    } as NewItemDataDTO;
  }

  return (
    <Modal visible={!!data} animationType="slide" transparent={false}>
      <View className="flex-1 bg-black px-4 py-6">
        <ScrollView>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-72 rounded-xl mb-4"
              resizeMode="contain"
            />
          ) : (
            <View className="w-full h-72 bg-neutral-900 rounded-xl mb-4 items-center justify-center">
              <Ionicons name="shirt-outline" size={48} color="#555" />
            </View>
          )}

          <View className="px-2 space-y-3">
            <Text className="text-white">Primary color (hex or name)</Text>
            <TextInput
              value={primaryColor}
              onChangeText={setPrimaryColor}
              className="bg-gray-800 p-2 rounded text-white"
              placeholderTextColor="#cfcfcf"
            />

            <Text className="text-white">Colors (comma separated)</Text>
            <TextInput
              value={secondaryColors}
              onChangeText={setSecondaryColors}
              className="bg-gray-800 p-2 rounded text-white"
              placeholderTextColor="#cfcfcf"
            />

            <Text className="text-white">Tags (comma separated)</Text>
            <TextInput
              value={tags}
              onChangeText={setTags}
              className="bg-gray-800 p-2 rounded text-white"
              placeholderTextColor="#cfcfcf"
            />

            <Text className="text-white">Seassons (comma separated)</Text>
            <TextInput
              value={seassons}
              onChangeText={setSeassons}
              className="bg-gray-800 p-2 rounded text-white"
              placeholderTextColor="#cfcfcf"
            />

            <Text className="text-white">Type</Text>
            <TextInput
              value={type}
              onChangeText={setType}
              className="bg-gray-800 p-2 rounded text-white"
              placeholderTextColor="#cfcfcf"
            />

            <View className="flex-row items-center justify-between">
              <Text className="text-white">Is Prenda</Text>
              <Switch value={isPrenda} onValueChange={setIsPrenda} />
            </View>
          </View>
        </ScrollView>

        <View className="flex-row justify-around mt-6">
          <Pressable
            onPress={() => {
              const dto = buildDto();
              onSave(dto);
            }}
            className="bg-blue-700 px-4 py-3 rounded-md"
          >
            <Text className="text-white">Guardar</Text>
          </Pressable>

          <Pressable onPress={onClose} className="bg-gray-700 px-4 py-3 rounded-md">
            <Text className="text-white">Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
