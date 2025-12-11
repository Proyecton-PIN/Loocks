import { AccesoriosIcon, CamisetasIcon, ChaquetaIcon, GorrasIcon, PantalonesIcon, StarIcon, SudaderasIcon, VestidosIcon, ZapatosIcon } from '@/constants/icons';
import { useEffect, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import PrendaCategoriaCard from '../../../components/prenda/prendaCategoriaCard';

const categorias = [
  {
    id: 1,
    nombre: 'Accesorios',
    color: '#818cf8',
    icon: AccesoriosIcon,
    cantidad: 4,
    tipo: 'ACCESORIOS',
  },
  {
    id: 2,
    nombre: 'Gorras',
    color: '#60a5fa',
    icon: GorrasIcon,
    cantidad: 8,
    tipo: 'GORRAS',
  },
  {
    id: 3,
    nombre: 'Vestidos',
    color: '#d1d5db',
    icon: VestidosIcon,
    cantidad: 6,
    tipo: 'VESTIDOS',
  },
  {
    id: 4,
    nombre: 'Pantalones',
    color: '#fde68a',
    icon: PantalonesIcon,
    cantidad: 7,
    tipo: 'PANTALONES',
  },
  {
    id: 5,
    nombre: 'Camisetas',
    color: '#fdba74',
    icon: CamisetasIcon,
    cantidad: 4,
    tipo: 'CAMISETAS',
  },
  {
    id: 6,
    nombre: 'Sudaderas',
    color: '#fca5a5',
    icon: SudaderasIcon,
    cantidad: 8,
    tipo: 'SUDADERAS',
  },
  {
    id: 7,
    nombre: 'Zapatos',
    color: '#a6d0f0',
    icon: ZapatosIcon,
    cantidad: 8,
    tipo: 'ZAPATOS',
  },
  {
    id: 8,
    nombre: 'Chaquetas',
    color: '#f8e0ac',
    icon: ChaquetaIcon,
    cantidad: 8,
    tipo: 'CHAQUETAS',
  },
  {
    id: 9,
    nombre: 'Todas',
    color: '#fff',
    icon: StarIcon,
    cantidad: 14,
    tipo: 'TODAS',
  },
];

export default function PrendasPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const flatListRef = useRef<FlatList<any> | null>(null);
  const [nothing, setNothing] = useState(false);

  const updateView = () => setNothing(!nothing);

  useEffect(() => {
    if (expandedIndex !== null) {
      flatListRef.current?.scrollToIndex({
        index: expandedIndex,
        viewPosition: 0.5,
        animated: true,
      });
    }
  }, [expandedIndex]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F6F6' }}>
      <FlatList
        ref={flatListRef}
        data={categorias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <PrendaCategoriaCard
            initialName={item.nombre}
            initialColor={item.color}
            initialIcon={item.icon}
            tipo={item.tipo}
            onClose={(name, color) => {
              const idx = categorias.findIndex((v) => v.tipo === item.tipo);
              categorias[idx].nombre = name;
              if (color) categorias[idx].color = color;
              updateView();
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
        extraData={expandedIndex}
        getItemLayout={(_data, index) => {
          const estimatedHeight = 180;
          return {
            length: estimatedHeight,
            offset: estimatedHeight * index,
            index,
          };
        }}
        onScrollToIndexFailed={(info) => {
          const idx = info.index ?? 0;
          const estimatedHeight = 180;
          try {
            flatListRef.current?.scrollToOffset({
              offset: idx * estimatedHeight,
              animated: true,
            });
          } catch (e) {}
        }}
      />
    </View>
  );
}
