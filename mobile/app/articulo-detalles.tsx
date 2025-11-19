import ColorPickerTrigger from '@/components/shared/color-picker-handler';
import StyledDatePicker from '@/components/shared/styled-date-picker';
import StyledPicker from '@/components/shared/styled-picker';
import StyledTextInput from '@/components/shared/styled-text-input';
import { AddIcon, CloseIcon, LeftArrowIcon } from '@/constants/icons';
import { Colors } from '@/constants/theme';
import { useArticulos } from '@/hooks/useArticulos';
import { ColorInfo } from '@/lib/domain/dtos/clothing-analysis-dto';
import { Estacion } from '@/lib/domain/enums/estacion';
import { TipoArticulo } from '@/lib/domain/enums/tipo-accesorio';
import { Picker } from '@react-native-picker/picker';
import { router, Stack } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ArticuloDetalles() {
  const selectedArticulo = useArticulos((s) => s.selectedArticulo);
  const updateSelectedArticulo = useArticulos((s) => s.updateSelectedArticulo);
  const addArticulo = useArticulos((s) => s.addArticulo);
  const screenDetails = useSafeAreaInsets();

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
        source={{
          uri:
            selectedArticulo?.imageUrl ??
            `data:image/png;base64,${selectedArticulo?.base64Img}`,
        }}
        className="w-full aspect-square h-auto rounded-xl overflow-clip"
      />

      <View className="flex gap-[30px]">
        <StyledTextInput
          placeholder="Nombre"
          label="Nombre"
          onChangeText={(v) => updateSelectedArticulo({ nombre: v })}
          value={selectedArticulo?.nombre}
          returnKeyType="next"
          autoCapitalize="sentences"
        />

        <StyledPicker
          label="Tipo de prenda"
          selectedValue={selectedArticulo?.tipo}
          onValueChange={(v) => updateSelectedArticulo({ tipo: v })}
        >
          {Object.values(TipoArticulo).map((e) => (
            <Picker.Item key={e} label={e.toString()} value={e.valueOf()} />
          ))}
        </StyledPicker>

        <StyledPicker
          label="Estación"
          selectedValue={selectedArticulo?.estacion}
          onValueChange={(v) => updateSelectedArticulo({ estacion: v })}
        >
          {Object.values(Estacion).map((e) => (
            <Picker.Item key={e} label={e.toString()} value={e.valueOf()} />
          ))}
        </StyledPicker>

        <StyledTextInput
          placeholder="Marca"
          placeholderTextColor="#717171"
          value={selectedArticulo?.marca ?? ''}
          autoCapitalize="none"
          onChangeText={(value) => {
            updateSelectedArticulo({ marca: value });
          }}
          keyboardType="email-address"
          returnKeyType="next"
          label="Marca"
        />

        <StyledDatePicker
          label="Fecha de compra"
          onChange={(_, value) => {
            updateSelectedArticulo({
              fechaCompra: value,
            });
          }}
          value={selectedArticulo?.fechaCompra ?? new Date()}
        />

        <TagsEditor tags={selectedArticulo?.tags} />

        <ColorPicker
          label="Colores"
          colors={selectedArticulo?.colores ?? []}
          onSelectColor={(hex) => {
            updateSelectedArticulo({
              colores: [
                ...(selectedArticulo?.colores ?? []),
                { color: hex, percentage: 0 },
              ],
            });
          }}
        />
      </View>

      <Pressable
        className="rounded-xl py-3 justify-center items-center
          mt-10 mb-20"
        onPress={() => addArticulo()}
        style={{ backgroundColor: Colors.primary }}
      >
        <Text className="text-white font-bold text-lg">Guardar prenda</Text>
      </Pressable>
    </ScrollView>
  );
}

function TagsEditor(props: { tags?: string[] }) {
  return (
    <View>
      <Text
        style={{
          fontFamily: 'Satoshi',
          fontWeight: 700,
          fontSize: 18,
          lineHeight: 18,
          letterSpacing: 0,
          verticalAlign: 'middle',
          marginBottom: 12,
        }}
      >
        Mood
      </Text>

      <View
        className="rounded-xl w-full p-[10px]"
        style={{ backgroundColor: Colors.white }}
      >
        {props.tags && (
          <View className="flex-row flex-wrap gap-2 mb-[10px]">
            {props.tags.map((t, i) => (
              <Pressable
                onPress={() => {} /* TODO: implementar */}
                key={`${t}${i}`}
                className="rounded-full flex-row gap-1 px-3 py-[5px]"
                style={{ backgroundColor: Colors.primary }}
              >
                <Text
                  style={{
                    color: Colors.white,
                    fontWeight: 500,
                    fontFamily: 'Satoshi',
                    fontSize: 13,
                    lineHeight: 13,
                    verticalAlign: 'middle',
                  }}
                >
                  {t}
                </Text>
                <CloseIcon color={Colors.white} size={12.5} />
              </Pressable>
            ))}
          </View>
        )}

        <Pressable
          onPress={() => {}} // TODO: implementar
          className="flex-row items-center justify-center h-[36px] rounded-xl gap-2"
          style={{ backgroundColor: Colors.background }}
        >
          <Text
            style={{
              color: Colors.muted,
              fontWeight: 700,
              fontFamily: 'Satoshi',
              fontSize: 16,
              lineHeight: 22,
              letterSpacing: 0.01,
            }}
          >
            Crear variante
          </Text>
          <AddIcon color={Colors.muted} />
        </Pressable>
      </View>
    </View>
  );
}

function ColorPicker(props: {
  label: string;
  colors: ColorInfo[];
  onSelectColor(hex: string): void;
}) {
  return (
    <View>
      <Text
        style={{
          fontFamily: 'Satoshi',
          fontWeight: 700,
          fontSize: 18,
          lineHeight: 18,
          letterSpacing: 0,
          verticalAlign: 'middle',
          marginBottom: 12,
        }}
      >
        {props.label}
      </Text>

      <View className="flex-row gap-2">
        {props.colors.map((c) => (
          <View
            key={c.color}
            className="rounded-full aspect-square w-[38px]"
            style={{
              backgroundColor: c.color,
              borderWidth: 2,
              borderColor: Colors.gray,
            }}
          />
        ))}
        <ColorPickerTrigger onSelectColor={props.onSelectColor}>
          <View className="rounded-full aspect-square w-[38px] items-center justify-center">
            <AddIcon color={Colors.black} />
          </View>
        </ColorPickerTrigger>
      </View>
    </View>
  );
}
