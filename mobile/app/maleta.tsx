import { 
    LeftArrowIcon, 
    TrashIcon, 
    IAIcon, 
    AddIcon 
} from '@/constants/icons';
import { 
    addItemMaleta, 
    deleteItemMaleta, 
    generarMaletaAutomatica, 
    getMaleta, 
    ItemMaleta, 
    toggleItemMaleta 
} from '@/lib/logic/services/maleta-service';
import { Ionicons } from '@expo/vector-icons'; 
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Keyboard,
    Pressable,
    Text,
    TextInput,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MaletaPage() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { planId } = useLocalSearchParams(); 

    // Aseguramos que el ID es un número válido
    const safePlanId = Number(Array.isArray(planId) ? planId[0] : planId);

    const [items, setItems] = useState<ItemMaleta[]>([]);
    const [newItemName, setNewItemName] = useState('');
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        if (safePlanId) cargarItems();
    }, [safePlanId]);

    const cargarItems = async () => {
        const data = await getMaleta(safePlanId);
        setItems(data);
    };

    const handleGenerarAuto = async () => {
        setGenerating(true);
        const data = await generarMaletaAutomatica(safePlanId);
        if (data && data.length > 0) {
            setItems(data);
            Alert.alert("Hemos llenado tu lista con la ropa de tus plan.");
        } else {
            Alert.alert("Aviso", "No hemos encontrado ropa nueva que añadir.");
        }
        setGenerating(false);
    };

    const handleAdd = async () => {
        if (!newItemName.trim()) return;
        
        setLoading(true);
        // Llamada al servicio
        const nuevo = await addItemMaleta(safePlanId, newItemName);
        
        if (nuevo) {
            // Actualizamos la lista localmente
            setItems(prev => [nuevo, ...prev]);
            setNewItemName(''); // Limpiamos el input
            Keyboard.dismiss(); // Bajamos el teclado
        } else {
            Alert.alert("Error", "No se pudo añadir el elemento.");
        }
        setLoading(false);
    };

    const handleToggle = async (id: number) => {
        // Actualización optimista (cambia visualmente al instante)
        setItems(prev => prev.map(i => i.id === id ? { ...i, completado: !i.completado } : i));
        await toggleItemMaleta(id);
    };

    const handleDelete = async (id: number) => {
        Alert.alert("¿Borrar?", "", [
            { text: "Cancelar", style: "cancel" },
            { 
                text: "Borrar", 
                style: "destructive", 
                onPress: async () => {
                    setItems(prev => prev.filter(i => i.id !== id));
                    await deleteItemMaleta(id);
                }
            }
        ]);
    };

    // Cálculos
    const total = items.length;
    const completados = items.filter(i => i.completado).length;
    const porcentaje = total > 0 ? (completados / total) * 100 : 0;

    return (
        <View className="flex-1 bg-white">
            <Stack.Screen options={{ headerShown: false }} />

            {/* HEADER */}
            <View 
                className="flex-row items-center justify-between px-5 pb-4 border-b border-gray-100 bg-white z-10"
                style={{ paddingTop: insets.top + 10 }}
            >
                <Pressable onPress={() => router.back()} className="p-2 bg-gray-50 rounded-full">
                    <LeftArrowIcon color="black" /> 
                </Pressable>

                <Text className="text-lg font-bold text-black">Mi Maleta</Text>
                
                {/* Espacio vacío a la derecha para equilibrar el header */}
                <View className="w-8" />
            </View>

            {/* CONTENIDO */}
            <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                keyboardShouldPersistTaps="always" // Importante para que el botón añadir funcione a la primera
                ListHeaderComponent={
                    <View className="mb-6">
                        
                        {/* 1. BOTÓN DE IMPORTAR (IA) - MUCHO MÁS CLARO */}
                        <Pressable 
                            onPress={handleGenerarAuto} 
                            disabled={generating}
                            className={`flex-row items-center justify-center p-4 rounded-2xl mb-6 border ${generating ? 'bg-gray-100 border-gray-200' : 'bg-purple-50 border-purple-100'}`}
                        >
                            {generating ? (
                                <ActivityIndicator size="small" color="#5639F8"/>
                            ) : (
                                <>
                                    <IAIcon color="#5639F8" />
                                    <Text className="text-[#5639F8] font-bold ml-2 text-base">
                                        Generar maleta automaticamente
                                    </Text>
                                </>
                            )}
                        </Pressable>

                        {/* 2. BARRA DE PROGRESO */}
                        {total > 0 && (
                            <View className="mb-6">
                                <View className="flex-row justify-between mb-2">
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

                        {/* 3. INPUT AÑADIR MANUALMENTE */}
                        <View className="flex-row gap-3 items-center">
                            <TextInput 
                                className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-base text-black"
                                placeholder="Añadir cosa (ej: Cargador)"
                                placeholderTextColor="#9CA3AF"
                                value={newItemName}
                                onChangeText={setNewItemName}
                                onSubmitEditing={handleAdd}
                                returnKeyType="done"
                            />
                            <Pressable 
                                onPress={handleAdd}
                                disabled={loading}
                                className="bg-black w-14 h-14 items-center justify-center rounded-2xl active:bg-gray-800"
                            >
                                {loading ? (
                                    <ActivityIndicator color="white"/> 
                                ) : (
                                    <AddIcon color="white" size={24} />
                                )}
                            </Pressable>
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <Pressable 
                        onPress={() => handleToggle(item.id)}
                        className="flex-row items-center justify-between py-4 border-b border-gray-50 active:bg-gray-50"
                    >
                        <View className="flex-row items-center flex-1 gap-4">
                            {/* Checkbox Circular */}
                            <View className={`w-6 h-6 rounded-full border items-center justify-center ${item.completado ? 'bg-[#5639F8] border-[#5639F8]' : 'border-gray-300'}`}>
                                {item.completado && <Ionicons name="checkmark" size={14} color="white" />}
                            </View>
                            
                            <Text className={`text-base ${item.completado ? 'text-gray-300 line-through' : 'text-gray-800'}`}>
                                {item.nombre}
                            </Text>
                        </View>

                        <Pressable onPress={() => handleDelete(item.id)} className="p-2 opacity-40">
                            <TrashIcon color="#FF4444" size={18} />
                        </Pressable>
                    </Pressable>
                )}
                ListEmptyComponent={
                    <View className="mt-10 items-center px-10">
                        <Text className="text-gray-400 text-center mb-2">Tu maleta está vacía.</Text>
                        <Text className="text-gray-300 text-center text-xs">
                            Añade cosas manualmente o usa el botón de arriba para traer la ropa de tu viaje.
                        </Text>
                    </View>
                }
            />
        </View>
    );
}