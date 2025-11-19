import StyledDatePicker from '@/components/shared/styled-date-picker';
import StyledPicker from '@/components/shared/styled-picker';
import StyledTextInput from '@/components/shared/styled-text-input';
import { CloseIcon, LeftArrowIcon } from '@/constants/icons';
import { Colors } from '@/constants/theme';
import { useArticulos } from '@/hooks/useArticulos';
import { Estacion } from '@/lib/domain/enums/estacion';
import { TipoArticulo } from '@/lib/domain/enums/tipo-accesorio';
import { Picker } from '@react-native-picker/picker';
import { router, Stack } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
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

      <View className="flex h-[833px] gap-[30px]">
        <StyledTextInput
          placeholder="Nombre"
          label="Nombre"
          onChangeText={(v) => updateNewItem({ nombre: v })}
          value={data?.nombre}
          returnKeyType="next"
          autoCapitalize="sentences"
        />

        <StyledTextInput
          placeholder="Marca"
          placeholderTextColor="#717171"
          value={data?.marca ?? ''}
          autoCapitalize="none"
          onChangeText={(value) => {
            updateNewItem({ marca: value });
          }}
          keyboardType="email-address"
          returnKeyType="next"
          label="Marca"
        />

        <StyledPicker
          label="Estación"
          selectedValue={data?.estacion}
          onValueChange={(v) => updateNewItem({ estacion: v })}
        >
          {Object.values(Estacion).map((e) => (
            <Picker.Item key={e} label={e.toString()} value={e.valueOf()} />
          ))}
        </StyledPicker>

        <StyledPicker
          label="Tipo de prenda"
          selectedValue={data?.tipo}
          onValueChange={(v) => updateNewItem({ tipo: v })}
        >
          {Object.values(TipoArticulo).map((e) => (
            <Picker.Item key={e} label={e.toString()} value={e.valueOf()} />
          ))}
        </StyledPicker>

        <StyledDatePicker
          label="Fecha de compra"
          onChange={(_, value) => {
            updateNewItem({
              fechaCompra: value,
            });
          }}
          value={data?.fechaCompra ?? new Date()}
        />
      </View>

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
