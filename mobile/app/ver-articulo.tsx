import { LeftArrowIcon } from '@/constants/icons';
import { useArticulos } from '@/hooks/useArticulos';
import { router, Stack } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ArticuloDetalles() {
  const selectedArticulo = useArticulos((s) => s.selectedArticulo);
  const removeArticulo = useArticulos((s) => s.removeArticulo);

  const insets = useSafeAreaInsets();

  if (!selectedArticulo) {
      router.back();
      return null;
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      <View 
        className="flex-row justify-between items-center px-5 pb-2"
        style={{ paddingTop: insets.top + 10 }}
      >
        <Pressable onPress={router.back} className="p-2 bg-gray-50 rounded-full">
          <LeftArrowIcon color="black" />
        </Pressable>
        {/*EDITAR ARTICULO*/}
        <Pressable 
            className="bg-orange-100 p-3 rounded-full"
            onPress={() => router.push('/editar-crear-articulo')} 
        >
             <Text style={{fontSize: 18}}>✏️</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 50 }}>
        
        {/*FOTO PRINCIPAL */}
        <Image
          source={{ uri: selectedArticulo.imageUrl ?? `data:image/png;base64,${selectedArticulo.base64Img}` }}
          className="w-full aspect-[3/4] rounded-3xl bg-gray-100 mb-6 mt-4"
          resizeMode="contain"
        />

        {/*DATOS PRINCIPALES */}
        <View className="flex-row justify-between items-start mb-2">
            <View>
                <Text className="text-2xl font-bold text-black">{selectedArticulo.nombre}</Text>
                <Text className="text-xs text-gray-400 uppercase font-bold mt-1 tracking-widest">
                    {selectedArticulo.marca || "SIN MARCA"}
                </Text>
            </View>
            {/*Favorito */}
            <Text className="text-3xl text-yellow-500">{selectedArticulo.isFavorito ? '★' : '☆'}</Text>
        </View>

        {/*Etiquetas */}
        <View className="flex-row flex-wrap gap-2 mt-3 mb-8">
            {[selectedArticulo.tipo, selectedArticulo.estacion, selectedArticulo.estilo].map((tag, i) => (
                tag ? (
                    <View key={i} className="bg-gray-100 px-4 py-2 rounded-full">
                        <Text className="text-xs text-gray-600 font-bold capitalize">{tag.toString()}</Text>
                    </View>
                ) : null
            ))}
        </View>

        {/*ESTADÍSTICAS */}
        <Text className="text-lg font-bold mb-4 text-black">Estadísticas</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8 -mx-5 px-5">
            {/*Calendario de usos*/}
            <View className="bg-white p-4 rounded-3xl mr-3 shadow-sm border border-gray-100 w-40 h-28 justify-between">
                <Text className="text-blue-600 font-bold text-2xl">5 <Text className="text-xs text-gray-400 font-normal">veces</Text></Text>
        
                <View className="flex-row flex-wrap gap-1.5">
                    {[...Array(12)].map((_, i) => (
                        <View key={i} className={`w-2 h-2 rounded-full ${i < 5 ? 'bg-blue-500' : 'bg-blue-100'}`}/>
                    ))}
                </View>
                <Text className="text-xs text-blue-400 font-bold">Abril</Text>
            </View>

            {/* Último Uso */}
            <View className="bg-white p-4 rounded-3xl mr-3 shadow-sm border border-gray-100 w-28 h-28 justify-center items-center">
                <Text className="text-2xl mb-2">↺</Text>
                <Text className="text-blue-500 font-bold text-sm">{formatRelativeDate(selectedArticulo.fechaUltimoUso)}</Text>
            </View>

            {/*Veces usada*/}
            <View className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 w-28 h-28 justify-center items-center">
                <Text className="text-blue-600 font-bold text-3xl">{selectedArticulo.usos || 0}</Text>
                <Text className="text-xs text-blue-400 text-center mt-1">Veces usada</Text>
            </View>
        </ScrollView>

        {/*PRUEBA CON */}
        <Text className="text-lg font-bold mb-4 text-black">Prueba con</Text>
        <View className="flex-row gap-4 mb-10">
             <View className="bg-gray-50 flex-1 aspect-[3/4] rounded-2xl justify-center items-center p-4 border border-dashed border-gray-300">
                <Text className="text-gray-400 text-center text-xs">Sugerencia 1</Text>
             </View>
             <View className="bg-gray-50 flex-1 aspect-[3/4] rounded-2xl justify-center items-center p-4 border border-dashed border-gray-300">
                <Text className="text-gray-400 text-center text-xs">Sugerencia 2</Text>
             </View>
        </View>

        {/*ELIMINAR*/}
        <Pressable
            className="rounded-2xl py-4 justify-center items-center bg-red-50 mb-10 border border-red-100"
            onPress={() => removeArticulo()}
        >
            <Text className="text-red-500 font-bold text-lg">Eliminar articulo 🗑️</Text>
        </Pressable>

      </ScrollView>
    </View>

    
  );

  function formatRelativeDate(dateString?: string | Date): string {
  if (!dateString) return "Nunca";
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  return `${diffDays} Días`;
}
}