import OutfitCard from '@/components/outfit/outfit-card';
import ProbadorOutfitModal from '@/components/outfit/probador-outfit-modal';
import SuggestedOutfitsRow from '@/components/outfit/suggested-outfits-row';
import { IAIcon } from '@/constants/icons';
import { useOutfit } from '@/hooks/useOutfits';
import clsx from 'clsx';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

export default function OutfitsPage() {
  const logs = useOutfit((s) => s.logs);
  const loadOutfits = useOutfit((s) => s.loadOutfits);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     loadOutfits();
  //   }, [loadOutfits])
  // );

  // Filter state
  const [selectedEstacion, setSelectedEstacion] = useState<string | null>(null);
  const [selectedEstilo, setSelectedEstilo] = useState<string | null>(null);
  const [sortNewest, setSortNewest] = useState(false);

  const estacionOptions = useMemo(() => {
    return Array.from(
      new Set(logs.map((l) => l.outfit?.estacion).filter(Boolean)),
    ) as string[];
  }, [logs]);

  const estiloOptions = useMemo(() => {
    return Array.from(
      new Set(logs.map((l) => String(l.outfit?.estilo)).filter(Boolean)),
    ) as string[];
  }, [logs]);

  const filtered = useMemo(() => {
    let arr = [...logs];
    if (selectedEstacion)
      arr = arr.filter((l) => l.outfit?.estacion === selectedEstacion);
    if (selectedEstilo)
      arr = arr.filter((l) => String(l.outfit?.estilo) === selectedEstilo);
    if (sortNewest)
      arr.sort((a, b) => b.fechaInicio.getTime() - a.fechaInicio.getTime());
    return arr;
  }, [logs, selectedEstacion, selectedEstilo, sortNewest]);

  return (
    <View className="flex-1">
      <FlatList
        initialNumToRender={6}
        className="flex-1"
        contentContainerClassName="px-5"
        ListHeaderComponent={
          <View>
            <SuggestedOutfitsRow />

            {/* Filter area (wrap into multiple rows) */}
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginTop: 18,
                paddingHorizontal: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: '#F3F4F6',
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 20,
                  marginRight: 8,
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: '#374151', fontWeight: '600' }}>
                  Filtrar por
                </Text>
              </View>

              <Pressable
                onPress={() => {
                  if (estiloOptions.length === 0) return;
                  const idx = estiloOptions.indexOf(selectedEstilo ?? '');
                  const next =
                    idx === -1 ? 0 : (idx + 1) % (estiloOptions.length + 1);
                  if (next === estiloOptions.length) setSelectedEstilo(null);
                  else setSelectedEstilo(estiloOptions[next]);
                }}
                style={{
                  backgroundColor: selectedEstilo ? '#EEF2FF' : '#FFFFFF',
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 20,
                  marginRight: 8,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}
              >
                <Text style={{ color: '#374151' }}>
                  Mood{selectedEstilo ? ` · ${selectedEstilo}` : ''}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  if (estacionOptions.length === 0) return;
                  const idx = estacionOptions.indexOf(selectedEstacion ?? '');
                  const next =
                    idx === -1 ? 0 : (idx + 1) % (estacionOptions.length + 1);
                  if (next === estacionOptions.length)
                    setSelectedEstacion(null);
                  else setSelectedEstacion(estacionOptions[next]);
                }}
                style={{
                  backgroundColor: selectedEstacion ? '#EEF2FF' : '#FFFFFF',
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 20,
                  marginRight: 8,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}
              >
                <Text style={{ color: '#374151' }}>
                  Estación{selectedEstacion ? ` · ${selectedEstacion}` : ''}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setSortNewest((s) => !s)}
                style={{
                  backgroundColor: sortNewest ? '#5639F8' : '#FFFFFF',
                  paddingVertical: 7,
                  paddingHorizontal: 12,
                  borderRadius: 20,
                  marginRight: 8,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}
              >
                <Text style={{ color: sortNewest ? '#FFFFFF' : '#374151' }}>
                  {sortNewest ? 'Más reciente' : 'Ordenar: reciente'}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setSelectedEstacion(null);
                  setSelectedEstilo(null);
                  setSortNewest(false);
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 20,
                  marginRight: 8,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}
              >
                <Text style={{ color: '#374151' }}>Borrar filtros</Text>
              </Pressable>
            </View>

            <Text
              style={{
                fontFamily: 'Satoshi',
                fontWeight: 700,
                fontSize: 24,
                letterSpacing: 0,
                marginTop: 12,
                marginBottom: 12,
              }}
            >
              {filtered.length} Outfits
            </Text>
          </View>
        }
        data={filtered.reverse()}
        numColumns={2}
        nestedScrollEnabled
        ItemSeparatorComponent={(_) => <View className="h-10" />}
        renderItem={(e) => (
          <Pressable
            onPress={() => {
              useOutfit.getState().selectOutfit?.(e.item);
              router.push('/ver-outfit' as any);
            }}
            style={{ flex: 1 }}
          >
            <View className="flex-1">
              <OutfitCard
                data={e.item.outfit}
                className={clsx(
                  'flex-1 h-[260]',
                  e.index % 1 === 1 ? 'ml-[5]' : 'mr-[5]',
                )}
              />
              <Text className="py-2">{e.item.fechaInicio.toDateString()}</Text>
            </View>
          </Pressable>
        )}
      />
      <ProbadorOutfitModal />

      <Pressable
        className="absolute bottom-5 left-5 w-[58] h-[58] rounded-full justify-center items-center shadow-lg shadow-indigo-300"
        style={{ backgroundColor: '#5639F8' }}
        onPress={() => {
          // Navegamos a la pantalla del generador
          router.push('/generador-outfit');
        }}
      >
        <IAIcon color="white" />
      </Pressable>
      {/* ------------------------------------------- */}
    </View>
  );
}
