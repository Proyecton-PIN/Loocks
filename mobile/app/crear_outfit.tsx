import { useOutfit } from '@/hooks/useOutfits';
import http from '@/lib/data/http';
import { createOutfit as createOutfitService } from '@/lib/logic/services/outfit-service';
import { SecureStore } from '@/lib/logic/services/secure-store-service';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
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
  const [nombre, setNombre] = useState<string>('');
  const [estacion, setEstacion] = useState('PRIMAVERA');
  const [estilo, setEstilo] = useState('CASUAL');

  // enums
  // import dynamically to derive options
  const { Estacion: EstacionEnum } = require('@/lib/domain/enums/estacion');
  const { Estilo: EstiloEnum } = require('@/lib/domain/enums/estilo');
  const estacionOptions: string[] = Object.values(EstacionEnum);
  const estiloOptions: string[] = Object.keys(EstiloEnum).filter((k) =>
    isNaN(Number(k)),
  );
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
      const data = await http.get<Articulo[]>(
        `articulos?userId=${encodeURIComponent(String(UserId))}`,
      );
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
            flatlistRefs.current[i]?.scrollToIndex({
              index: 1,
              animated: false,
            });
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
      Alert.alert(
        'Sin prendas',
        'Selecciona al menos una prenda para el outfit.',
      );
      return;
    }

    setLoading(true);
    try {
      let perfilId = await SecureStore.get('userId');
      if (!perfilId) {
        // best-effort, recommend a cross-platform modal in future
        try {
          // @ts-ignore
          Alert.prompt?.(
            'Perfil faltante',
            'Introduce el id de perfil a usar (userId):',
            (t: string) => (perfilId = t),
          );
        } catch (e) {
          // ignore
        }
      }

      if (!perfilId) {
        Alert.alert('Perfil requerido', 'No se proporcionó id de perfil.');
        setLoading(false);
        return;
      }

      // Build payload including both ids and full articulos so backend accepts previous contract
      const dto = {
        nombre: nombre ?? undefined,
        mood: mood ?? null,
        estacion: estacion ?? 'PRIMAVERA',
        estilo: estilo ?? 'CASUAL',
        articulosIds: selectedIds,
        perfilId: String(perfilId),
        satisfaccion: satisfaccion ?? null,
        isFavorito: Boolean(isFavorito),
        articulos: selectedIds.map((id) => {
          const a = articulos.find((x) => x.id === id) as any;
          return {
            id: a?.id ?? id,
            nombre: a?.nombre ?? `#${id}`,
            marca: a?.marca ?? '',
            fechaCompra: a?.fechaCompra
              ? new Date(a.fechaCompra).toISOString()
              : new Date().toISOString(),
            colores: a?.colores ?? [
              { color: a?.colorPrimario ?? 'unknown', porcentaje: 1 },
            ],
            puedePonerseEncimaDeOtraPrenda:
              a?.puedePonerseEncimaDeOtraPrenda ?? false,
            colorPrimario:
              a?.colorPrimario ?? (a?.colores && a.colores[0]?.color) ?? '',
            estacion: a?.estacion ?? 'PRIMAVERA',
            estilo: a?.estilo ?? 'CASUAL',
            zonasCubiertas: a?.zonasCubiertas ?? ['TORSO'],
            fechaUltimoUso:
              a?.fechaUltimoUso ?? new Date().toISOString().split('T')[0],
            nivelDeAbrigo: a?.nivelDeAbrigo ?? 0,
            usos: a?.usos ?? 0,
            isFavorito: a?.isFavorito ?? Boolean(isFavorito),
            imageUrl: a?.imageUrl ?? '',
            tipo: a?.tipo ?? 'TODAS',
          };
        }),
      } as any;

      console.log('createOutfit dto', dto);
      const created = await createOutfitService(dto);
      if (!created) {
        Alert.alert(
          'Error',
          'No se pudo crear el outfit. Revisa logs para más info.',
        );
      } else if ((created as any).error) {
        const err = created as any;
        console.error('createOutfit server error', err);
        Alert.alert('Error del servidor', `Status ${err.status}: ${err.error}`);
      } else {
        Alert.alert('Éxito', 'Outfit creado correctamente.');
        setSlots([null, null, null]);
        setMood('');
        setSatisfaccion(null);
        setIsFavorito(false);
        useOutfit.getState().addOutfitLog(created);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Ocurrió un problema al crear el outfit.');
    } finally {
      setLoading(false);
    }
  }

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const cardWidth = Math.min(screenWidth - 80, 260);

  // Reserve vertical space for inputs and buttons so the three slots fit
  // without scrolling on typical devices. Tweak constants as needed.
  const TOP_RESERVED = 120; // mood label + input + small spacing
  const BOTTOM_RESERVED = 180; // satisfaction input + favorite + button area
  const availableForSlots = Math.max(
    0,
    screenHeight - TOP_RESERVED - BOTTOM_RESERVED - 32,
  ); // account padding
  const cardHeight = Math.min(cardWidth, Math.floor(availableForSlots / 3));

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F3F3', padding: 16 }}>
      <Stack.Screen options={{ title: 'Crear Outfit' }} />

      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View>
          <Text style={{ color: '#222222', fontSize: 13, marginBottom: 6 }}>
            Slides: desliza para seleccionar la prenda visible
          </Text>

          <Text
            style={{
              color: '#222222',
              marginTop: 8,
              marginBottom: 6,
              fontSize: 13,
            }}
          >
            Nombre del outfit
          </Text>
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej: Look de oficina"
            placeholderTextColor="#888"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#222222',
              padding: 8,
              borderRadius: 8,
              marginBottom: 8,
              fontSize: 13,
            }}
          />

          {[0, 1, 2].map((slotIndex) => {
            const looped = getLoopedData(articulos);

            const onViewableItemsChanged = ({
              viewableItems,
            }: {
              viewableItems: ViewToken[];
            }) => {
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
                  flatlistRefs.current[slotIndex]?.scrollToIndex({
                    index: n,
                    animated: false,
                  });
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
                  flatlistRefs.current[slotIndex]?.scrollToIndex({
                    index: 1,
                    animated: false,
                  });
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
              <View key={slotIndex} style={{ marginBottom: 6 }}>
                <FlatList
                  data={looped}
                  horizontal
                  pagingEnabled
                  snapToAlignment="center"
                  decelerationRate="fast"
                  // Provide getItemLayout so scrollToIndex can calculate positions of offscreen items
                  getItemLayout={(_data, index) => ({
                    length: cardWidth + 8,
                    offset: (cardWidth + 8) * index,
                    index,
                  })}
                  keyExtractor={(i: any, idx: number) => `${i.id}-${idx}`}
                  renderItem={({ item }) => {
                    const isSel = slots[slotIndex] === item.id;
                    return (
                      <View
                        style={{
                          width: cardWidth,
                          paddingRight: 8,
                          alignItems: 'center',
                        }}
                      >
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
                            <Image
                              source={{ uri: item.imageUrl }}
                              style={{ width: '100%', height: '100%' }}
                              resizeMode="cover"
                            />
                          ) : (
                            <View
                              style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Ionicons
                                name="shirt-outline"
                                size={48}
                                color="#555"
                              />
                              <Text style={{ color: '#222222', marginTop: 6 }}>
                                {item.nombre ?? `#${item.id}`}
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: 2,
                    paddingHorizontal: 8,
                    alignItems: 'center',
                  }}
                  ListEmptyComponent={
                    loading ? (
                      <ActivityIndicator
                        size="large"
                        color="#999"
                        style={{ marginTop: 30 }}
                      />
                    ) : (
                      <Text style={{ color: '#222222' }}>No hay prendas</Text>
                    )
                  }
                  ref={(el) => {
                    flatlistRefs.current[slotIndex] = el;
                  }}
                  onViewableItemsChanged={onViewableItemsChanged}
                  viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
                  onScrollToIndexFailed={(info) => {
                    // fallback: scroll to nearest measured index using offset calculation
                    const attempted = info.index ?? 0;
                    try {
                      flatlistRefs.current[slotIndex]?.scrollToOffset({
                        offset: (cardWidth + 8) * attempted,
                        animated: false,
                      });
                    } catch (e) {
                      // ignore failures
                    }
                  }}
                />
              </View>
            );
          })}

          {/* Inputs moved below the slides */}
          <Text style={{ color: '#222222', marginBottom: 6, fontSize: 13 }}>
            Estación
          </Text>
          <View
            style={{
              backgroundColor: '#DFDFDF',
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            <Picker
              selectedValue={estacion}
              onValueChange={(v) => setEstacion(String(v))}
              style={{ color: '#222222' }}
            >
              {estacionOptions.map((e) => (
                <Picker.Item key={e} label={e} value={e} />
              ))}
            </Picker>
          </View>

          <Text style={{ color: '#222222', marginBottom: 6, fontSize: 13 }}>
            Estilo
          </Text>
          <View
            style={{
              backgroundColor: '#DFDFDF',
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            <Picker
              selectedValue={estilo}
              onValueChange={(v) => setEstilo(String(v))}
              style={{ color: '#222222' }}
            >
              {estiloOptions.map((k) => (
                <Picker.Item key={k} label={k} value={k} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={{ paddingTop: 6 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <TouchableOpacity
              onPress={() => setIsFavorito((s) => !s)}
              style={{ marginRight: 8 }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  backgroundColor: isFavorito ? '#ffcc00' : '#DFDFDF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 12 }}>{isFavorito ? '★' : ''}</Text>
              </View>
            </TouchableOpacity>
            <Text style={{ color: '#222222', fontSize: 13 }}>
              Marcar como favorito
            </Text>
          </View>

          <TouchableOpacity
            onPress={guardar}
            style={{
              marginTop: 6,
              backgroundColor: '#5639F8',
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 8,
              alignItems: 'center',
              alignSelf: 'stretch',
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
              {loading ? 'Creando...' : 'Crear Outfit'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
