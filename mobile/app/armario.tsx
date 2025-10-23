import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import type { ListRenderItem } from 'react-native';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import BotonCamara from '../components/boton-camara';

type Prenda = { id: string; img?: any };
type Outfit = { id: string; name: string };
type Mood = { id: string; name: string };

export default function Armario() {
  const [activeTab, setActiveTab] = useState<'prendas' | 'outfits' | 'moods'>(
    'prendas',
  );

  const prendas: Prenda[] = [];
  const outfits: Outfit[] = [];
  const moods: Mood[] = [];

  const renderPrenda: ListRenderItem<Prenda> = () => (
    <View className="w-[48%] h-44 bg-neutral-800 rounded-xl mb-3 items-center justify-center">
      <Ionicons name="shirt-outline" size={40} color="#555" />
      <Text className="text-gray-500 mt-2 text-sm">Prenda</Text>
    </View>
  );

  const renderOutfit: ListRenderItem<Outfit> = () => (
    <View className="w-full bg-neutral-800 rounded-xl p-6 mb-3 items-center justify-center">
      <Ionicons name="color-palette-outline" size={40} color="#555" />
      <Text className="text-gray-500 mt-2 text-sm">Outfit</Text>
    </View>
  );

  const renderMood: ListRenderItem<Mood> = ({ item }) => (
    <View className="flex-row bg-neutral-900 p-4 rounded-xl mb-3 items-center">
      <Ionicons name="happy-outline" size={24} color="#00aaff" />
      <Text className="text-white ml-3 text-base">{item.name}</Text>
    </View>
  );

  const ListHeader = () => (
    <View>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Estadísticas */}
      <View className="flex-row justify-between mb-6">
        <View className="bg-neutral-900 justify-between p-3 rounded-xl w-[31%]">
          <Text className="text-gray-400 text-xm">Prendas</Text>
          <Text className="text-white my-4 text-4xl font-bold">127</Text>
          <Text className="text-gray-500 text-xm">+12 este mes</Text>
        </View>
        <View className="bg-neutral-900  justify-between p-3 rounded-xl w-[31%]">
          <Text className="text-gray-400 text-xm">Uso promedio</Text>
          <Text className="text-white my-4 text-4xl font-bold">68%</Text>
          <Text className="text-gray-500 text-xm">+5% este mes</Text>
        </View>
        <View className="bg-neutral-900  justify-between p-3 rounded-xl w-[31%]">
          <Text className="text-gray-400 text-xm">Outfits</Text>
          <Text className="text-white my-4 text-4xl font-bold">34</Text>
          <Text className="text-gray-500 text-xm">8 nuevos</Text>
        </View>
      </View>

      {/* Tabs funcionales */}
      <View className="flex-row justify-around border-b border-neutral-700 mb-4">
        {(['prendas', 'outfits', 'moods'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`pb-2 ${activeTab === tab ? 'border-b-2 border-white' : ''}`}
          >
            <Text
              className={`${activeTab === tab ? 'text-white' : 'text-gray-400'} capitalize`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
          {/* Botón Añadir según pestaña */}
          
      {activeTab === 'prendas' && <BotonCamara />}

      {activeTab === 'outfits' && (
        <TouchableOpacity className="border border-dashed border-neutral-600 rounded-xl py-4 mb-6 items-center">
          <Text className="text-white">+ Añadir outfit</Text>
        </TouchableOpacity>
      )}
      {activeTab === 'moods' && (
        <TouchableOpacity className="border border-dashed border-neutral-600 rounded-xl py-4 mb-6 items-center">
          <Text className="text-white">+ Añadir mood</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'prendas':
        return (
          <FlatList
            key="prendas"
            data={prendas}
            keyExtractor={(item) => item.id}
            renderItem={renderPrenda}
            numColumns={2}
            ListHeaderComponent={ListHeader}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ paddingBottom: 120 }}
            ListEmptyComponent={
              <Text className="text-gray-500 text-center mt-10">
                No hay prendas todavía
              </Text>
            }
          />
        );
      case 'outfits':
        return (
          <FlatList
            key="outfits"
            data={outfits}
            keyExtractor={(item) => item.id}
            renderItem={renderOutfit}
            numColumns={1}
            ListHeaderComponent={ListHeader}
            contentContainerStyle={{ paddingBottom: 120 }}
            ListEmptyComponent={
              <Text className="text-gray-500 text-center mt-10">
                No hay outfits todavía
              </Text>
            }
          />
        );
      case 'moods':
        return (
          <FlatList
            key="moods"
            data={moods}
            keyExtractor={(item) => item.id}
            renderItem={renderMood}
            numColumns={1}
            ListHeaderComponent={ListHeader}
            contentContainerStyle={{ paddingBottom: 120 }}
            ListEmptyComponent={
              <Text className="text-gray-500 text-center mt-10">
                No hay moods todavía
              </Text>
            }
          />
        );
    }
  };

  return (
    <View className="flex-1 bg-black px-4">
      {renderContent()}

      {/* Botón inferior */}
      <View className="absolute bottom-6 left-0 right-0 items-center"></View>
    </View>
  );
}
