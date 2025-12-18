import { useArticulos } from '@/hooks/useArticulos';
import { useAuth } from '@/hooks/useAuth';
import { useOutfit } from '@/hooks/useOutfits';
import http from '@/lib/data/http';
import { Articulo } from '@/lib/domain/models/articulo';
import { createOutfit as createOutfitService } from '@/lib/logic/services/outfit-service';
import { SecureStore } from '@/lib/logic/services/secure-store-service';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WeatherInfo from '../../components/WeatherInfo';
import EmblaCarousel, { EmblaCarouselRef } from './../../components/outfit/EnableCarousel'; // Asegúrate que la ruta es correcta

const OPTIONS = { loop: true } as const;

export default function CrearOutfit() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [slots, setSlots] = useState<Array<number | null>>([null, null, null]);
  
  // --- REFERENCIAS PARA LOS CARRUSELES (Para hacer el scroll automático) ---
  const carouselRefs = useRef<Array<EmblaCarouselRef | null>>([]);
  
  // --- ESTADOS PARA EL MODAL DE SELECCIÓN ---
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);

  const [accesoriosSeleccionados, setAccesoriosSeleccionados] = useState<number[]>([]);
  const [accesoriosModalVisible, setAccesoriosModalVisible] = useState(false);
  const [mood, setMood] = useState('');
  const [nombre, setNombre] = useState<string>('');
  const [estacion, setEstacion] = useState('PRIMAVERA');
  const [estilo, setEstilo] = useState('CASUAL');
  const { Estacion: EstacionEnum } = require('@/lib/domain/enums/estacion');
  const { Estilo: EstiloEnum } = require('@/lib/domain/enums/estilo');
  const estacionOptions: string[] = Object.values(EstacionEnum);
  const estiloOptions: string[] = Object.keys(EstiloEnum).filter((k) => isNaN(Number(k)));
  const [satisfaccion, setSatisfaccion] = useState<string | null>(null);
  const [isFavorito, setIsFavorito] = useState(false);
  const [loading, setLoading] = useState(false);
  const profile = useAuth((s) => s.profile);
  const fetchProfile = useAuth((s) => s.fetchProfile);

  const loadOutfits = useOutfit((s) => s.loadOutfits);

  useEffect(() => {
    if (!profile) void fetchProfile();
    fetchArticulos();
    loadOutfits();
  }, []);

  const userData = { username: profile?.nombreUsuario ?? 'usuario' };

  async function fetchArticulos() {
    try {
      setLoading(true);
      const UserId = await SecureStore.get('userId');
      const data = await http.get<Articulo[]>(`articulos?userId=${encodeURIComponent(String(UserId))}`);
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
  }, [articulos]);

  // --- FILTROS DE ROPA ---
  const articulosTorso = articulos.filter((a) => a.zonasCubiertas?.includes('TORSO'));
  
  // Tratamiento especial piernas (con undefined al final)
  const articulosPiernasRaw = articulos.filter((a) => a.zonasCubiertas?.includes('PIERNAS') && a.zonasCubiertas?.length === 1);
  const articulosPiernas = [...articulosPiernasRaw];

  const articulosPies = articulos.filter((a) => a.zonasCubiertas?.includes('PIES'));
  const accesorios = articulos.filter((a) => a.zonasCubiertas?.some((z) => ['CABEZA', 'MANOS', 'CUELLO'].includes(z)));

  // --- FUNCIÓN CLAVE: OBTENER DATOS DEL SLOT ---
  // Esta función garantiza que el Carrusel y el Modal vean EXACTAMENTE la misma lista
  const getDataForSlot = (slotIndex: number) => {
      if (slotIndex === 0) return articulosTorso.length > 0 ? articulosTorso : articulos;
      if (slotIndex === 1) return articulosPiernas.length > 0 ? articulosPiernas : articulos;
      if (slotIndex === 2) return articulosPies.length > 0 ? articulosPies : articulos;
      return [];
  };

  // --- SELECCIÓN DESDE EL MODAL ---
  const handleSelectFromGrid = (item: Articulo) => {
      if (activeSlotIndex !== null) {
          // 1. Guardar la prenda en el slot visual
          setSlots((prev) => {
              const copy = [...prev];
              copy[activeSlotIndex] = item.id!;
              return copy;
          });

          // 2. Mover el carrusel mágicamente
          const dataList = getDataForSlot(activeSlotIndex);
          const indexToScroll = dataList.findIndex(a => a?.id === item.id);

          if (indexToScroll !== -1 && carouselRefs.current[activeSlotIndex]) {
              carouselRefs.current[activeSlotIndex]?.scrollToIndex({ 
                  index: indexToScroll, 
                  animated: false // false para que el cambio sea instantáneo al cerrar el modal
              });
          }

          setSelectionModalVisible(false);
      }
  };

  // --- GUARDAR OUTFIT ---
  async function guardar() {
    const selectedIds = slots.filter((s) => s !== null).map((s) => s as number);
    const allSelectedIds = [...selectedIds, ...accesoriosSeleccionados];
    if (allSelectedIds.length === 0) {
      Alert.alert('Sin prendas', 'Selecciona al menos una prenda.');
      return;
    }

    setLoading(true);
    try {
      let perfilId = await SecureStore.get('userId');
      if (!perfilId) {
        Alert.alert('Perfil requerido', 'No se proporcionó id de perfil.');
        setLoading(false);
        return;
      }

      const dto = {
        nombre: nombre || undefined,
        mood: mood || null,
        estacion: estacion,
        estilo: estilo,
        articulosIds: allSelectedIds,
        perfilId: String(perfilId),
        satisfaccion: satisfaccion,
        isFavorito: isFavorito,
        articulos: allSelectedIds.map((id) => {
          const a = articulos.find((x) => x.id === id) as any;
          return {
            id: a?.id ?? id,
            nombre: a?.nombre ?? `#${id}`,
            // ... (resto de campos que ya tenías)
            marca: a?.marca ?? '',
            fechaCompra: a?.fechaCompra ? new Date(a.fechaCompra).toISOString() : new Date().toISOString(),
            colores: a?.colores ?? [{ color: a?.colorPrimario ?? 'unknown', porcentaje: 1 }],
            puedePonerseEncimaDeOtraPrenda: a?.puedePonerseEncimaDeOtraPrenda ?? false,
            colorPrimario: a?.colorPrimario ?? (a?.colores && a.colores[0]?.color) ?? '',
            estacion: a?.estacion ?? 'PRIMAVERA',
            estilo: a?.estilo ?? 'CASUAL',
            zonasCubiertas: a?.zonasCubiertas ?? ['TORSO'],
            fechaUltimoUso: a?.fechaUltimoUso ?? new Date().toISOString().split('T')[0],
            nivelDeAbrigo: a?.nivelDeAbrigo ?? 0,
            usos: a?.usos ?? 0,
            isFavorito: a?.isFavorito ?? Boolean(isFavorito),
            imageUrl: a?.imageUrl ?? '',
            tipo: a?.tipo ?? 'TODAS',
          };
        }),
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
        useOutfit.getState().addOutfitLog(created);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Problema al guardar.');
    } finally {
      setLoading(false);
    }
  }

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const cardWidth = Math.min(screenWidth - 180, 170);
  const availableForSlots = Math.max(0, screenHeight - 120 - 180 - 32);
  const cardHeight = Math.min(cardWidth, Math.floor(availableForSlots / 3));
  const [modalVisible, setModalVisible] = useState(false);

  function toggleAccesorio(id: number) {
    setAccesoriosSeleccionados(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function clearAccesorios() {
    setAccesoriosSeleccionados([]);
  }

  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }}>
      <Stack.Screen options={{ title: 'Crear Outfit' }} />

      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View>
          <View className="px-6">
            <Text style={{ color: '#222222', fontSize: 16, marginTop: 10, marginBottom: 6 }}>¡Hola {userData.username}!</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
              <Text style={{ color: '#222222', fontSize: 23, fontWeight: 'bold' }}>Tu outfit para hoy</Text>
              <View style={{ marginRight: 8, marginTop: -40 }}><WeatherInfo /></View>
            </View>
          </View>

          {/* --- SLOTS (CARRUSELES) --- */}
          {[0, 1, 2].map((slotIndex) => (
            <View key={slotIndex} style={{ marginBottom: 6 }}>
              <EmblaCarousel
                // Asignamos la ref para poder controlarlo
                ref={(el) => {(carouselRefs.current[slotIndex] = el)}}
                slides={getDataForSlot(slotIndex)}
                options={{ loop: true, spacing: 20, itemWidth: cardWidth }}
                initialIndex={1}
                onSelect={(_, item) => {
                  setSlots((prev) => {
                    const copy = [...prev];
                    copy[slotIndex] = item?.id ?? null;
                    return copy;
                  });
                }}
                renderSlide={(item) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    // AL PULSAR -> ABRE EL MODAL
                    onPress={() => {
                      setActiveSlotIndex(slotIndex);
                      setSelectionModalVisible(true);
                    }}
                    style={{ width: '100%', height: cardHeight, alignItems: 'center', justifyContent: 'center' }}
                  >
                    {item?.imageUrl ? (
                      <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: '100%', backgroundColor: '#FFFFFF' }} resizeMode="contain" />
                    ) : (
                      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#ccc' }}>Sin imagen</Text></View>
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          ))}
        </View>

        {/* --- BOTONES INFERIORES --- */}
        <View style={{ paddingTop: 6, flexDirection: 'row', paddingHorizontal: 24, justifyContent: 'center', gap: 70 }}>
          <TouchableOpacity
            onPress={() => setAccesoriosModalVisible(true)}
            style={{ marginTop: 8, width: '35%', backgroundColor: 'white', borderColor: '#686868', borderWidth: 1, paddingVertical: 6, borderRadius: 15, alignItems: 'center' }}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#686868', fontWeight: '600' }}>Accesorios {accesoriosSeleccionados.length > 0 ? `(${accesoriosSeleccionados.length})` : '+'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(true)} className="flex-row items-center rounded-[30px] bg-[#E0DBFF] p-[5px] w-min">
            <View style={{ width: 40, height: 40, borderRadius: 99999, backgroundColor: '#5639F8', alignItems: 'center', justifyContent: 'center' }}>
              <AntDesign name="unlock" size={15} color="white" />
            </View>
            <Text className="text-[14px] font-bold color-[#5639F8] px-2">{loading ? 'Creando...' : 'Guardar Outfit'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- MODAL SELECCIÓN PRENDAS (NUEVO) --- */}
      <Modal
        visible={selectionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectionModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: '70%', padding: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' }}>
                        Seleccionar {activeSlotIndex === 0 ? 'Torso' : activeSlotIndex === 1 ? 'Piernas' : 'Pies'}
                    </Text>
                    <TouchableOpacity onPress={() => setSelectionModalVisible(false)}>
                        <Ionicons name="close-circle" size={30} color="#333" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    // Usamos la misma fuente de datos que el carrusel (filtrando nulls para visualización si es necesario)
                    data={activeSlotIndex !== null ? getDataForSlot(activeSlotIndex).filter(i => i) : []}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            onPress={() => handleSelectFromGrid(item)}
                            style={{ 
                                width: '48%', aspectRatio: 0.8, marginBottom: 15, borderRadius: 10, 
                                backgroundColor: '#f9f9f9', padding: 5,
                                borderWidth: slots[activeSlotIndex!] === item.id ? 2 : 0,
                                borderColor: '#5639F8', overflow: 'hidden'
                            }}
                        >
                            <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: '80%' }} resizeMode="cover" />
                            <View style={{ padding: 5 }}>
                                <Text numberOfLines={1} style={{ fontSize: 12, fontWeight: '600' }}>{item.nombre}</Text>
                            </View>
                            {slots[activeSlotIndex!] === item.id && (
                                <View style={{ position: 'absolute', top: 5, right: 5, backgroundColor: '#5639F8', borderRadius: 10, padding: 2 }}>
                                    <Ionicons name="checkmark" size={14} color="white" />
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<View style={{ marginTop: 50, alignItems: 'center' }}><Text>No se encontraron prendas.</Text></View>}
                />
            </View>
        </View>
      </Modal>

      {/* --- MODAL ACCESORIOS --- */}
      {accesoriosModalVisible && (
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '90%', maxHeight: '80%', backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: '600' }}>Seleccionar accesorios</Text>
              <TouchableOpacity onPress={() => setAccesoriosModalVisible(false)}><Ionicons name="close" size={24} color="#333" /></TouchableOpacity>
            </View>
            <TouchableOpacity onPress={clearAccesorios} style={{ backgroundColor: '#f3f4f6', padding: 8, borderRadius: 6, marginBottom: 12, alignSelf: 'flex-start' }}>
               <Text style={{ color: '#374151', fontSize: 13 }}>Quitar selección ({accesoriosSeleccionados.length})</Text>
            </TouchableOpacity>
            <ScrollView style={{ maxHeight: 400 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {accesorios.map((acc) => {
                    const isSelected = accesoriosSeleccionados.includes(acc.id!);
                    return (
                      <TouchableOpacity key={acc.id} onPress={() => toggleAccesorio(acc.id!)} style={{ width: '48%', aspectRatio: 1, borderRadius: 8, borderWidth: 2, borderColor: isSelected ? '#5639F8' : '#E5E7EB', padding: 8 }}>
                        {isSelected && <View style={{ position: 'absolute', top: 4, right: 4, backgroundColor: '#5639F8', borderRadius: 12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center', zIndex: 10 }}><Ionicons name="checkmark" size={16} color="white" /></View>}
                        <Image source={{ uri: acc.imageUrl }} style={{ width: '100%', height: '80%' }} resizeMode="contain" />
                        <Text style={{ fontSize: 11, textAlign: 'center' }} numberOfLines={1}>{acc.nombre}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
            </ScrollView>
            <TouchableOpacity onPress={() => setAccesoriosModalVisible(false)} style={{ backgroundColor: '#5639F8', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 16 }}><Text style={{ color: 'white', fontWeight: '600' }}>Listo</Text></TouchableOpacity>
          </View>
        </View>
      )}

      {/* --- MODAL GUARDAR (Sin cambios funcionales mayores) --- */}
      {modalVisible && (
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Guardar Outfit</Text>
            <TextInput value={nombre} onChangeText={setNombre} placeholder="Nombre" style={{ backgroundColor: '#eee', padding: 8, borderRadius: 8, marginBottom: 12 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={{ padding: 10 }}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity onPress={async () => { setModalVisible(false); await guardar(); }} style={{ backgroundColor: '#5639F8', padding: 10, borderRadius: 8 }}><Text style={{ color: 'white' }}>Guardar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}