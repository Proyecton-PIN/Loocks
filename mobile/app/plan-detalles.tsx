import { LeftArrowIcon } from '@/constants/icons';
import { usePlanning } from '@/hooks/usePlanificacion';
import { useOutfit } from '@/hooks/useOutfits';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PlanDetalles() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { planId } = useLocalSearchParams();
  
  // Hooks
  const { allPlans } = usePlanning();
  const { selectOutfit } = useOutfit();

  // 1. BUSCAR EL PLAN EN MEMORIA
  const plan = allPlans.find(p => p.id?.toString() === planId?.toString());

  // 2. ORDENAR LOS OUTFITS POR FECHA (Protegido con ?)
  const outfitsOrdenados = plan?.outfitLogs?.sort((a, b) => 
    new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
  ) || [];

  const handleVerOutfit = (log: any) => {
    selectOutfit(log);
    // Ajusta esta ruta si tu pantalla de ver outfit está en otro lado
    router.push('/ver-outfit'); 
  };

  if (!plan) {
      return (
          <View className="flex-1 justify-center items-center bg-white">
              <ActivityIndicator color="#5639F8" />
              <Text className="text-gray-400 mt-4">Cargando detalles del plan...</Text>
          </View>
      );
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View 
        className="flex-row items-center justify-between px-5 pb-4 border-b border-gray-100"
        style={{ paddingTop: insets.top + 10 }}
      >
        <Pressable onPress={() => router.back()} className="p-2 bg-gray-50 rounded-full">
            <LeftArrowIcon color="black" />
        </Pressable>
        <Text className="text-lg font-bold text-black flex-1 text-center mr-8">
            {plan.titulo || "Detalles del Plan"}
        </Text>
      </View>

      {/* LISTA DE DÍAS */}
      <FlatList
        data={outfitsOrdenados}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        ListEmptyComponent={
            <View className="mt-10 items-center">
                <Text className="text-gray-400">No hay outfits generados para este plan.</Text>
            </View>
        }
        renderItem={({ item, index }) => {
            const fecha = new Date(item.fechaInicio);
            const fechaTexto = fecha.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
            });

            // PROTECCIÓN: Verificamos si existe el outfit
            const outfit = item.outfit;
            const articulos = outfit?.articulos || [];

            return (
                <View className="mb-6">
                    {/* Título del día */}
                    <Text className="text-gray-400 font-bold uppercase text-xs mb-2 ml-1">
                        DÍA {index + 1} • {fechaTexto}
                    </Text>

                    {/* Tarjeta del Outfit */}
                    <Pressable
                        onPress={() => handleVerOutfit(item)}
                        className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
                    >
                        <View className="p-4 flex-row items-center gap-4">
                            {/* Collage de fotos (hasta 4 prendas) */}
                            <View className="w-20 h-20 bg-gray-50 rounded-2xl flex-row flex-wrap overflow-hidden bg-gray-100">
                                {articulos.length > 0 ? (
                                    articulos.slice(0, 4).map((art, i) => (
                                        <Image 
                                            key={i}
                                            source={{ uri: art.imageUrl }} 
                                            className="w-10 h-10 border border-white"
                                            resizeMode="cover"
                                        />
                                    ))
                                ) : (
                                    <View className="flex-1 justify-center items-center w-full">
                                        <Text className="text-xs text-gray-300">Sin ropa</Text>
                                    </View>
                                )}
                            </View>

                            {/* Info */}
                            <View className="flex-1">
                                <Text className="text-lg font-bold text-black capitalize">
                                    {/* TRUCO: (outfit as any).nombre para evitar el error de TS */}
                                    {(outfit as any)?.nombre || `Outfit Día ${index + 1}`}
                                </Text>
                                <Text className="text-gray-500 text-xs mt-1">
                                    {outfit?.estilo || 'Casual'} • {articulos.length} prendas
                                </Text>
                                <View className="mt-3 flex-row">
                                    <View className="bg-[#5639F8] px-3 py-1 rounded-full">
                                        <Text className="text-white text-xs font-bold">Ver Outfit</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Pressable>
                </View>
            );
        }}
      />
    </View>
  );
}