import http from '@/lib/data/http';
import { createOutfit as createOutfitService } from '@/lib/logic/services/outfit-service';
import { SecureStore } from '@/lib/logic/services/secure-store-service';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';

type Articulo = {
  id: number;
  imageUrl?: string;
  nombre?: string;
};

export default function CrearOutfit() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [slots, setSlots] = useState<Array<number | null>>([null, null, null]);
  const [mood, setMood] = useState('');
  const [satisfaccion, setSatisfaccion] = useState<string | null>(null);
  const [isFavorito, setIsFavorito] = useState(false);
  const [loading, setLoading] = useState(false);

  // refs to FlatLists so we can programmatically jump for circular behavior
  const flatlistRefs = useRef<Array<FlatList<Articulo> | null>>([]);

  useEffect(() => {
    void fetchArticulos();
  }, []);

  async function fetchArticulos() {
    try {
      setLoading(true);
      const UserId = await SecureStore.get('userId');
      const data = await http.get<Articulo[]>(`articulos?userId=${encodeURIComponent(String(UserId))}`);
      setArticulos(data ?? []);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudieron cargar las prendas.');
      setArticulos([]);
    } finally {
      setLoading(false);
    }
  }

  // initialize slots when articulos load
  useEffect(() => {
    if (articulos.length === 0) return;
    setSlots((prev) => prev.map((s) => (s === null ? articulos[0].id : s)));
    // scroll each flatlist to the first real item after a short delay
    setTimeout(() => {
      for (let i = 0; i < 3; i++) {
        try {
          if (flatlistRefs.current[i] && articulos.length > 1) {
            // looped data uses index 1 as the first real item
            flatlistRefs.current[i]?.scrollToIndex({ index: 1, animated: false });
          }
        } catch (e) {
          // ignore if scroll fails
        }
      }
    }, 80);
  }, [articulos]);

  function getLoopedData(source: Articulo[]) {
    if (!source || source.length <= 1) return source;
    const first = source[0];
    const last = source[source.length - 1];
    return [last, ...source, first];
  }

  function selectForSlot(slotIndex: number, id: number) {
    setSlots((prev) => {
      const copy = [...prev];
      copy[slotIndex] = copy[slotIndex] === id ? null : id;
      return copy;
    });
  }

  async function guardar() {
    const selectedIds = slots.filter((s) => s !== null).map((s) => s as number);
    if (selectedIds.length === 0) {
      Alert.alert('Sin prendas', 'Selecciona al menos una prenda para el outfit.');
      return;
    }

    setLoading(true);
    try {
      let perfilId = await SecureStore.get('userId');
      if (!perfilId) {
        // best-effort, recommend a cross-platform modal in future
        try {
          // @ts-ignore
          Alert.prompt?.('Perfil faltante', 'Introduce el id de perfil a usar (userId):', (t: string) => (perfilId = t));
        } catch (e) {
          // ignore
        }
      }

      if (!perfilId) {
        Alert.alert('Perfil requerido', 'No se proporcionó id de perfil.');
        setLoading(false);
        return;
      }

      const dto = {
        mood: mood || null,
        articulosIds: selectedIds,
        perfilId,
        satisfaccion: satisfaccion ?? null,
        isFavorito: isFavorito ?? false,
      } as any;

      const created = await createOutfitService(dto);
      if (!created) {
        Alert.alert('Error', 'No se pudo crear el outfit.');
      } else {
        Alert.alert('Éxito', 'Outfit creado correctamente.');
        setSlots([null, null, null]);
        setMood('');
        setSatisfaccion(null);
        setIsFavorito(false);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Ocurrió un problema al crear el outfit.');
    } finally {
      setLoading(false);
    }
  }

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = Math.min(screenWidth - 80, 280);
  const cardHeight = Math.round(cardWidth * 0.78);

  return (
    <View style={{ flex: 1, backgroundColor: 'black', padding: 16 }}>
      <Stack.Screen options={{ title: 'Crear Outfit' }} />

      <View style={{ flex: 1 }}>
        <Text style={{ color: 'white', marginBottom: 4, fontSize: 13 }}>Categoría (mood)</Text>
        <TextInput
          value={mood}
          onChangeText={setMood}
          placeholder="Ej: Casual, Elegante..."
          placeholderTextColor="#888"
          style={{ backgroundColor: '#111', color: 'white', padding: 8, borderRadius: 8, marginBottom: 8, fontSize: 13 }}
        />

        <Text style={{ color: 'white', fontSize: 14, marginBottom: 6 }}>Slides: desliza para seleccionar la prenda visible</Text>

        {[0, 1, 2].map((slotIndex) => {
          const looped = getLoopedData(articulos);

          const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (!viewableItems || viewableItems.length === 0) return;
            const vi = viewableItems[0];
            const idx = typeof vi.index === 'number' ? vi.index : -1;
            const n = articulos.length;
            if (n === 0) return;
            if (n === 1) {
              setSlots((prev) => {
                const copy = [...prev];
                copy[slotIndex] = articulos[0].id;
                return copy;
              });
              return;
            }

            // looped: [last, ...originals, first] length = n + 2
            if (idx === 0) {
              // show duplicated last -> jump to real last (index n)
              setTimeout(() => {
                flatlistRefs.current[slotIndex]?.scrollToIndex({ index: n, animated: false });
              }, 60);
              setSlots((prev) => {
                const copy = [...prev];
                copy[slotIndex] = articulos[n - 1].id;
                return copy;
              });
              return;
            }

            if (idx === n + 1) {
              // show duplicated first -> jump to real first (index 1)
              setTimeout(() => {
                flatlistRefs.current[slotIndex]?.scrollToIndex({ index: 1, animated: false });
              }, 60);
              setSlots((prev) => {
                const copy = [...prev];
                copy[slotIndex] = articulos[0].id;
                return copy;
              });
              return;
            }

            if (idx >= 1 && idx <= n) {
              const logicalIndex = idx - 1;
              setSlots((prev) => {
                const copy = [...prev];
                copy[slotIndex] = articulos[logicalIndex].id;
                return copy;
              });
            }
          };

          return (
            <View key={slotIndex} style={{ marginBottom: 8 }}>
              <FlatList
                data={looped}
                horizontal
                pagingEnabled
                snapToAlignment="center"
                decelerationRate="fast"
                keyExtractor={(i: any, idx: number) => `${i.id}-${idx}`}
                renderItem={({ item }) => {
                  const isSel = slots[slotIndex] === item.id;
                  return (
                    <View style={{ width: cardWidth, paddingRight: 8, alignItems: 'center' }}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => selectForSlot(slotIndex, item.id)}
                        style={{
                          width: '100%',
                          height: cardHeight,
                          backgroundColor: '#111',
                          borderRadius: 10,
                          overflow: 'hidden',
                          borderWidth: isSel ? 3 : 0,
                          borderColor: isSel ? '#CFF018' : 'transparent',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: isSel ? 1 : 0.45,
                          transform: [{ scale: isSel ? 1 : 0.94 }],
                        }}
                      >
                        {item.imageUrl ? (
                          <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                        ) : (
                          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="shirt-outline" size={48} color="#555" />
                            <Text style={{ color: '#777', marginTop: 6 }}>{item.nombre ?? `#${item.id}`}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                }}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 2, paddingHorizontal: 16, alignItems: 'center' }}
                ListEmptyComponent={loading ? <ActivityIndicator size="large" color="#999" style={{ marginTop: 30 }} /> : <Text style={{ color: '#777' }}>No hay prendas</Text>}
                ref={(el) => { flatlistRefs.current[slotIndex] = el; }}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
              />
            </View>
          );
        })}

        <View style={{ marginTop: 6 }}>
          <Text style={{ color: 'white', marginBottom: 4, fontSize: 13 }}>Satisfacción (opcional)</Text>
          <TextInput
            value={satisfaccion ?? ''}
            onChangeText={setSatisfaccion}
            placeholder="p.ej. 8/10"
            placeholderTextColor="#888"
            style={{ backgroundColor: '#111', color: 'white', padding: 8, borderRadius: 8, marginBottom: 8, fontSize: 13 }}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <TouchableOpacity onPress={() => setIsFavorito((s) => !s)} style={{ marginRight: 8 }}>
              <View style={{ width: 22, height: 22, borderRadius: 4, backgroundColor: isFavorito ? '#ffcc00' : '#333', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 12 }}>{isFavorito ? '★' : ''}</Text>
              </View>
            </TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 13 }}>Marcar como favorito</Text>
          </View>

          <TouchableOpacity
            onPress={guardar}
            style={{
              marginTop: 6,
              backgroundColor: '#1e90ff',
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 8,
              alignItems: 'center',
              alignSelf: 'stretch',
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>{loading ? 'Creando...' : 'Crear Outfit'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

