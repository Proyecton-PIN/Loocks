import { useOutfit } from '@/hooks/useOutfits';
import http from '@/lib/data/http';
import { createOutfit as createOutfitService } from '@/lib/logic/services/outfit-service';
import { SecureStore } from '@/lib/logic/services/secure-store-service';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import EmblaCarousel from './../components/outfit/EnableCarousel';

const OPTIONS = { loop: true } as const;

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
  const { Estacion: EstacionEnum } = require('@/lib/domain/enums/estacion');
  const { Estilo: EstiloEnum } = require('@/lib/domain/enums/estilo');
  const estacionOptions: string[] = Object.values(EstacionEnum);
  const estiloOptions: string[] = Object.keys(EstiloEnum).filter((k) =>
    isNaN(Number(k)),
  );
  const [satisfaccion, setSatisfaccion] = useState<string | null>(null);
  const [isFavorito, setIsFavorito] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (articulos.length === 0) return;
    setSlots((prev) => prev.map((s) => (s === null ? articulos[0].id : s)));
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
  const ITEM_SPACING = 6;

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
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 16 }}>
      <Stack.Screen options={{ title: 'Crear Outfit' }} />

      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View>
          <Text style={{ color: '#222222', fontSize: 13, marginBottom: 6 }}>
            Slides: desliza para seleccionar la prenda visible
          </Text>

          <Text
            style={{
              color: '#6B7280',
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
              backgroundColor: '#ebeaeaff',
              color: '#222222',
              padding: 8,
              borderRadius: 8,
              marginBottom: 8,
              fontSize: 13,
            }}
          />

          {[0, 1, 2].map((slotIndex) => {
            return (
              <View key={slotIndex} style={{ marginBottom: 6 }}>
                <EmblaCarousel
                  slides={articulos}
                  options={{ loop: true, spacing: 6, itemWidth: cardWidth }}
                  initialIndex={0}
                  onSelect={(logicalIndex, item) => {
                    if (!item) return;
                    // set the slot to the selected item's id
                    setSlots((prev) => {
                      const copy = [...prev];
                      copy[slotIndex] = item.id;
                      return copy;
                    });
                  }}
                  renderSlide={(item) => (
                    <TouchableOpacity
                      activeOpacity={0.95}
                      onPress={() => setSlots((prev) => {
                        const copy = [...prev];
                        copy[slotIndex] = item.id;
                        return copy;
                      })}
                      style={{ width: '100%', height: cardHeight, alignItems: 'center', justifyContent: 'center' }}
                    >
                      {item.imageUrl ? (
                        <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: '100%', backgroundColor: '#FFFFFF' }} resizeMode="contain" />
                      ) : (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                          <Ionicons name="shirt-outline" size={48} color="#555" />
                          <Text style={{ color: '#222222', marginTop: 6 }}>{item.nombre ?? `#${item.id}`}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  )}
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
