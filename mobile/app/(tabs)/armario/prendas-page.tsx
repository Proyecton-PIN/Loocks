// PrendasPage.tsx
import { useRef, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import PrendaCategoriaCard from '../../../components/prenda/prendaCategoriaCard';

const categorias = [
  { id: 1, nombre: 'Accesorios', color: 'white', icon: '👜', cantidad: 8 },
  { id: 2, nombre: 'Camisetas', color: 'white', icon: '👕', cantidad: 10 },
  { id: 3, nombre: 'Gorras', color: 'white', icon: '🧢', cantidad: 10 },
  { id: 4, nombre: 'Vestidos', color: 'white', icon: '👗', cantidad: 8 },
  { id: 5, nombre: 'Sudaderas', color: 'white', icon: '🧥', cantidad: 10 },
  { id: 6, nombre: 'Todas', color: 'white', icon: '⭐', cantidad: 27 },
];

export default function PrendasPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const flatListRef = useRef<FlatList<any> | null>(null);

  const handlePress = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
    if (index !== expandedIndex) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index, viewPosition: 0.5 });
      }, 300);
    }
  };

  return (
    <View className="flex-1 bg-[#F6F6F6] pt-2">
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
            expanded={expandedIndex === index}
            onPress={() => handlePress(index)}
          >

            <Text>Contenido personalizado para {item.nombre}</Text>
          </PrendaCategoriaCard>
        )}
        ItemSeparatorComponent={() => <View className="h-4" />}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
        extraData={expandedIndex}
      />
    </View>
  );
}
