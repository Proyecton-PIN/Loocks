import { CloseIcon } from '@/constants/icons';
import { usePlanning } from '@/hooks/usePlanificacion'; 
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Alert,
  Modal 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

export default function CrearPlan() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { createNewPlan, isLoading } = usePlanning();

  const [titulo, setTitulo] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [isViaje, setIsViaje] = useState(true); 
  
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0]);

  const [modalVisible, setModalVisible] = useState(false);
  const [tipoFecha, setTipoFecha] = useState<'inicio' | 'fin'>('inicio');

  const handleDayPress = (day: any) => {
      if (tipoFecha === 'inicio') {
          setFechaInicio(day.dateString); 
      } else {
          setFechaFin(day.dateString);
      }
      setModalVisible(false);
  };

  const formatearFechaDisplay = (fechaISO: string) => {
      if (!fechaISO) return 'Seleccionar';
      const [year, month, day] = fechaISO.split('-');
      return `${day}-${month}-${year}`; 
  };

  const getMarkedDates = () => {
      const marks: any = {};
      if (fechaInicio) marks[fechaInicio] = { selected: true, color: '#5639F8', startingDay: true };
      if (fechaFin) marks[fechaFin] = { selected: true, color: '#5639F8', endingDay: true };
      return marks;
  };

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

      <View
        className="flex-row items-center justify-between px-5 pb-4 border-b border-gray-100"
        style={{ paddingTop: insets.top + 10 }}
      >
        <Text className="text-xl font-bold text-black">Nuevo Plan</Text>
        <Pressable onPress={() => router.back()} className="p-2">
           <CloseIcon color="black" /> 
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingVertical: 20 }}>

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

            <View className="flex-row gap-4">
                
                <View className="flex-1">
                    <Text className="text-sm font-bold text-gray-700 mb-2">Desde</Text>
                    <Pressable
                        onPress={() => {
                            setTipoFecha('inicio');
                            setModalVisible(true);
                        }}
                        className="bg-gray-50 p-4 rounded-2xl border border-gray-100 active:bg-gray-100"
                    >
                        <Text className="text-base text-center text-black font-medium">
                            {formatearFechaDisplay(fechaInicio)}
                        </Text>
                    </Pressable>
                </View>

                <View className="flex-1">
                    <Text className="text-sm font-bold text-gray-700 mb-2">Hasta</Text>
                    <Pressable
                        onPress={() => {
                            setTipoFecha('fin');
                            setModalVisible(true);
                        }}
                        className="bg-gray-50 p-4 rounded-2xl border border-gray-100 active:bg-gray-100"
                    >
                        <Text className="text-base text-center text-black font-medium">
                            {formatearFechaDisplay(fechaFin)}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>

        {isViaje && (
            <View className="mt-6 bg-purple-50 p-4 rounded-2xl border border-purple-100">
                <Text className="text-purple-800 text-sm">
                    ✨ Al guardar un viaje, <Text className="font-bold">la IA generará automáticamente</Text> una maleta con outfits para cada día basándose en el clima.
                </Text>
            </View>
        )}

      </ScrollView>

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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl p-5 pb-10 shadow-xl">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-bold text-gray-800">
                        Seleccionar fecha {tipoFecha === 'inicio' ? 'de inicio' : 'de fin'}
                    </Text>
                    <Pressable onPress={() => setModalVisible(false)} className="p-2">
                        <Text className="text-blue-600 font-bold">Cerrar</Text>
                    </Pressable>
                </View>

                <Calendar
                    current={fechaInicio || new Date().toISOString().split('T')[0]}
                    onDayPress={handleDayPress}
                    markedDates={getMarkedDates()}
                    theme={{
                        selectedDayBackgroundColor: '#5639F8',
                        todayTextColor: '#5639F8',
                        arrowColor: '#5639F8',
                        textDayFontWeight: '500',
                        textMonthFontWeight: 'bold',
                    }}
                />
            </View>
        </View>
      </Modal>

    </View>
  );
}