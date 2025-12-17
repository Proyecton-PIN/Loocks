import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
    getMaleta, 
    addItemMaleta, 
    toggleItemMaleta, 
    deleteItemMaleta, 
    generarMaletaAutomatica, // <--- Importamos la nueva función
    ItemMaleta 
} from '@/lib/logic/services/maleta-service';

export default function ListaMaleta({ planId }: { planId: number }) {
    const [items, setItems] = useState<ItemMaleta[]>([]);
    const [newItemName, setNewItemName] = useState('');
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        cargarItems();
    }, [planId]);

    const cargarItems = async () => {
        const data = await getMaleta(planId);
        setItems(data);
    };

    // FUNCIÓN MÁGICA
    const handleGenerarAuto = async () => {
        setGenerating(true);
        const data = await generarMaletaAutomatica(planId);
        setItems(data); // Actualizamos la lista con las prendas traídas
        setGenerating(false);
        Alert.alert("¡Listo!", "Hemos añadido toda la ropa de tus outfits a la maleta.");
    };

    const handleAdd = async () => {
        if (!newItemName.trim()) return;
        setLoading(true);
        const nuevo = await addItemMaleta(planId, newItemName);
        if (nuevo) {
            setItems([nuevo, ...items]);
            setNewItemName('');
        }
        setLoading(false);
    };

    const handleToggle = async (id: number) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, completado: !i.completado } : i));
        await toggleItemMaleta(id);
    };

    const handleDelete = async (id: number) => {
        Alert.alert(
            "¿Borrar?",
            "Se eliminará de la lista",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Borrar", 
                    style: "destructive", 
                    onPress: async () => {
                        setItems(prev => prev.filter(i => i.id !== id));
                        await deleteItemMaleta(id);
                    }
                }
            ]
        );
    };

    // Calculamos progreso
    const total = items.length;
    const completados = items.filter(i => i.completado).length;
    const porcentaje = total > 0 ? (completados / total) * 100 : 0;

    return (
        <View className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mt-4">
            
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-black">🧳 Mi Maleta</Text>
                
                {/* BOTÓN MÁGICO */}
                <Pressable 
                    onPress={handleGenerarAuto}
                    disabled={generating}
                    className="bg-purple-100 px-3 py-1 rounded-full flex-row items-center gap-1"
                >
                    {generating ? <ActivityIndicator size="small" color="#5639F8"/> : <Ionicons name="flash" size={12} color="#5639F8" />}
                    <Text className="text-[#5639F8] text-xs font-bold">
                        {generating ? "Generando..." : "Importar Ropa"}
                    </Text>
                </Pressable>
            </View>

            {/* BARRA DE PROGRESO */}
            {total > 0 && (
                <View className="mb-4">
                    <View className="flex-row justify-between mb-1">
                        <Text className="text-xs text-gray-400 font-bold">{Math.round(porcentaje)}% LISTO</Text>
                        <Text className="text-xs text-gray-400">{completados}/{total}</Text>
                    </View>
                    <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <View 
                            className="h-full bg-[#5639F8]" 
                            style={{ width: `${porcentaje}%` }}
                        />
                    </View>
                </View>
            )}
            
            {/* INPUT MANUAL (Por si quiere añadir algo extra como cepillo de dientes) */}
            <View className="flex-row gap-2 mb-4">
                <TextInput 
                    className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-200"
                    placeholder="Añadir extra (ej: Neceser)"
                    value={newItemName}
                    onChangeText={setNewItemName}
                />
                <Pressable 
                    onPress={handleAdd}
                    disabled={loading}
                    className="bg-black w-12 items-center justify-center rounded-xl"
                >
                    <Text className="text-white text-2xl">+</Text>
                </Pressable>
            </View>

            {/* LISTA DE CHECKBOX */}
            {items.length === 0 ? (
                <View className="py-4 items-center">
                    <Text className="text-gray-400 text-center italic mb-2">Tu maleta está vacía.</Text>
                    <Text className="text-gray-300 text-xs text-center">Pulsa "Importar Ropa" para añadir tus outfits.</Text>
                </View>
            ) : (
                <View>
                    {items.map((item) => (
                        <Pressable 
                            key={item.id} 
                            onPress={() => handleToggle(item.id)}
                            className="flex-row items-center justify-between py-3 border-b border-gray-50 active:bg-gray-50"
                        >
                            <View className="flex-row items-center flex-1 gap-3">
                                {/* CHECKBOX PERSONALIZADO */}
                                <View className={`w-6 h-6 rounded-full border items-center justify-center ${item.completado ? 'bg-[#5639F8] border-[#5639F8]' : 'border-gray-300'}`}>
                                    {item.completado && <Ionicons name="checkmark" size={14} color="white" />}
                                </View>
                                
                                <Text className={`text-base ${item.completado ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                    {item.nombre}
                                </Text>
                            </View>
                            
                            <Pressable onPress={() => handleDelete(item.id)} className="p-2 opacity-50">
                                <Ionicons name="close-circle" size={18} color="#999" />
                            </Pressable>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
}