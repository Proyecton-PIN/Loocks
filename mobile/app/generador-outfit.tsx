import { LeftArrowIcon, IAIcon } from '@/constants/icons'; 
import { useOutfit } from '@/hooks/useOutfits';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GeneradorOutfits() {
  const insets = useSafeAreaInsets();
  
  const { generateWithFilters, isLoading } = useOutfit();
  const [temperatura, setTemperatura] = useState('22');
  const [estiloSeleccionado, setEstiloSeleccionado] = useState('CASUAL');
  const [colorSeleccionado, setColorSeleccionado] = useState<string | null>(null);

  const ESTILOS = ['CASUAL', 'FORMAL', 'DEPORTIVO', 'STREETWEAR', 'ELEGANTE'];
  
  const COLORES = [
      { hex: '#FFFFFF', name: 'Blanco' },
      { hex: '#000000', name: 'Negro' },
      { hex: '#1F2937', name: 'Gris' },
      { hex: '#1D4ED8', name: 'Azul' },
      { hex: '#DC2626', name: 'Rojo' },
      { hex: '#D97706', name: 'Beige' },
      { hex: '#059669', name: 'Verde' },
  ];

  const handleGenerar = async () => {
    await generateWithFilters({
      temperatura: parseFloat(temperatura),
      estilo: estiloSeleccionado,
      limit: 5,
      // color: colorSeleccionado
    });
    router.push('/resultados-outfits');

  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View
        className="flex-row items-center justify-between px-5 pb-4"
        style={{ paddingTop: insets.top + 10 }}
      >
        <Pressable onPress={router.back} className="p-2 bg-gray-50 rounded-full">
           <LeftArrowIcon color="black" /> 
        </Pressable>
        <Text className="text-lg font-bold text-black">Generador IA</Text>
        <View className="w-10" /> 
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 50 }}>
        
        <Text className="text-3xl font-bold text-black mb-2">
            Crea tu <Text style={{ color: '#5639F8' }}>Look</Text>
        </Text>
        <Text className="text-gray-400 text-base mb-8">
            Define el contexto y deja que la IA decida.
        </Text>
        
        <View className="bg-[#F8F8F8] p-6 rounded-[32px] mb-8">
            
            {/*CLIMA */}
            <View className="flex-row justify-between items-center mb-6 border-b border-gray-200 pb-6">
                <View>
                    <Text className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-1">CLIMA</Text>
                    <Text className="text-gray-800 font-medium text-sm">Temperatura exterior</Text>
                </View>
                <View className="flex-row items-end border-b border-gray-300 pb-1">
                    <TextInput 
                        value={temperatura}
                        onChangeText={setTemperatura}
                        keyboardType="numeric"
                        className="text-4xl font-bold text-black text-right min-w-[50px]"
                        maxLength={2}
                    />
                    <Text className="text-2xl text-gray-400 mb-1 ml-1">°C</Text>
                </View>
            </View>

            {/*ESTILO */}
            <Text className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-3">ESTILO</Text>
            <View className="flex-row flex-wrap gap-2.5 mb-6">
                {ESTILOS.map((estilo) => {
                    const isSelected = estiloSeleccionado === estilo;
                    return (
                        <Pressable
                            key={estilo}
                            onPress={() => setEstiloSeleccionado(estilo)}
                            className={`px-5 py-2.5 rounded-full border ${
                                isSelected 
                                ? 'bg-black border-black' 
                                : 'bg-white border-gray-200'
                            }`}
                        >
                            <Text className={`text-xs font-bold ${
                                isSelected ? 'text-white' : 'text-gray-600'
                            }`}>
                                {estilo}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {/*COLOR */}
            <Text className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-3">COLOR PRINCIPAL</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2 px-2">
                
                <Pressable
                    onPress={() => setColorSeleccionado(null)}
                    className={`w-10 h-10 rounded-full mr-3 items-center justify-center border ${
                        colorSeleccionado === null ? 'border-black border-2' : 'border-gray-300 border-dashed'
                    }`}
                >
                    <Text className="text-xs text-gray-400">Todo</Text>
                </Pressable>

                {COLORES.map((color) => {
                    const isSelected = colorSeleccionado === color.hex;
                    return (
                        <Pressable
                            key={color.hex}
                            onPress={() => setColorSeleccionado(color.hex)}
                            className={`w-10 h-10 rounded-full mr-3 border-2 ${
                                isSelected ? 'border-black scale-110' : 'border-gray-200'
                            }`}
                            style={{ backgroundColor: color.hex }}
                        />
                    );
                })}
            </ScrollView>

        </View>

        {/*BOTÓN GENERAR*/}
        <Pressable
            onPress={handleGenerar}
            disabled={isLoading}
            className="w-full py-4 rounded-2xl items-center flex-row justify-center gap-2 mb-10 shadow-lg shadow-indigo-200 active:opacity-90"
            style={{ backgroundColor: '#5639F8' }}
        >
            {isLoading ? (
                <ActivityIndicator color="white" />
            ) : (
                <>
                    <IAIcon color="white" size={20} />
                    <Text className="text-white font-bold text-lg">Generar Outfits</Text>
                </>
            )}
        </Pressable>

      </ScrollView>
    </View>
  );
}