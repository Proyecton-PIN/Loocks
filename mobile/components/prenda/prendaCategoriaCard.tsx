import { ApiUrl } from '@/constants/api-constants';
import http from '@/lib/data/http';
import { Articulo } from '@/lib/domain/models/articulo';
import clsx from 'clsx';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, Text, TextInput, View } from 'react-native';
import Collapsible from 'react-native-collapsible';

export default function PrendaCategoriaCard({
  initialName,
  initialColor,
  initialIcon,
  cantidad,
  tipo,
  expanded,
  onPress,
}: {
  initialName: string;
  initialColor?: string;
  initialIcon: string;
  cantidad: number;
  tipo: string;
  expanded: boolean;
  onPress: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [icon, setIcon] = useState(initialIcon);
  const [color, setColor] = useState(initialColor || '#FFF');
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!expanded) return;
      setLoading(true);
      try {
        const data = await http.get<Articulo[]>(`articulos/tipo/${tipo}`);
        if (mounted) setArticulos(data ?? []);
      } catch (e) {
        if (mounted) setArticulos([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [expanded, tipo]);

  const ICONS = ['👕', '🧢', '👗', '👜', '⭐', '🧥'];
  const COLORS = ['#FFF', '#FDE68A', '#BFDBFE', '#FECACA', '#DBEAFE', '#C7D2FE'];

  return (
    <View>
      <Pressable
        onPress={onPress}
        className={clsx(
          'rounded-2xl px-6 pt-5 pb-[30px] mb-[-20px] shadow-[0_-10px_20px_rgba(0,0,0,1.7)] bg-[#FFFFFF] flex-row items-center',
          expanded && 'border-blue-400'
        )}
        style={{ backgroundColor: color }}
      >
        <Text className="text-4xl mr-4">{icon}</Text>
        <TextInput
          value={name}
          editable={false}
          className="flex-1 text-lg text-[26px] text-gray-900"
        />
        <Text className="ml-4 text-gray-400 text-base">{cantidad} prendas</Text>
      </Pressable>
      <Collapsible collapsed={!expanded} duration={300}>
        <View className="px-6 py-4 mt-4 rounded-2xl" style={{ backgroundColor: color }}>
          <Text className="text-xs mb-1">Nombre</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            className="border-b border-gray-300 mb-2 text-lg font-bold"
          />
          <Text className="text-xs mb-1">Icono</Text>
          <View className="flex-row mb-2">
            {ICONS.map((ic) => (
              <Pressable key={ic} onPress={() => setIcon(ic)} style={{ marginRight: 8 }}>
                <Text style={{ fontSize: 24 }}>{ic}</Text>
              </Pressable>
            ))}
          </View>
          <Text className="text-xs mb-1">Color</Text>
          <View className="flex-row mb-4">
            {COLORS.map((c) => (
              <Pressable key={c} onPress={() => setColor(c)} style={{
                width: 28, height: 28, borderRadius: 14, backgroundColor: c, marginRight: 8, borderWidth: color === c ? 2 : 0, borderColor: '#333'
              }} />
            ))}
          </View>
          <Text className="font-bold mb-2 text-lg">Artículos</Text>
          {loading && (
            <ActivityIndicator size="small" color="#3B82F6" style={{ marginBottom: 8 }} />
          )}
          <FlatList
            data={articulos}
            horizontal
            keyExtractor={(item, index) => item?.id ? item.id.toString() : String(index)}
            renderItem={({ item }) => {
              const imgUri = item.imageUrl
                ? item.imageUrl.startsWith('http')
                  ? item.imageUrl
                  : item.imageUrl.startsWith('/')
                    ? ApiUrl + item.imageUrl
                    : ApiUrl + '/' + item.imageUrl
                : item.base64Img
                  ? `data:image/jpeg;base64,${item.base64Img}`
                  : '';
              return (
                <Pressable
                  onPress={() => router.push({ pathname: '/ver-articulo', params: { articulo: JSON.stringify(item) } })}
                >
                  {imgUri ? (
                    <Image
                      source={{ uri: imgUri }}
                      style={{ width: 90, height: 120, borderRadius: 16, marginRight: 8 }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={{ width: 90, height: 120, borderRadius: 16, marginRight: 8, backgroundColor: '#F4F4F4', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: '#999' }}>No image</Text>
                    </View>
                  )}
                </Pressable>
              );
            }}
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 8 }}
          />
        </View>
      </Collapsible>
    </View>
  );
}
