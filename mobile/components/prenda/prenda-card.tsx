import { Prenda } from '@/lib/domain/models/prenda';
import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, View } from 'react-native';

interface Props {
  data: Prenda;
  onPress(data: Prenda): void;
}

export default function PrendaCard({ data, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress(data)}
      className="w-[48%] h-44 rounded-xl mb-3 overflow-hidden items-center justify-center"
    >
      {data.imageUrl ? (
        <Image
          source={{ uri: data.imageUrl }}
          className="w-full h-full"
          style={{ backgroundColor: 'transparent' }}
          resizeMode="contain"
        />
      ) : (
        <View className="borderw-full h-full bg-neutral-800 items-center justify-center">
          <Ionicons name="shirt-outline" size={40} color="#555" />
        </View>
      )}
    </Pressable>
  );
}
