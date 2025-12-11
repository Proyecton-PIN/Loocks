import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, Pressable, ScrollView } from 'react-native';
import { usePlanning } from '@/hooks/usePlanificacion';
import { router } from 'expo-router';

export default function PlansList() {
  const { allPlans, fetchAllPlans, isLoading } = usePlanning();

  useEffect(() => {
    fetchAllPlans();
  }, []);

  return (
    <FlatList
      data={allPlans}
      contentContainerClassName="pb-24 pt-4"
      keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
      ListEmptyComponent={
        !isLoading ? (
            <View className="items-center mt-10">
                <Text className="text-gray-400">No tienes viajes planificados aún.</Text>
            </View>
        ) : null
      }
      renderItem={({ item }) => (
        <Pressable 
            className="bg-white p-4 rounded-3xl mb-4 border border-gray-100 shadow-sm"
            onPress={() => {
                alert("Ir a detalles de: " + item.titulo);
            }}
        >
            <View className="flex-row justify-between items-start mb-3">
                <View>
                    <Text className="text-lg font-bold text-black">{item.titulo || "Viaje sin nombre"}</Text>
                    <Text className="text-xs text-gray-400 font-bold uppercase mt-1">
                        {item.ubicacion || "Ubicación desconocida"}
                    </Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${item.isMaleta ? 'bg-purple-100' : 'bg-blue-100'}`}>
                    <Text className={`text-xs font-bold ${item.isMaleta ? 'text-purple-700' : 'text-blue-700'}`}>
                        {item.isMaleta ? 'VIAJE' : 'EVENTO'}
                    </Text>
                </View>
            </View>

            <Text className="text-gray-500 text-sm mb-4">
                📅 {new Date(item.fechaInicio).toLocaleDateString()} - {new Date(item.fechaFin).toLocaleDateString()}
            </Text>

            {item.outfitLogs && item.outfitLogs.length > 0 ? (
                <View>
                    <Text className="text-xs text-gray-400 mb-2 font-bold">OUTFITS PLANIFICADOS</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {item.outfitLogs.map((log, i) => (
                            <View key={i} className="mr-2">
                                <Image 
                                    source={{ uri: log.outfit.articulos[0]?.imageUrl }} 
                                    className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200"
                                    resizeMode="cover"
                                />
                            </View>
                        ))}
                    </ScrollView>
                </View>
            ) : (
                <View className="bg-gray-50 p-2 rounded-xl">
                    <Text className="text-xs text-gray-400 text-center">Sin ropa asignada todavía</Text>
                </View>
            )}
        </Pressable>
      )}
    />
  );
}