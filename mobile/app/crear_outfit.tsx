import { ApiUrl } from '@/constants/api-constants';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

type Articulo = {
  id: number;
  imageUrl?: string;
  nombre?: string;
};

export default function CrearOutfit() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void fetchArticulos();
  }, []);

  async function fetchArticulos() {
    setLoading(true);
    try {
      const res = await fetch(`${ApiUrl}/api/articulos`);
      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        console.error('Error fetching articulos:', res.status, txt);
        setArticulos([]);
        return;
      }

      const text = await res.text();
      if (!text) {
        setArticulos([]);
        return;
      }

      let parsed: any = null;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        console.error('Invalid JSON from /api/articulos:', e, text);
        setArticulos([]);
        return;
      }

      setArticulos(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudieron cargar las prendas.");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(id: number) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function guardar() {
    if (selected.length === 0) {
      Alert.alert("Sin prendas", "Selecciona al menos una prenda para el outfit.");
      return;
    }

    setLoading(true);
    try {
      // ⚠️ Sustituye este valor por el perfilId real del usuario logueado
      const perfilId = "REEMPLAZAR_POR_PERFIL_ID";

      const body = {
        mood: mood || "General",
        satisfaccion: null,
        isFavorito: false,
        perfilId,
        articuloIds: selected,
      };

      const res = await fetch(`${ApiUrl}/api/outfits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        Alert.alert("Éxito", "Outfit creado correctamente.");
        setSelected([]);
        setMood("");
      } else {
        const txt = await res.text().catch(() => null);
        console.error(res.status, txt);
        Alert.alert("Error", "No se pudo crear el outfit.");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Ocurrió un problema al crear el outfit.");
    } finally {
      setLoading(false);
    }
  }

  const renderItem = ({ item }: { item: Articulo }) => {
    const isSel = selected.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => toggleSelect(item.id)}
        className="w-[48%] h-44 bg-neutral-800 rounded-xl mb-3 overflow-hidden"
        style={{
          borderWidth: isSel ? 3 : 0,
          borderColor: isSel ? "#CFF018" : "transparent",
        }}
      >
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="shirt-outline" size={40} color="#555" />
            <Text className="text-gray-500 mt-2 text-sm">{item.nombre ?? `Prenda #${item.id}`}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black", padding: 16 }}>
      <Stack.Screen options={{ title: "Crear Outfit" }} />

      <ScrollView>
        <Text style={{ color: "white", marginBottom: 6 }}>Categoría (mood)</Text>
        <TextInput
          value={mood}
          onChangeText={setMood}
          placeholder="Ej: Casual, Elegante..."
          placeholderTextColor="#888"
          style={{
            backgroundColor: "#111",
            color: "white",
            padding: 10,
            borderRadius: 8,
            marginBottom: 12,
          }}
        />

        <Text style={{ color: "white", fontSize: 16, marginBottom: 8 }}>Selecciona prendas</Text>
        <FlatList
          data={articulos}
          numColumns={2}
          keyExtractor={(i: any) => String(i.id)}
          renderItem={renderItem}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator size="large" color="#999" style={{ marginTop: 30 }} />
            ) : (
              <Text className="text-gray-500 text-center mt-10">No hay prendas disponibles</Text>
            )
          }
        />

        <TouchableOpacity
          onPress={guardar}
          style={{
            marginTop: 16,
            backgroundColor: "#1e90ff",
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            {loading ? "Guardando..." : "Guardar outfit"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
