import { AntDesign, Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, ImageSourcePropType, Pressable, Text, View } from 'react-native';

// ----------------------------------------------------------------------
// 1. DEFINICIÓN DE TIPOS Y DATOS SIMULADOS
// ----------------------------------------------------------------------

interface Loock {
  id: number;
  imageUrl: ImageSourcePropType;
  isFavorite: boolean;
  date: Date;
  mood: string; 
  estacion: string;
}

// NOTA: La ruta se ajusta a '../../../assets/...' 
// La ruta absoluta relativa es: ../../../assets/imagenes-loockbook/

// Lista de 10 Loocks simulados. La propiedad isFavorite inicial se usa solo como valor por defecto.
const MOCK_LOOCKS: Loock[] = [
  { id: 1, imageUrl: require('../../../assets/imagenes-loockbook/Loock1.png'), isFavorite: true, date: new Date('2025-11-20T10:00:00'), mood: 'Casual', estacion: 'Otoño' },
  { id: 2, imageUrl: require('../../../assets/imagenes-loockbook/Loock2.png'), isFavorite: false, date: new Date('2025-11-19T14:30:00'), mood: 'Chic', estacion: 'Invierno' },
  { id: 3, imageUrl: require('../../../assets/imagenes-loockbook/Loock3.png'), isFavorite: true, date: new Date('2025-11-18T08:00:00'), mood: 'Deportivo', estacion: 'Otoño' },
  { id: 4, imageUrl: require('../../../assets/imagenes-loockbook/Loock4.png'), isFavorite: false, date: new Date('2025-11-17T17:00:00'), mood: 'Formal', estacion: 'Verano' },
  { id: 5, imageUrl: require('../../../assets/imagenes-loockbook/Loock5.png'), isFavorite: true, date: new Date('2025-11-16T09:00:00'), mood: 'Chic', estacion: 'Invierno' },
  { id: 6, imageUrl: require('../../../assets/imagenes-loockbook/Loock6.png'), isFavorite: true, date: new Date('2025-11-15T12:00:00'), mood: 'Casual', estacion: 'Primavera' },
  { id: 7, imageUrl: require('../../../assets/imagenes-loockbook/Loock7.png'), isFavorite: false, date: new Date('2025-11-14T18:00:00'), mood: 'Deportivo', estacion: 'Primavera' },
  { id: 8, imageUrl: require('../../../assets/imagenes-loockbook/Loock8.png'), isFavorite: true, date: new Date('2025-11-13T11:00:00'), mood: 'Formal', estacion: 'Verano' },
  { id: 9, imageUrl: require('../../../assets/imagenes-loockbook/Loock9.png'), isFavorite: false, date: new Date('2025-11-12T13:00:00'), mood: 'Casual', estacion: 'Otoño' },
  { id: 10, imageUrl: require('../../../assets/imagenes-loockbook/Loock10.png'), isFavorite: true, date: new Date('2025-11-11T16:00:00'), mood: 'Chic', estacion: 'Invierno' },
];


// ----------------------------------------------------------------------
// 2. COMPONENTE DE ÍTEM DE LOOCKBOOK (LoockItem)
// ----------------------------------------------------------------------

interface LoockItemProps {
  loock: Loock;
  index: number;
  isFavorite: boolean; // Estado de favorito dinámico
  onToggleFavorite: (id: number) => void; // Función para cambiar el estado
}

// Simula diferentes alturas para el efecto de cascada
const getItemHeight = (id: number): number => {
  if (id % 4 === 0) return 220;
  if (id % 3 === 0) return 150;
  if (id % 2 === 0) return 280;
  return 190;
};

const LoockItem: React.FC<LoockItemProps> = ({ loock, index, isFavorite, onToggleFavorite }) => {
  const itemHeight = getItemHeight(loock.id);
  // Formato: 14 Oct
  const formattedDate = loock.date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).replace('.', '').replace(/ de /g, ' ');

  return (
    <View 
      className={'flex-1 mb-3 rounded-xl overflow-hidden shadow-md bg-white'} 
      style={{ height: itemHeight }}
    >
      <Image 
        source={loock.imageUrl} 
        className="w-full h-full" 
        resizeMode="cover" 
      />
      
      {/* Etiqueta de Fecha */}
      <View className="absolute top-3 right-3 bg-black/60 rounded-lg p-1.5">
          <Text className="text-white text-xs font-semibold">{formattedDate}</Text>
      </View>
      
      {/* Botón de Acción/Favorito (+) */}
      <Pressable 
        className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#5639F8] justify-center items-center"
        onPress={() => onToggleFavorite(loock.id)} // Llama a la función de toggle
      >
        <Ionicons 
          name={isFavorite ? 'star' : 'add'} // Muestra estrella si es favorito
          size={18} 
          color="white" 
        />
      </Pressable>
    </View>
  );
};


