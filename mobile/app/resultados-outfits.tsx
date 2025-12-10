import { LeftArrowIcon, IAIcon } from '@/constants/icons'; 
import { useOutfit } from '@/hooks/useOutfits';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ResultadosOutfits() {
  const insets = useSafeAreaInsets();
  const { suggested, createOutfit } = useOutfit();

  const [savedIndices, setSavedIndices] = useState<number[]>([]);

  const handleGuardar = async (outfit: any, index: number) => {
    await createOutfit(outfit);
    setSavedIndices((prev) => [...prev, index]);
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]"> 
      <Stack.Screen options={{ headerShown: false }} />

      <View
        className="flex-row items-center justify-between px-5 pb-4 bg-white border-b border-gray-100"
        style={{ paddingTop: insets.top + 10 }}
      >
        <Pressable onPress={router.back} className="p-2 bg-gray-50 rounded-full">
           <LeftArrowIcon color="black" /> 
        </Pressable>
        <Text className="text-lg font-bold text-black">Resultados</Text>
        <View className="w-10" /> 
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}>
        
        <View className="mb-6">
            <Text className="text-2xl font-bold text-black">
                Tus Looks <Text style={{ color: '#5639F8' }}>Generados</Text>
            </Text>
            <Text className="text-gray-400 text-sm mt-1">
                Hemos encontrado {suggested.length} combinaciones para ti.
            </Text>
        </View>

        {/* LISTA DE OUTFITS */}
        <View className="gap-6">
            {suggested.map((outfit, index) => {
                const isSaved = savedIndices.includes(index);

                return (
                    <View key={index} className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100">
                        
                        {/* CABECERA TARJETA */}
                        <View className="flex-row justify-between items-center mb-4">
                            <View className="flex-row items-center gap-2">
                                <View className="bg-indigo-50 p-1.5 rounded-lg">
                                    <IAIcon size={14} color="#5639F8" />
                                </View>
                                <Text className="font-bold text-gray-800 text-lg">Opción {index + 1}</Text>
                            </View>
                            <View className="bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                <Text className="text-xs text-green-700 font-bold">98% Match</Text>
                            </View>
                        </View>
                        
                        {/* ARTICULOS */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2 px-2">
                            {outfit.articulos.map((articulo: any) => (
                                <View key={articulo.id} className="mr-3 items-center">
                                    <View className="w-24 h-28 bg-gray-50 rounded-2xl mb-2 overflow-hidden border border-gray-100 relative">
                                        <Image 
                                            source={{ uri: articulo.imageUrl }} 
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <Text className="text-[10px] text-gray-400 font-bold uppercase w-20 text-center" numberOfLines={1}>
                                        {articulo.nombre}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                        
                        <View className="flex-row gap-3 mt-6 pt-4 border-t border-gray-50">
                            
                            {/* BOTÓN GUARDAR */}
                            <Pressable 
                                onPress={() => !isSaved && handleGuardar(outfit, index)}
                                className={`flex-1 py-3.5 rounded-xl items-center flex-row justify-center gap-2 border ${
                                    isSaved 
                                    ? 'bg-green-50 border-green-200' 
                                    : 'bg-[#5639F8] border-[#5639F8] active:opacity-90'
                                }`}
                            >
                                <Text className={`font-bold text-sm ${isSaved ? 'text-green-700' : 'text-white'}`}>
                                    {isSaved ? 'Guardado ✓' : 'Guardar en Armario'}
                                </Text>
                            </Pressable>

                            {/* BOTÓN PROBAR (Visual por ahora) */}
                            <Pressable className="px-4 py-3.5 bg-white border border-gray-200 rounded-xl items-center">
                                <Text className="font-bold text-black text-sm">👁️</Text>
                            </Pressable>
                        </View>
                    </View>
                );
            })}

            {/* Empty State por si acaso */}
            {suggested.length === 0 && (
                <View className="items-center justify-center mt-10">
                    <Text className="text-gray-400 text-center">No se encontraron combinaciones.</Text>
                    <Pressable onPress={router.back} className="mt-4">
                        <Text className="text-[#5639F8] font-bold">Intenta cambiar los filtros</Text>
                    </Pressable>
                </View>
            )}
        </View>

      </ScrollView>
    </View>
  );
}