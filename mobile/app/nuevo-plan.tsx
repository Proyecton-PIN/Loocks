import { CloseIcon } from '@/constants/icons';
import { usePlanning } from '@/hooks/usePlanificacion'; 
import { Stack, useRouter } from 'expo-router'; // <--- 1. CAMBIO: Importamos useRouter
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CrearPlan() {
  const insets = useSafeAreaInsets();
  const router = useRouter(); // <--- 2. CAMBIO: Usamos el Hook (Más seguro)
  const { createNewPlan, isLoading } = usePlanning();

  const [titulo, setTitulo] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [isViaje, setIsViaje] = useState(true); 
  
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0]);

  const handleGuardar = async () => {
    if (!titulo || !ubicacion) {
        Alert.alert("Faltan datos", "Por favor pon un título y ubicación.");
        return;
    }

    const success = await createNewPlan({
        titulo,
        ubicacion,
        isMaleta: isViaje,
        fechaInicio: fechaInicio, 
        fechaFin: fechaFin,
    });

    if (success) {
        Alert.alert("¡Plan Creado!", isViaje ? "Estamos preparando tu maleta con la IA..." : "Evento guardado.");
        router.back();
    } else {
        Alert.alert("Error", "No se pudo guardar el plan.");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View
        className="flex-row items-center justify-between px-5 pb-4 border-b border-gray-100"
        style={{ paddingTop: insets.top + 10 }}
      >
        <Text className="text-xl font-bold text-black">Nuevo Plan</Text>
        {/* 3. CAMBIO: Función flecha para asegurar que router existe */}
        <Pressable onPress={() => router.back()} className="p-2">
           <CloseIcon color="black" /> 
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingVertical: 20 }}>
        
        {/* TIPO DE PLAN (Selector) */}
        <Text className="text-xs font-bold text-gray-400 uppercase mb-3">¿QUÉ VAMOS A HACER?</Text>
        <View className="flex-row bg-gray-50 p-1 rounded-xl mb-8">
            <Pressable 
                onPress={() => setIsViaje(true)}
                className={`flex-1 py-3 rounded-lg items-center ${isViaje ? 'bg-white shadow-sm' : ''}`}
            >
                <Text className={`font-bold ${isViaje ? 'text-purple-600' : 'text-gray-400'}`}>✈️ VIAJE</Text>
            </Pressable>
            <Pressable 
                onPress={() => setIsViaje(false)}
                className={`flex-1 py-3 rounded-lg items-center ${!isViaje ? 'bg-white shadow-sm' : ''}`}
            >
                <Text className={`font-bold ${!isViaje ? 'text-blue-600' : 'text-gray-400'}`}>📅 EVENTO</Text>
            </Pressable>
        </View>

        {/* DATOS BÁSICOS */}
        <View className="gap-6">
            <View>
                <Text className="text-sm font-bold text-gray-700 mb-2">Título</Text>
                <TextInput 
                    value={titulo}
                    onChangeText={setTitulo}
                    placeholder={isViaje ? "Ej: Escapada a Londres" : "Ej: Cena de Empresa"}
                    className="bg-gray-50 p-4 rounded-2xl text-base"
                />
            </View>

            <View>
                <Text className="text-sm font-bold text-gray-700 mb-2">Ubicación</Text>
                <TextInput 
                    value={ubicacion}
                    onChangeText={setUbicacion}
                    placeholder="Ej: Madrid, ES"
                    className="bg-gray-50 p-4 rounded-2xl text-base"
                />
            </View>

            {/* FECHAS */}
            <View className="flex-row gap-4">
                <View className="flex-1">
                    <Text className="text-sm font-bold text-gray-700 mb-2">Desde</Text>
                    <TextInput 
                        value={fechaInicio}
                        onChangeText={setFechaInicio}
                        placeholder="YYYY-MM-DD"
                        className="bg-gray-50 p-4 rounded-2xl text-base text-center"
                    />
                </View>
                <View className="flex-1">
                    <Text className="text-sm font-bold text-gray-700 mb-2">Hasta</Text>
                    <TextInput 
                        value={fechaFin}
                        onChangeText={setFechaFin}
                        placeholder="YYYY-MM-DD"
                        className="bg-gray-50 p-4 rounded-2xl text-base text-center"
                    />
                </View>
            </View>
        </View>

        {/* INFO ADICIONAL */}
        {isViaje && (
            <View className="mt-6 bg-purple-50 p-4 rounded-2xl border border-purple-100">
                <Text className="text-purple-800 text-sm">
                    ✨ Al guardar un viaje, <Text className="font-bold">la IA generará automáticamente</Text> una maleta con outfits para cada día basándose en el clima.
                </Text>
            </View>
        )}

      </ScrollView>

      {/* BOTÓN GUARDAR */}
      <View className="px-5 mb-8">
        <Pressable
            onPress={handleGuardar}
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl items-center shadow-lg ${isViaje ? 'bg-purple-600 shadow-purple-200' : 'bg-blue-600 shadow-blue-200'}`}
        >
            {isLoading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text className="text-white font-bold text-lg">
                    {isViaje ? 'Crear Viaje y Generar Maleta' : 'Guardar Evento'}
                </Text>
            )}
        </Pressable>
      </View>

    </View>
  );
}