import { CloseIcon } from '@/constants/icons';
import { useArticulos } from '@/hooks/useArticulos';
import { useOutfit } from '@/hooks/useOutfits';
import http from '@/lib/data/http'; 
import { Articulo } from '@/lib/domain/models/articulo';
import { SecureStore } from '@/lib/logic/services/secure-store-service';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CambiarPrenda() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  
  // ID de la prenda a reemplazar
  const prendaIdAntigua = Number(params.prendaIdA_Reemplazar);

  // Hooks
  const { articulos, setArticulos } = useArticulos(); // Asegúrate de que tu hook exponga setArticulos, si no, usa estado local
  const { selectedOutfit, updateOutfit } = useOutfit();

  // Estado local
  const [localArticulos, setLocalArticulos] = useState<Articulo[]>([]); // Usamos esto por si el hook no tiene datos
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // 1. CARGAR DATOS AL ENTRAR (Esto es lo que faltaba)
  useEffect(() => {
    async function cargarArmario() {
      try {
        // Si ya tenemos artículos en el contexto global, los usamos
        if (articulos.length > 0) {
            setLocalArticulos(articulos);
            setIsLoadingData(false);
            return;
        }

        // Si no, los pedimos al servidor
        const userId = await SecureStore.get('userId');
        const data = await http.get<Articulo[]>(
            `articulos?userId=${encodeURIComponent(String(userId))}`
        );
        
        console.log("Prendas cargadas:", data.length); // DEBUG
        setLocalArticulos(data || []);
        
        // Opcional: Actualizar el store global si tienes la función
        // useArticulos.getState().setArticulos(data); 

      } catch (error) {
        console.error("Error cargando armario:", error);
        Alert.alert("Error", "No se pudo cargar tu armario.");
      } finally {
        setIsLoadingData(false);
      }
    }

    cargarArmario();
  }, []);

  // Usamos localArticulos o articulos (el que tenga datos)
  const dataToUse = localArticulos.length > 0 ? localArticulos : articulos;

  // 2. ENCONTRAR LA PRENDA ORIGINAL
  const prendaOriginal = dataToUse.find(a => a.id === prendaIdAntigua);

  // 3. FILTRADO INTELIGENTE
  const prendasFiltradas = dataToUse.filter(item => {
      // A. Filtro por texto
      const matchesSearch = 
        (item.nombre?.toLowerCase() || '').includes(searchText.toLowerCase()) || 
        (item.tipo?.toLowerCase() || '').includes(searchText.toLowerCase());

      // B. Filtro por Categoría (Zona)
      let matchesCategory = true;
      
      // Solo filtramos por zona si:
      // 1. Encontramos la prenda original
      // 2. La prenda original tiene zonas definidas
      // 3. El item actual tiene zonas definidas
      if (prendaOriginal?.zonasCubiertas && prendaOriginal.zonasCubiertas.length > 0 && item.zonasCubiertas) {
          const zonasOriginales = prendaOriginal.zonasCubiertas;
          // Coincide si comparte al menos una zona (ej: ambas son TORSO)
          matchesCategory = item.zonasCubiertas.some(z => zonasOriginales.includes(z));
      }

      return matchesSearch && matchesCategory;
  });

  const handleGuardarCambio = async () => {
      if (!selectedId || !selectedOutfit) return;

      setIsSaving(true);
      try {
          const articulosActuales = selectedOutfit.outfit.articulos || [];
          
          const nuevosArticulos = articulosActuales.map(a => 
              a.id === prendaIdAntigua 
                  ? dataToUse.find(art => art.id === selectedId)! 
                  : a 
          );

          const success = await updateOutfit(selectedOutfit.outfit.id!, nuevosArticulos);
          
          if (success) {
              Alert.alert("¡Hecho!", "Outfit actualizado correctamente.");
              router.back(); 
          } else {
              Alert.alert("Error", "No se pudo actualizar en el servidor.");
          }
      } catch (error) {
          console.error(error);
          Alert.alert("Error", "Ocurrió un error inesperado.");
      } finally {
          setIsSaving(false);
      }
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View 
        style={{ paddingTop: insets.top + 10 }}
        className="px-5 pb-4 border-b border-gray-100 flex-row items-center justify-between"
      >
        <View>
            <Text className="text-xl font-bold text-black">Cambiar Prenda</Text>
            {prendaOriginal ? (
                <Text className="text-xs text-gray-400 font-bold uppercase">
                    Filtrando por: {prendaOriginal.zonasCubiertas?.join(', ') || 'Similar'}
                </Text>
            ) : (
                <Text className="text-xs text-gray-400 font-bold uppercase">
                   Mostrando todo el armario
                </Text>
            )}
        </View>
        <Pressable onPress={() => router.back()} className="p-2 bg-gray-50 rounded-full">
            <CloseIcon color="black" />
        </Pressable>
      </View>

      {/* BUSCADOR */}
      <View className="px-5 py-4">
        <View className="flex-row items-center bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100">
            <Text className="mr-2 text-gray-400">🔍</Text>
            <TextInput 
                placeholder={`Buscar ${prendaOriginal?.tipo?.toLowerCase() || 'prenda'}...`}
                value={searchText}
                onChangeText={setSearchText}
                className="flex-1 text-base text-black"
                placeholderTextColor="#9CA3AF"
            />
        </View>
      </View>

      {/* LISTA */}
      {isLoadingData ? (
          <View className="mt-20">
              <ActivityIndicator size="large" color="#5639F8" />
              <Text className="text-center text-gray-400 mt-4">Cargando armario...</Text>
          </View>
      ) : (
        <FlatList
            data={prendasFiltradas}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            numColumns={2}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
                const isSelected = selectedId === item.id;
                const isCurrent = item.id === prendaIdAntigua;

                return (
                    <Pressable
                        onPress={() => !isCurrent && setSelectedId(item.id!)}
                        className="w-[48%]"
                        style={{ opacity: isCurrent ? 0.6 : 1 }}
                    >
                        <View className={`aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 border-2 relative ${
                            isSelected ? 'border-[#5639F8]' : 'border-transparent'
                        }`}>
                            
                            {item.imageUrl ? (
                                <Image 
                                    source={{ uri: item.imageUrl }} 
                                    className="w-full h-full" 
                                    resizeMode="contain"
                                />
                            ) : (
                                <View className="flex-1 items-center justify-center">
                                    <Text className="text-xs text-gray-400">Sin foto</Text>
                                </View>
                            )}

                            {isSelected && (
                                <View className="absolute top-2 right-2 bg-[#5639F8] w-6 h-6 rounded-full items-center justify-center border border-white">
                                    <Text className="text-white text-xs font-bold">✓</Text>
                                </View>
                            )}

                            {isCurrent && (
                                <View className="absolute bottom-0 w-full bg-gray-800/80 py-1">
                                    <Text className="text-[10px] text-center font-bold text-white">ACTUAL</Text>
                                </View>
                            )}
                        </View>
                        <Text numberOfLines={1} className="text-sm font-bold mt-2 ml-1 text-gray-800">
                            {item.nombre || "Prenda"}
                        </Text>
                    </Pressable>
                );
            }}
            ListEmptyComponent={
                <View className="mt-10 items-center px-10">
                    <Text className="text-gray-400 text-center mb-2">
                        No se encontraron prendas compatibles.
                    </Text>
                    {/* Botón de emergencia para limpiar filtros */}
                    <Pressable onPress={() => setSearchText('')}> 
                        <Text className="text-[#5639F8] font-bold">Ver todo</Text>
                    </Pressable>
                </View>
            }
        />
      )}

      {/* BOTÓN FLOTANTE */}
      {selectedId && (
          <View 
            className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 shadow-lg"
            style={{ paddingBottom: insets.bottom + 10 }}
          >
            <Pressable
                onPress={handleGuardarCambio}
                disabled={isSaving}
                className="w-full bg-[#5639F8] py-4 rounded-2xl items-center shadow-indigo-200 shadow-lg active:opacity-90"
            >
                {isSaving ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold text-lg">Confirmar Cambio</Text>
                )}
            </Pressable>
          </View>
      )}

    </View>
  );
}