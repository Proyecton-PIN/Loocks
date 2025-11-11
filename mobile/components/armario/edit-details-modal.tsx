import { NewItemDataDTO } from '@/lib/domain/dtos/new-item-data-dto';
import { Ionicons } from '@expo/vector-icons';
import { Image, Modal, Pressable, Text, TextInput, View } from 'react-native';

interface Props {
  data?: NewItemDataDTO;
  onSave(data: NewItemDataDTO): void;
  onClose(): void;
}

export default function EditDetailsModal({ data, onSave, onClose }: Props) {
  let nombre: string = data?.details.nombre ?? 'Sin nombre';
  let marca: string = data?.details.marca ?? 'Desconocida';
  let fechaCompra: string = data?.details.marca ?? 'Desconocida';

  return (
    <Modal visible={!!data} animationType="slide" transparent={false}>
      <View className="flex-1 bg-black px-4 py-6">
        {data?.details.imageUrl ? (
          <Image
            source={{ uri: data.details.imageUrl }}
            className="w-full h-2/3 rounded-xl mb-4"
            style={{ backgroundColor: 'transparent' }}
            resizeMode="contain"
          />
        ) : (
          <View className="w-full h-2/3 bg-neutral-900 rounded-xl mb-4 items-center justify-center">
            <Ionicons name="shirt-outline" size={48} color="#555" />
          </View>
        )}

        <View className="px-2">
          <Text>Nombre</Text>
          <TextInput
            value={nombre}
            onChangeText={(v) => (nombre = v)}
            className="bg-gray-800"
          />

          <Text>Marca</Text>
          <TextInput
            value={marca}
            onChangeText={(v) => (marca = v)}
            className="bg-gray-800"
          />

          <Text>Fecha de compra</Text>
          <TextInput
            value={fechaCompra}
            onChangeText={(v) => (fechaCompra = v)}
            className="bg-gray-800"
          />
        </View>

        <View className="flex-row justify-around mt-6">
          <Pressable
            onPress={() => {
              onSave({
                ...data!,
                details: {
                  ...data!.details,
                  nombre: nombre,
                  marca: marca,
                  fechaCompra: fechaCompra,
                },
              });
            }}
            className="bg-blue-700 px-4 py-3 rounded-md"
          >
            <Text className="text-white">Guardar</Text>
          </Pressable>

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
