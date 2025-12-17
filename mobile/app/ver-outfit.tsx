import { LeftArrowIcon } from '@/constants/icons';
import { useOutfit } from '@/hooks/useOutfits';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Image, Pressable, ScrollView, Text, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useArticulos } from '@/hooks/useArticulos';

export default function VerOutfit() {
  const selected = useOutfit((s) => s.selectedOutfit);
  const removeOutfit = useOutfit((s) => s.removeOutfit);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [activePrenda, setActivePrenda] = useState(selected?.outfit?.articulos?.[0]);

  useEffect(() => {
    if (!selected) {
      if (router.canGoBack()) {
         router.back();
      }
      return;
    }
    if (selected.outfit.articulos && selected.outfit.articulos.length > 0 && !activePrenda) {
        setActivePrenda(selected.outfit.articulos[0]);
    }
  }, [selected]);
  if (!selected || !selected.outfit) return null;
  const outfit = selected.outfit;
  // --- HANDLERS ---

  const selectArticulo = useArticulos((s) => s.selectArticulo); 
  const handleVerDetalles = () => {
    if (!activePrenda) return;
    selectArticulo(activePrenda);
    router.push('/ver-articulo');
};
const handleEditarPrenda = () => {
    router.push({
        pathname:'/cambiar-prenda',
        params: { prendaIdA_Reemplazar: activePrenda?.id }
    })
};
  const handleEliminarOutfit = async () => {
    Alert.alert(
        "Eliminar Outfit",
        "¿Estás seguro? Esta acción no se puede deshacer.",
        [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    await removeOutfit(outfit.id!);
                    router.back();
                }
            }
        ]
    );
  };
  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={{ paddingTop: insets.top + 10 }}
        className="px-5 pb-2 flex-row items-center justify-between"
      >
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
        >
          <LeftArrowIcon color="black" />
        </Pressable>
        <View>
            <Text className="text-lg font-bold text-center">Outfit #{outfit.id}</Text>
            <Text className="text-xs text-gray-400 text-center">
                {selected.fechaInicio ? new Date(selected.fechaInicio).toLocaleDateString() : ''}
            </Text>
        </View>
        <Pressable className="w-10 items-end justify-center">
            <Text className="text-2xl text-yellow-500">{outfit.isFavorito ? '★' : '☆'}</Text>
        </Pressable>
      </View>
      <View className="px-5 flex-row flex-wrap gap-2 mb-4 justify-center">
          {outfit.estacion && (
            <View className="bg-gray-100 px-3 py-1.5 rounded-full">
              <Text className="text-gray-600 font-semibold text-xs uppercase">
                {outfit.estacion}
              </Text>
            </View>
          )}
          {outfit.estilo && (
            <View className="bg-gray-100 px-3 py-1.5 rounded-full">
              <Text className="text-gray-600 font-semibold text-xs uppercase">
                {String(outfit.estilo)}
              </Text>
            </View>
          )}
      </View>
      <View className="flex-1">
          {activePrenda ? (
            <View className="px-5 pt-2 pb-4 flex-1 justify-center">
                <View className="w-full aspect-[3/4] bg-gray-50 rounded-[32px] overflow-hidden shadow-sm border border-gray-100 relative">
                    {activePrenda.imageUrl ? (
                        <Image
                            source={{ uri: activePrenda.imageUrl }}
                            className="w-full h-full"
                            resizeMode="contain"
                        />
                    ) : (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-gray-400">Sin imagen</Text>
                        </View>
                    )}
                    <View className="absolute bottom-0 left-0 right-0 bg-white/90 p-4">
                        <Text className="text-xl font-bold text-black text-center">
                            {activePrenda.nombre || "Prenda sin nombre"}
                        </Text>
                        <Text className="text-gray-500 text-center text-xs uppercase tracking-widest">
                            {activePrenda.tipo || "Prenda"}
                        </Text>
                    </View>
                </View>
                <View className="flex-row gap-3 mt-4">
                    <Pressable
                        onPress={handleEditarPrenda}
                        className="flex-1 bg-black py-3.5 rounded-2xl items-center justify-center active:opacity-80"
                    >
                        <Text className="text-white font-bold">Editar</Text>
                    </Pressable>
                    <Pressable
                        onPress={handleVerDetalles}
                        className="flex-1 bg-gray-100 py-3.5 rounded-2xl items-center justify-center active:bg-gray-200"
                    >
                        <Text className="text-black font-bold">Detalles</Text>
                    </Pressable>
                </View>
            </View>
          ) : (
             <View className="flex-1 justify-center items-center">
                 <Text className="text-gray-400">No hay prendas en este outfit</Text>
             </View>
          )}
          <View className="bg-gray-50 rounded-t-[32px] pt-6 pb-8 px-5 shadow-sm h-48">
            <Text className="text-gray-400 font-bold text-xs uppercase mb-3 ml-1">
                Composición ({outfit.articulos ? outfit.articulos.length : 0})
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingRight: 20 }}
            >
                {outfit.articulos && outfit.articulos.map((item, index) => {
                    const isActive = activePrenda && activePrenda.id === item.id;
                    return (
                        <Pressable
                            key={item.id || index}
                            onPress={() => setActivePrenda(item)}
                            className={`items-center transition-all ${isActive ? 'opacity-100' : 'opacity-60'}`}
                        >
                            <View
                                className={`w-16 h-20 rounded-xl overflow-hidden border-2 bg-white ${
                                    isActive ? 'border-black' : 'border-transparent'
                                }`}
                            >
                                {item.imageUrl ? (
                                    <Image
                                        source={{ uri: item.imageUrl }}
                                        className="w-full h-full"
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <View className="flex-1 items-center justify-center bg-gray-100">
                                        <Text className="text-[8px] text-gray-400">N/A</Text>
                                    </View>
                                )}
                            </View>
                        </Pressable>
                    );
                })}
                <Pressable
                    onPress={handleEliminarOutfit}
                    className="w-16 h-20 rounded-xl bg-red-50 border border-red-100 items-center justify-center ml-2"
                >
                    <Text className="text-red-500 text-xs font-bold text-center">Eliminar</Text>
                </Pressable>
            </ScrollView>
          </View>
      </View>
    </View>
  );
}