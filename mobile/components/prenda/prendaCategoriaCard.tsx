import { ApiUrl } from '@/constants/api-constants';
import { useArticulos } from '@/hooks/useArticulos';
import http from '@/lib/data/http';
import { Articulo } from '@/lib/domain/models/articulo';
import clsx from 'clsx';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, Text, TextInput, View } from 'react-native';
import Collapsible from 'react-native-collapsible';


export default function PrendaCategoriaCard({
  initialName,
  initialColor,
  initialIcon: IconComponent,
  cantidad,
  tipo,
  expanded,
  onPress,
}: {
  initialName: string;
  initialColor?: string;
  initialIcon: React.ElementType;
  cantidad: number;
  tipo: string;
  expanded: boolean;
  onPress: () => void;
}) {
  const [name] = useState(initialName);
  const [color] = useState(initialColor || '#FFF');
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(false);
  const itemMargin = 8;
  const numColumns = 2;
  const hayArticulos = articulos.length > 0;

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
    return () => {
      mounted = false;
    };
  }, [expanded, tipo]);

  const gridArticulos = useMemo(() => {
    // Si el número es impar, excluimos el último elemento de la lista principal
    if (articulos.length % numColumns !== 0) {
      return articulos.slice(0, -1); // Excluye el último
    }
    return articulos; // Si es par, usamos todos
  }, [articulos, numColumns]);

  const renderFooter = () => {
    if (articulos.length % 2 !== 0) {
      const ultimoArticulo = articulos[articulos.length - 1];
      const imgUri = ultimoArticulo.imageUrl
        ? ultimoArticulo.imageUrl.startsWith('http')
          ? ultimoArticulo.imageUrl
          : ultimoArticulo.imageUrl.startsWith('/')
            ? ApiUrl + ultimoArticulo.imageUrl
            : ApiUrl + '/' + ultimoArticulo.imageUrl
        : ultimoArticulo.base64Img
          ? `data:image/jpeg;base64,${ultimoArticulo.base64Img}`
          : '';

      return (
        // Contenedor que centra el Pressable
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Pressable
            onPress={() => {
              try {
                useArticulos.getState().selectArticulo(ultimoArticulo);
              } catch (e) {
                console.warn('Could not select articulo in store', e);
              }
              router.push('/ver-articulo');
            }}
            style={{
              width: '50%', 
              backgroundColor: 'white',
              borderRadius: 12,
              overflow: 'hidden',
              padding: 8,
              aspectRatio: 1 / 1.5,
              margin: itemMargin / 2, // Mantenemos el margen del grid
            }}
          >
            {imgUri ? (
              <Image
                source={{ uri: imgUri }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 8,
                }}
                resizeMode="contain"
              />
            ) : null}
          </Pressable>
        </View>
      );
    }
    return null;
  };

  return (
    <View>
      <Pressable
        onPress={onPress}
        className={clsx(
          'rounded-t-2xl px-6 pt-5 pb-[30px] mb-[-30px] shadow-[0_-10px_20px_rgba(0,0,0,1.7)] bg-[#FFFFFF] flex-row items-center',
          expanded && 'border-blue-400',
        )}
        style={{ backgroundColor: color }}
      >
        <View className="text-4xl mr-4"><IconComponent /></View>
        <TextInput
          value={name}
          editable={false}
          className="flex-1 text-lg text-[26px] text-gray-900"
        />
        <Text className="ml-4 text-gray-400 text-base">{cantidad} prendas</Text>
      </Pressable>
      <Collapsible collapsed={!expanded} duration={300}>
        <View
          className="px-6 py-4 mt-4 rounded-2xl"
          style={{ backgroundColor: color }}
        >
          <Text className="font-bold mb-2 text-lg">Artículos</Text>
          {loading && (
            <ActivityIndicator
              size="large"
              color="#3B82F6"
              style={{ marginBottom: 8 }}
            />
          )}
          {!loading && !hayArticulos ? (
            <Text className="text-center text-lg text-gray-600 my-4">
              No hay artículos en esta categoría
            </Text>
          ) : (
          <FlatList
            data={gridArticulos}
            numColumns={2}
            keyExtractor={(item, index) =>
              item?.id ? item.id.toString() : String(index)
            }
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
                  onPress={() => {
                    // set selected articulo in store then navigate
                    try {
                      useArticulos.getState().selectArticulo(item);
                    } catch (e) {
                      console.warn('Could not select articulo in store', e);
                    }
                    router.push('/ver-articulo');
                  }}
                  style={{
                    flex: 1,
                    margin: itemMargin / 2,
                    backgroundColor: 'white',
                    borderRadius: 12,
                    overflow: 'hidden',
                    padding: 10,
                    aspectRatio: 1 / 1.5,
                  }}
                >
                  {imgUri ? (
                    <Image
                      source={{ uri: imgUri }}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 8,
                      }}
                      resizeMode="contain"
                    />
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        margin: imgUri.length / 2,
                        width: '100%',
                        height: '100%',
                        borderRadius: 8,
                        backgroundColor: '#F4F4F4',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: '#999' }}>No image</Text>
                    </View>
                  )}
                </Pressable>
              );
            }}
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 8, marginHorizontal: -itemMargin / 2 }}
            ListFooterComponent={renderFooter}
          />
          )}
        </View>
      </Collapsible>
    </View>
  );
}