// ----------------------------------------------------------------------
// 3. PÁGINA PRINCIPAL (LooksPage)
// ----------------------------------------------------------------------
export default function LooksPage() {
  const logs: Loock[] = MOCK_LOOCKS; 

  // Estado que guarda los IDs de los Loocks marcados como favoritos
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => 
    MOCK_LOOCKS.filter(l => l.isFavorite).map(l => l.id)
  );

  // Función para añadir o quitar un Loock de favoritos
  const toggleFavorite = (id: number) => {
    setFavoriteIds(prevIds => {
        if (prevIds.includes(id)) {
            return prevIds.filter(fId => fId !== id);
        } else {
            return [...prevIds, id];
        }
    });
  };

  // Estado y opciones de los filtros (Estación, Mood, etc.)
  const [selectedEstacion, setSelectedEstacion] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortNewest, setSortNewest] = useState(true);

  // Opciones únicas de los datos simulados para los filtros
  const estacionOptions = useMemo(() => {
    return Array.from(new Set(logs.map((l) => l.estacion).filter(Boolean))) as string[];
  }, [logs]);

  const moodOptions = useMemo(() => {
    return Array.from(new Set(logs.map((l) => l.mood).filter(Boolean))) as string[];
  }, [logs]);

  // Lógica de filtrado y ordenación para la galería principal
  const filtered = useMemo(() => {
    let arr = [...logs];
    
    // El filtro 'Favoritos' en la barra de filtros aplica a esta galería
    if (showFavorites)
        arr = arr.filter(l => favoriteIds.includes(l.id)); // Usa el estado dinámico

    if (selectedEstacion)
      arr = arr.filter((l) => l.estacion === selectedEstacion);
      
    if (selectedMood)
      arr = arr.filter((l) => l.mood === selectedMood);
      
    if (sortNewest) 
      arr.sort((a, b) => b.date.getTime() - a.date.getTime());
      
    return arr;
  }, [logs, selectedEstacion, selectedMood, showFavorites, sortNewest, favoriteIds]); // Dependencia favoriteIds

  const favoriteLoocks = useMemo(() => {
    return logs.filter(l => favoriteIds.includes(l.id))
               .sort((a, b) => b.date.getTime() - a.date.getTime()); // Ordenar favoritos por fecha
  }, [logs, favoriteIds]);


  return (
    <View className="flex-1 bg-[#F3F3F3]">
      {/* La navegación superior se ha eliminado. */}
      
      <FlatList
        className="flex-1"
        contentContainerClassName="px-5 pb-5"
        data={filtered}
        numColumns={2}
        nestedScrollEnabled
        ItemSeparatorComponent={() => <View className="h-0" />} 
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{ gap: 10 }}

        ListHeaderComponent={
          <View>
            {/* 4.2 Título de Favoritos (Tus favoritos ⭐) */}
            <View className="mt-3 mb-2 flex-row items-center">
                <Text className="text-xl font-bold text-gray-900 mr-2">
                    Tus favoritos
                </Text>
                <AntDesign name="star" size={20} color="#333" />
            </View>
            
            {/* NUEVO: Fila Horizontal de Loocks Favoritos */}
            <FlatList
                horizontal
                data={favoriteLoocks}
                keyExtractor={item => 'fav-' + item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="pb-4"
                ListEmptyComponent={() => (
                    <Text className="text-gray-500 italic text-sm py-2">
                        No tienes loocks favoritos aún. ¡Selecciona algunos!
                    </Text>
                )}
                renderItem={({ item }) => (
                    <Pressable 
                        onPress={() => console.log('Navegando a detalle de Loock:', item.id)}
                        // CLASES MODIFICADAS: Aumento de w-28 h-40 a w-32 h-44 para que sean más grandes.
                        className={'w-60 h-80 rounded-xl overflow-hidden shadow-md bg-white mr-3'} 
                    >
                        <Image 
                            source={item.imageUrl} 
                            className="w-full h-full" 
                            resizeMode="cover" 
                        />
                        {/* Botón de toggle en la fila de favoritos */}
                        <Pressable 
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-[#5639F8] justify-center items-center"
                            onPress={() => toggleFavorite(item.id)}
                        >
                            <Ionicons name="star" size={14} color="white" />
                        </Pressable>
                    </Pressable>
                )}
            />
            {/* FIN NUEVO: Fila Horizontal de Loocks Favoritos */}


            {/* 4.3 Contador de Loocks */}
            <Text className="text-sm font-medium text-gray-500 mt-4 mb-4">
              {filtered.length} Loocks
            </Text>

            {/* 4.4 Área de Filtros */}
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                paddingHorizontal: 4,
              }}
              className="mb-4"
            >
              {/* Botón "Filtrar por" */}
              <View className="bg-[#5639F8] py-2 px-3 rounded-full mr-2 mb-2">
                <Text className="text-white font-semibold text-sm">
                  Filtrar por
                </Text>
              </View>

              {/* Filtro: Mood */}
              <Pressable
                onPress={() => {
                  if (moodOptions.length === 0) return;
                  const idx = moodOptions.indexOf(selectedMood ?? '');
                  const next =
                    idx === -1 ? 0 : (idx + 1) % (moodOptions.length + 1);
                  setSelectedMood(next === moodOptions.length ? null : moodOptions[next]);
                }}
                className={clsx(
                  'py-2 px-3 rounded-full mr-2 mb-2 border',
                  selectedMood ? 'bg-indigo-100 border-indigo-300' : 'bg-white border-gray-300'
                )}
              >
                <Text className="text-sm text-gray-700">
                  Mood{selectedMood ? ` · ${selectedMood}` : ''}
                </Text>
              </Pressable>

              {/* Filtro: Estación */}
              <Pressable
                onPress={() => {
                  if (estacionOptions.length === 0) return;
                  const idx = estacionOptions.indexOf(selectedEstacion ?? '');
                  const next =
                    idx === -1 ? 0 : (idx + 1) % (estacionOptions.length + 1);
                  setSelectedEstacion(next === estacionOptions.length ? null : estacionOptions[next]);
                }}
                className={clsx(
                  'py-2 px-3 rounded-full mr-2 mb-2 border',
                  selectedEstacion ? 'bg-indigo-100 border-indigo-300' : 'bg-white border-gray-300'
                )}
              >
                <Text className="text-sm text-gray-700">
                  Estación{selectedEstacion ? ` · ${selectedEstacion}` : ''}
                </Text>
              </Pressable>
              
              {/* Filtro: Más Reciente (toggle) */}
              <Pressable
                onPress={() => setSortNewest((s) => !s)}
                className={clsx(
                  'py-2 px-3 rounded-full mr-2 mb-2 border',
                  sortNewest ? 'bg-[#5639F8] border-[#5639F8]' : 'bg-white border-gray-300'
                )}
              >
                <Text className={clsx('text-sm', sortNewest ? 'text-white' : 'text-gray-700')}>
                  {sortNewest ? 'Más reciente' : 'Ordenar: Fecha'}
                </Text>
              </Pressable>

              {/* Filtro: Favoritos */}
              <Pressable
                onPress={() => setShowFavorites((s) => !s)}
                className={clsx(
                  'py-2 px-3 rounded-full mr-2 mb-2 border',
                  showFavorites ? 'bg-purple-500 border-purple-500' : 'bg-white border-gray-300'
                )}
              >
                <Text className={clsx('text-sm', showFavorites ? 'text-white' : 'text-gray-700')}>
                  {showFavorites ? 'Filtrando: Favoritos' : 'Favoritos'}
                </Text>
              </Pressable>

              {/* Botón Borrar filtros */}
              <Pressable
                onPress={() => {
                  setSelectedEstacion(null);
                  setSelectedMood(null);
                  setShowFavorites(false);
                  setSortNewest(true);
                }}
                className="py-2 px-3 rounded-full mr-2 mb-2 border border-gray-300 bg-white"
              >
                <Text className="text-sm text-gray-700">Borrar filtros</Text>
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => {
              console.log('Navegando a detalle de Loock:', item.id);
            }}
            style={{ flex: 1 }}
          >
            <LoockItem 
              loock={item} 
              index={index} 
              isFavorite={favoriteIds.includes(item.id)} // Pasa el estado dinámico
              onToggleFavorite={toggleFavorite}           // Pasa el handler
            />
          </Pressable>
        )}
      />
    </View>
  );
}