import { useArticulos } from '@/hooks/useArticulos';
import { useAuth } from '@/hooks/useAuth';
import { useOutfit } from '@/hooks/useOutfits';
import http from '@/lib/data/http';
import { Articulo } from '@/lib/domain/models/articulo';
import { createOutfit as createOutfitService } from '@/lib/logic/services/outfit-service';
import { SecureStore } from '@/lib/logic/services/secure-store-service';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Picker } from '@react-native-picker/picker';
import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WeatherInfo from '../../components/WeatherInfo';
import EmblaCarousel from './../../components/outfit/EnableCarousel';

const OPTIONS = { loop: true } as const;

export default function CrearOutfit() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [slots, setSlots] = useState<Array<number | null>>([null, null, null]);
  const [accesoriosSeleccionados, setAccesoriosSeleccionados] = useState<
    number[]
  >([]);
  const [accesoriosModalVisible, setAccesoriosModalVisible] = useState(false);
  const [mood, setMood] = useState('');
  const [nombre, setNombre] = useState<string>('');
  const [estacion, setEstacion] = useState('PRIMAVERA');
  const [estilo, setEstilo] = useState('CASUAL');
  const { Estacion: EstacionEnum } = require('@/lib/domain/enums/estacion');
  const { Estilo: EstiloEnum } = require('@/lib/domain/enums/estilo');
  const estacionOptions: string[] = Object.values(EstacionEnum);
  const estiloOptions: string[] = Object.keys(EstiloEnum).filter((k) =>
    isNaN(Number(k)),
  );
  const [satisfaccion, setSatisfaccion] = useState<string | null>(null);
  const [isFavorito, setIsFavorito] = useState(false);
  const [loading, setLoading] = useState(false);
  const profile = useAuth((s) => s.profile);
  const fetchProfile = useAuth((s) => s.fetchProfile);

  const flatlistRefs = useRef<Array<FlatList<Articulo> | null>>([]);
  const loadOutfits = useOutfit((s) => s.loadOutfits);

  useEffect(() => {
    if (!profile) {
      void fetchProfile();
    }
    fetchArticulos();
    loadOutfits();
  }, []);

  const userData = {
    username: profile?.nombreUsuario ?? 'usuario',
  };

  async function fetchArticulos() {
    try {
      setLoading(true);
      const UserId = await SecureStore.get('userId');
      const data = await http.get<Articulo[]>(
        `articulos?userId=${encodeURIComponent(String(UserId))}`,
      );
      setArticulos(data ?? []);
      useArticulos.getState().divideArticulosByTipo(data ?? []);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudieron cargar las prendas.');
      setArticulos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (articulos.length === 0) return;
    setSlots((prev) => prev.map((s) => (s === null ? articulos[0].id! : s)));
    setTimeout(() => {
      for (let i = 0; i < 3; i++) {
        try {
          if (flatlistRefs.current[i] && articulos.length > 1) {
            flatlistRefs.current[i]?.scrollToIndex({
              index: 1,
              animated: false,
            });
          }
        } catch (e) {
          console.error('scrollToIndex error', e);
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
    const allSelectedIds = [...selectedIds, ...accesoriosSeleccionados];
    if (allSelectedIds.length === 0) {
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
        try {
          Alert.prompt?.(
            'Perfil faltante',
            'Introduce el id de perfil a usar (userId):',
            (t: string) => (perfilId = t),
          );
        } catch (e) {}
      }

      if (!perfilId) {
        Alert.alert('Perfil requerido', 'No se proporcionó id de perfil.');
        setLoading(false);
        return;
      }

      const dto = {
        nombre: nombre ?? undefined,
        mood: mood ?? null,
        estacion: estacion ?? 'PRIMAVERA',
        estilo: estilo ?? 'CASUAL',
        articulosIds: allSelectedIds,
        perfilId: String(perfilId),
        satisfaccion: satisfaccion ?? null,
        isFavorito: Boolean(isFavorito),
        articulos: allSelectedIds.map((id) => {
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
  const cardWidth = Math.min(screenWidth - 180, 170);
  const ITEM_SPACING = 6;

  const TOP_RESERVED = 120;
  const BOTTOM_RESERVED = 180;
  const availableForSlots = Math.max(
    0,
    screenHeight - TOP_RESERVED - BOTTOM_RESERVED - 32,
  );
  const cardHeight = Math.min(cardWidth, Math.floor(availableForSlots / 3));
  const [modalVisible, setModalVisible] = useState(false);

  const articulosTorso = articulos.filter((a) =>
    a.zonasCubiertas?.includes('TORSO'),
  );
  const articulosPiernas: (Articulo | undefined)[] = articulos.filter(
    (a) =>
      a.zonasCubiertas?.includes('PIERNAS') && a.zonasCubiertas?.length === 1,
  );
  articulosPiernas.push(undefined);
  const articulosPies = articulos.filter((a) =>
    a.zonasCubiertas?.includes('PIES'),
  );

  // Filtrar accesorios
  const accesorios = articulos.filter((a) =>
    a.zonasCubiertas?.some((z) => ['CABEZA', 'MANOS', 'CUELLO'].includes(z)),
  );

  function toggleAccesorio(id: number) {
    setAccesoriosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function clearAccesorios() {
    setAccesoriosSeleccionados([]);
  }

  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 40,
      }}
    >
      <Stack.Screen options={{ title: 'Crear Outfit' }} />

      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View>
          <View className="px-6">
            <Text
              style={{
                color: '#222222',
                fontSize: 16,
                marginTop: 10,
                marginBottom: 6,
              }}
            >
              ¡Hola {userData.username}!
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 40,
              }}
            >
              <Text
                style={{
                  color: '#222222',
                  fontSize: 23,
                  fontWeight: 'bold',
                }}
              >
                Tu outfit para hoy
              </Text>
              <View style={{ marginRight: 8, marginTop: -40 }}>
                <WeatherInfo />
              </View>
            </View>
          </View>

          {/* Nombre + opciones moved to modal */}

          {[0, 1, 2].map((slotIndex) => {
            return (
              <View key={slotIndex} style={{ marginBottom: 6 }}>
                <EmblaCarousel
                  slides={
                    slotIndex === 0
                      ? articulosTorso.length > 0
                        ? articulosTorso
                        : articulos
                      : slotIndex === 1
                        ? articulosPiernas.length > 0
                          ? articulosPiernas
                          : articulos
                        : articulosPies.length > 0
                          ? articulosPies
                          : articulos
                  }
                  options={{ loop: true, spacing: 20, itemWidth: cardWidth }}
                  initialIndex={0}
                  onSelect={(logicalIndex, item) => {
                    setSlots((prev) => {
                      const copy = [...prev];
                      copy[slotIndex] = item?.id ?? null;
                      return copy;
                    });
                  }}
                  renderSlide={(item) => (
                    <TouchableOpacity
                      activeOpacity={0.95}
                      onPress={() =>
                        setSlots((prev) => {
                          const copy = [...prev];
                          copy[slotIndex] = item.id;
                          return copy;
                        })
                      }
                      style={{
                        width: '100%',
                        height: cardHeight,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item?.imageUrl ? (
                        <Image
                          source={{ uri: item.imageUrl }}
                          style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#FFFFFF',
                          }}
                          resizeMode="contain"
                        />
                      ) : (
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {/* <Ionicons
                            name="shirt-outline"
                            size={48}
                            color="#555"
                          />
                          <Text style={{ color: '#222222', marginTop: 6 }}>
                            {item.nombre ?? `#${item.id}`}
                          </Text> */}
                        </View>
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            );
          })}

          {/* Options moved into modal (Nombre, Estación, Estilo, Favorito) */}
        </View>

        <View
          style={{
            paddingTop: 6,
            display: 'flex',
            flexDirection: 'row',
            paddingHorizontal: 24,
            justifyContent: 'center',
            gap: 70,
          }}
        >
          <TouchableOpacity
            onPress={() => setAccesoriosModalVisible(true)}
            style={{
              marginTop: 8,
              width: '35%',
              backgroundColor: 'white',
              borderColor: '#686868',
              borderWidth: 1,
              paddingVertical: 6,
              borderRadius: 15,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#686868', fontWeight: '600' }}>
                Accesorios{' '}
                {accesoriosSeleccionados.length > 0
                  ? `(${accesoriosSeleccionados.length})`
                  : '+'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="flex-row space-between items-center rounded-[30px] 
            bg-[#E0DBFF] p-[5px] w-min"
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 99999,
                backgroundColor: '#5639F8',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AntDesign name="unlock" size={15} color="white" />
            </View>
            <Text className="text-[14px] font-bold color-[#5639F8] px-2">
              {loading ? 'Creando...' : 'Guardar Outfit'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for accessories selection */}
      {accesoriosModalVisible && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '90%',
              maxHeight: '80%',
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '600' }}>
                Seleccionar accesorios
              </Text>
              <TouchableOpacity
                onPress={() => setAccesoriosModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {accesoriosSeleccionados.length > 0 && (
              <TouchableOpacity
                onPress={clearAccesorios}
                style={{
                  backgroundColor: '#f3f4f6',
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 6,
                  marginBottom: 12,
                  alignSelf: 'flex-start',
                }}
              >
                <Text style={{ color: '#374151', fontSize: 13 }}>
                  Quitar selección ({accesoriosSeleccionados.length})
                </Text>
              </TouchableOpacity>
            )}

            <ScrollView style={{ maxHeight: 400 }}>
              {accesorios.length === 0 ? (
                <Text
                  style={{
                    color: '#6B7280',
                    textAlign: 'center',
                    marginVertical: 20,
                  }}
                >
                  No hay accesorios disponibles
                </Text>
              ) : (
                <View
                  style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}
                >
                  {accesorios.map((acc) => {
                    const isSelected = accesoriosSeleccionados.includes(
                      acc.id!,
                    );
                    return (
                      <TouchableOpacity
                        key={acc.id}
                        onPress={() => toggleAccesorio(acc.id!)}
                        style={{
                          width: '48%',
                          aspectRatio: 1,
                          borderRadius: 8,
                          borderWidth: 2,
                          borderColor: isSelected ? '#5639F8' : '#E5E7EB',
                          backgroundColor: isSelected ? '#EEE9FE' : '#FFFFFF',
                          padding: 8,
                          position: 'relative',
                        }}
                      >
                        {isSelected && (
                          <View
                            style={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              backgroundColor: '#5639F8',
                              borderRadius: 12,
                              width: 24,
                              height: 24,
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 10,
                            }}
                          >
                            <Ionicons
                              name="checkmark"
                              size={16}
                              color="white"
                            />
                          </View>
                        )}
                        {acc.imageUrl ? (
                          <Image
                            source={{ uri: acc.imageUrl }}
                            style={{ width: '100%', height: '80%' }}
                            resizeMode="contain"
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
                              name="bag-outline"
                              size={40}
                              color="#9CA3AF"
                            />
                          </View>
                        )}
                        <Text
                          style={{
                            fontSize: 11,
                            color: '#374151',
                            textAlign: 'center',
                            marginTop: 4,
                          }}
                          numberOfLines={1}
                        >
                          {acc.nombre ?? `#${acc.id}`}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setAccesoriosModalVisible(false)}
              style={{
                backgroundColor: '#5639F8',
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
                marginTop: 16,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>Listo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modal for final outfit details */}
      {modalVisible && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '90%',
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
              Detalles del outfit
            </Text>
            <Text style={{ color: '#6B7280', marginBottom: 6 }}>
              Nombre del outfit
            </Text>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej: Look de oficina"
              placeholderTextColor="#888"
              style={{
                backgroundColor: '#ebeaeaff',
                color: '#222222',
                padding: 8,
                borderRadius: 8,
                marginBottom: 8,
                fontSize: 13,
              }}
            />

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
              >
                {estiloOptions.map((k) => (
                  <Picker.Item key={k} label={k} value={k} />
                ))}
              </Picker>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
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
              <Text style={{ color: '#222222' }}>Marcar como favorito</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ paddingVertical: 10, paddingHorizontal: 14 }}
              >
                <Text style={{ color: '#333' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setModalVisible(false);
                  await guardar();
                }}
                style={{
                  backgroundColor: '#5639F8',
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>
                  {loading ? 'Creando...' : 'Crear'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
