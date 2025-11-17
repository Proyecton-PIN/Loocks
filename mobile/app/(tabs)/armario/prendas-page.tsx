import { Ionicons } from '@expo/vector-icons';
import { FlatList, TouchableOpacity, View } from 'react-native';
import PrendaCategoriaCard from '../../../components/prenda/prendaCategoriaCard';

const categorias = [
  { id: 1, nombre: 'Accesorios', color: '#E5E5F5', icon: '👜', cantidad: 8 },
  { id: 2, nombre: 'Camisetas', color: '#FFE5F5', icon: '👕', cantidad: 10 },
  { id: 3, nombre: 'Gorras', color: '#E5F5FF', icon: '🧢', cantidad: 10 },
  { id: 4, nombre: 'Vestidos', color: '#FFF5E5', icon: '👗', cantidad: 8 },
  { id: 5, nombre: 'Sudaderas', color: '#F5E5FF', icon: '🧥', cantidad: 10 },
  { id: 6, nombre: 'Todas', color: '#E5FFE5', icon: '⭐', cantidad: 27 },
];

export default function PrendasPage() {
  return (
    <View className="flex-1 bg-[#F6F6F6] pt-2">
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PrendaCategoriaCard
            initialName={item.nombre}
            initialColor={item.color}
            initialIcon={item.icon}
            cantidad={item.cantidad}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-4" />}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
      />
      <View className="absolute bottom-10 left-0 right-0 items-center pointer-events-none">
        <TouchableOpacity
          onPress={() => {}}
          className="w-18 h-18 rounded-full bg-[#5639F8] items-center justify-center shadow-lg pointer-events-auto"
          style={{ elevation: 8 }}
        >
          <Ionicons name="add" size={46} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
