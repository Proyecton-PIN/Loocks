import { useEffect, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import PrendaCategoriaCard from '../../../components/prenda/prendaCategoriaCard';

const categorias = [
  { id: 1, nombre: 'Accesorios', color: '#818cf8', icon: '👜', cantidad: 4, tipo: 'ACCESORIOS' },
  { id: 2, nombre: 'Gorras', color: '#60a5fa', icon: '🧢', cantidad: 8, tipo: 'GORRAS' },
  { id: 3, nombre: 'Vestidos', color: '#d1d5db', icon: '👗', cantidad: 6, tipo: 'VESTIDOS' },
  { id: 4, nombre: 'Pantalones', color: '#fde68a', icon: '👖', cantidad: 7, tipo: 'PANTALONES' },
  { id: 5, nombre: 'Camisetas', color: '#fdba74', icon: '👕', cantidad: 4, tipo: 'CAMISETAS' },
  { id: 6, nombre: 'Sudaderas', color: '#fca5a5', icon: '🧥', cantidad: 8, tipo: 'SUADADERAS' },
  { id: 7, nombre: 'Todas', color: '#fff', icon: '⭐', cantidad: 14, tipo: 'TODAS' },
];

export default function PrendasPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const flatListRef = useRef<FlatList<any> | null>(null);

  useEffect(() => {
    if (expandedIndex !== null) {
      flatListRef.current?.scrollToIndex({ index: expandedIndex, viewPosition: 0.5, animated: true });
    }
  }, [expandedIndex]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F6F6', paddingTop: 8 }}>
      <FlatList
        ref={flatListRef}
        data={categorias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <PrendaCategoriaCard
            initialName={item.nombre}
            initialColor={item.color}
            initialIcon={item.icon}
            cantidad={item.cantidad}
            tipo={item.tipo}
            expanded={expandedIndex === index}
            onPress={() => setExpandedIndex(index === expandedIndex ? null : index)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 6 }}
        extraData={expandedIndex}
        onScrollToIndexFailed={(info) => {
          // If scrollToIndex fails (item not measured yet), fall back to a sensible offset
          const idx = info.index ?? 0;
          const estimatedHeight = 180; // estimate per-category card height
          try {
            flatListRef.current?.scrollToOffset({ offset: idx * estimatedHeight, animated: true });
          } catch (e) {
            // ignore
          }
        }}
      />
    </View>
  );
}
