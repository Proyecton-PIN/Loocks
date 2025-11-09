import Constants from "expo-constants";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

type Articulo = {
  id: number;
  imageUrl?: string;
  nombre?: string;
};

function getApiUrl() {
  const maybe = (Constants as any).manifest?.extra?.API_URL || (process.env?.API_URL as string);
  return maybe || "http://192.168.43.239:8080";
}

export default function CrearOutfit() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchArticulos();
  }, []);

  async function fetchArticulos() {
    try {
      const res = await fetch(`${getApiUrl()}/api/articulos`);
      const data = await res.json();
      setArticulos(data || []);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudieron cargar las prendas.");
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

      const res = await fetch(`${getApiUrl()}/api/outfits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        Alert.alert("Éxito", "Outfit creado correctamente.");
        setSelected([]);
        setMood("");
      } else {
        const txt = await res.text();
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
      <TouchableOpacity onPress={() => toggleSelect(item.id)} style={{ width: "48%", marginBottom: 10 }}>
        <View
          style={{
            borderWidth: isSel ? 3 : 1,
            borderColor: isSel ? "#00f" : "#666",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={{ width: "100%", height: 140, resizeMode: "cover" }}
            />
          ) : (
            <View
              style={{
                width: "100%",
                height: 140,
                backgroundColor: "#222",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white" }}>Sin imagen</Text>
            </View>
          )}
          <View style={{ padding: 8 }}>
            <Text style={{ color: "white" }}>{item.nombre ?? `Prenda #${item.id}`}</Text>
          </View>
        </View>
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
