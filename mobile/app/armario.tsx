import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useState } from "react";
import type { ListRenderItem } from "react-native";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import BotonCamara from "../components/boton-camara";

type Prenda = { id: string; img?: any };
type Outfit = { id: string; name: string };
type Mood = { id: string; name: string };

export default function Armario() {
  const [activeTab, setActiveTab] = useState<"prendas" | "outfits" | "moods">("prendas");

  const prendas: Prenda[] = []; // Vacío por ahora
  const outfits: Outfit[] = [];
  const moods: Mood[] = [];

  const renderPrenda: ListRenderItem<Prenda> = ({ item }) => (
    <View className="w-[48%] h-44 bg-neutral-800 rounded-xl mb-3 items-center justify-center">
      <Ionicons name="shirt-outline" size={40} color="#555" />
      <Text className="text-gray-500 mt-2 text-sm">Prenda</Text>
    </View>
  );

  const renderOutfit: ListRenderItem<Outfit> = ({ item }) => (
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

      {/* Header */}
      <View className="flex-row justify-between items-center mt-10 mb-5">
        <Text className="text-white text-3xl font-semibold py-6">loocks</Text>
        <View className="flex-row items-center space-x-2">
          <Ionicons className="mr-6" name="search-outline" size={28} color="white" />
          <Ionicons name="person-circle-outline" size={30} color="#00aaff" />
        </View>
      </View>

      {/* Estadísticas */}
      <View className="flex-row justify-between mb-6">
        <View className="bg-neutral-900 p-3 rounded-xl w-[31%]">
          <Text className="text-gray-400 text-xs">Prendas</Text>
          <Text className="text-white text-xl font-bold">127</Text>
          <Text className="text-gray-500 text-xs">+12 este mes</Text>
        </View>
        <View className="bg-neutral-900 p-3 rounded-xl w-[31%]">
          <Text className="text-gray-400 text-xs">Uso promedio</Text>
          <Text className="text-white text-xl font-bold">68%</Text>
          <Text className="text-gray-500 text-xs">+5% vs mes anterior</Text>
        </View>
        <View className="bg-neutral-900 p-3 rounded-xl w-[31%]">
          <Text className="text-gray-400 text-xs">Outfits</Text>
          <Text className="text-white text-xl font-bold">34</Text>
          <Text className="text-gray-500 text-xs">8 nuevos</Text>
        </View>
      </View>

      {/* Tabs funcionales */}
      <View className="flex-row justify-around border-b border-neutral-700 mb-4">
        {(["prendas", "outfits", "moods"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`pb-2 ${activeTab === tab ? "border-b-2 border-white" : ""}`}
          >
            <Text
              className={`${activeTab === tab ? "text-white" : "text-gray-400"} capitalize`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Añadir prenda solo visible en pestaña "prendas" */}
      {activeTab === "prendas" && (
        <TouchableOpacity className="border border-dashed border-neutral-600 rounded-xl py-4 mb-6 items-center">
          <Text className="text-white">+ Añadir prenda</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "prendas":
        return (
          <FlatList
            data={prendas}
            keyExtractor={(item) => item.id}
            renderItem={renderPrenda}
            numColumns={2}
            ListHeaderComponent={ListHeader}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{ paddingBottom: 120 }}
            ListEmptyComponent={
              <Text className="text-gray-500 text-center mt-10">
                No hay prendas todavía
              </Text>
            }
          />
        );
      case "outfits":
        return (
          <FlatList
            data={outfits}
            keyExtractor={(item) => item.id}
            renderItem={renderOutfit}
            ListHeaderComponent={ListHeader}
            contentContainerStyle={{ paddingBottom: 120 }}
            ListEmptyComponent={
              <Text className="text-gray-500 text-center mt-10">
                No hay outfits todavía
              </Text>
            }
          />
        );
      case "moods":
        return (
          <FlatList
            data={moods}
            keyExtractor={(item) => item.id}
            renderItem={renderMood}
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
      <View className="absolute bottom-6 left-0 right-0 items-center">
        <BotonCamara />
      </View>
    </View>
  );
}
