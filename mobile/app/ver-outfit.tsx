import { LeftArrowIcon } from '@/constants/icons';
import { useOutfit } from '@/hooks/useOutfits';
import { Stack, router } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VerOutfit() {
  const selected = useOutfit((s) => s.selectedOutfit);
  const insets = useSafeAreaInsets();
  const removeOutfit = useOutfit((s) => s.removeOutfit);

  React.useEffect(() => {
    if (!selected) {    
      router.back();
    }
  }, [selected]);

  if (!selected) return null;

  const outfit = selected.outfit;
  const mainImage =
    outfit.articulos && outfit.articulos.length > 0
      ? outfit.articulos[0].imageUrl
      : undefined;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: insets.top + 10,
          paddingBottom: 8,
        }}
      >
        <Pressable
          onPress={router.back}
          style={{ padding: 8, backgroundColor: '#F3F4F6', borderRadius: 999 }}
        >
          <LeftArrowIcon color="black" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        {mainImage ? (
          <Image
            source={{ uri: mainImage }}
            style={{
              width: '100%',
              aspectRatio: 3 / 4,
              borderRadius: 20,
              backgroundColor: '#f3f3f3',
            }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              width: '100%',
              aspectRatio: 3 / 4,
              borderRadius: 20,
              backgroundColor: '#f3f3f3',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text>No image</Text>
          </View>
        )}

        <View
          style={{
            marginTop: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>
              {selected?.outfit?.id
                ? `Outfit #${selected.outfit.id}`
                : 'Outfit'}
            </Text>
            <Text style={{ color: '#6B7280', marginTop: 4 }}>
              {selected.fechaInicio.toDateString()}
            </Text>
          </View>
          <Text style={{ fontSize: 24 }}>{outfit.isFavorito ? '★' : '☆'}</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginTop: 12,
          }}
        >
          <View
            style={{
              backgroundColor: '#F3F4F6',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              marginRight: 8,
            }}
          >
            <Text style={{ color: '#374151', fontWeight: '600' }}>
              {outfit.estacion}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#F3F4F6',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: '#374151', fontWeight: '600' }}>
              {String(outfit.estilo)}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 16, fontWeight: '700', marginTop: 18 }}>
          Prendas
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 12, gap: 12 }}>
          {outfit.articulos.map((a, i) => (
            <View
              key={i}
              style={{
                width: 96,
                height: 128,
                borderRadius: 12,
                overflow: 'hidden',
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#E5E7EB',
              }}
            >
              {a.imageUrl ? (
                <Image
                  source={{ uri: a.imageUrl }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: '#9CA3AF' }}>
                    {a.nombre ?? `#${a.id}`}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={{ marginTop: 18 }}>
          <Text style={{ fontSize: 16, fontWeight: '700' }}>Detalles</Text>
          <View style={{ marginTop: 8 }}>
            <Text style={{ color: '#374151' }}>
              Número de prendas: {outfit.articulos.length}
            </Text>
            <Text style={{ color: '#374151', marginTop: 6 }}>
              Favorito: {outfit.isFavorito ? 'Sí' : 'No'}
            </Text>
          </View>
        </View>
      </ScrollView>

      
        <Pressable
          className="rounded-2xl py-4 justify-center items-center bg-red-50 mb-10 border border-red-100"
          onPress={async () => {
            await removeOutfit(selected.outfit.id!);
            router.push('/(tabs)/armario/outfits-page');
          }}
        >
          <Text className="text-red-500 font-bold text-lg">
            Eliminar articulo 🗑️
          </Text>
        </Pressable>
    </View>
  );
}
