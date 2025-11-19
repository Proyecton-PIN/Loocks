import CustomDatePicker from '@/components/shared/custom-date-picker';
import { CloseIcon, LeftArrowIcon } from '@/constants/icons';
import { Colors } from '@/constants/theme';
import { useArticulos } from '@/hooks/useArticulos';
import { Estacion } from '@/lib/domain/enums/estacion';
import { TipoArticulo } from '@/lib/domain/enums/tipo-accesorio';
import { Picker } from '@react-native-picker/picker';
import { router, Stack } from 'expo-router';
import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ArticuloDetalles() {
  const data = useArticulos((s) => s.newItem);
  const updateNewItem = useArticulos((s) => s.updateNewItem);
  const screenDetails = useSafeAreaInsets();
  const addArticulo = useArticulos((s) => s.addArticulo);

  return (
    <ScrollView className="flex-1 px-5">
      <Stack.Screen
        options={{
          contentStyle: {
            paddingBottom: screenDetails.bottom,
          },
          headerShown: true,
          header: () => (
            <View
              className="w-full h-auto flex-row justify-between items-center"
              style={{ paddingTop: screenDetails.top }}
            >
              <Pressable className="py-5 px-8" onPress={router.back}>
                <LeftArrowIcon color="black" />
              </Pressable>
              <Pressable className="py-5 px-8" onPress={router.back}>
                <CloseIcon color="black" />
              </Pressable>
            </View>
          ),
        }}
      />

      <Image
        source={{ uri: `data:image/png;base64,${data?.base64Img}` }}
        className="w-full aspect-square h-auto rounded-xl overflow-clip"
      />

      <Text className="mt-5 font-bold mb-1">Nombre</Text>
      <TextInput
        className="bg-white rounded-lg px-4 py-3 text-base text-black"
        placeholder="Nombre"
        placeholderTextColor="#717171"
        value={data?.nombre ?? ''}
        autoCapitalize="none"
        onChangeText={(value) => {
          updateNewItem({ nombre: value });
        }}
        keyboardType="email-address"
        returnKeyType="next"
      />

      <Text className="mt-5 font-bold mb-1">Marca</Text>
      <TextInput
        className="bg-white rounded-lg px-4 py-3 text-base text-black"
        placeholder="Marca"
        placeholderTextColor="#717171"
        value={data?.marca ?? ''}
        autoCapitalize="none"
        onChangeText={(value) => {
          updateNewItem({ marca: value });
        }}
        keyboardType="email-address"
        returnKeyType="next"
      />

      <Text className="mt-5 font-bold mb-1">Estación</Text>
      <View className="bg-white rounded-lg px-2 textx-base text-black">
        <Picker
          onValueChange={(value) => {
            updateNewItem({ estacion: value });
          }}
          selectedValue={Estacion.PRIMAVERA}
        >
          {Object.values(Estacion).map((e) => (
            <Picker.Item key={e} label={e.toString()} value={e.valueOf()} />
          ))}
        </Picker>
      </View>

      <Text className="mt-5 font-bold mb-1">Tipo</Text>
      <View className="bg-white rounded-lg px-2 textx-base text-black">
        <Picker
          selectedValue={TipoArticulo.TODOS}
          onValueChange={(value) => {
            updateNewItem({ tipo: value });
          }}
        >
          {Object.values(TipoArticulo).map((e) => (
            <Picker.Item key={e} label={e.toString()} value={e.valueOf()} />
          ))}
        </Picker>
      </View>

      <Text className="mt-5 font-bold mb-1">Fecha de compra</Text>
      <CustomDatePicker
        onChange={(value) => {
          updateNewItem({
            fechaCompra: value,
          });
        }}
        currentValue={data?.fechaCompra}
      />

      <Pressable
        className="rounded-lg py-3 justify-center items-center
          mt-10"
        onPress={() => addArticulo()}
        style={{ backgroundColor: Colors.primary }}
      >
        <Text className="text-white font-bold text-lg">Guardar prenda</Text>
      </Pressable>
    </ScrollView>
  );
}
