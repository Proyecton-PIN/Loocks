import { Colors } from '@/constants/theme';
import { usePlanning } from '@/hooks/usePlanificacion'; 
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, Pressable } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PlansList from '@/components/planificacion/lista-planes';
import { router } from 'expo-router';

LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

export default function CalendarioPage() {
  const insets = useSafeAreaInsets();
  const { plans, fetchMonthPlans, isLoading } = usePlanning();

  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString());

  useEffect(() => {
    const now = new Date();
    fetchMonthPlans(now.getFullYear(), now.getMonth() + 1);
  }, []);

  const markedDates = plans.reduce((acc: any, plan) => {
    const dateStr = plan.fechaInicio.toString().split('T')[0];
    acc[dateStr] = {
      marked: true,
      dotColor: plan.isMaleta ? '#9333EA' : '#5639F8',
      selected: dateStr === selectedDate,
      selectedColor: '#000'
    };
    return acc;
  }, {});

  if (selectedDate) {
    markedDates[selectedDate] = { 
        ...markedDates[selectedDate], 
        selected: true, 
        selectedColor: 'black', 
        selectedTextColor: 'white' 
    };
  }

  const renderContent = () => {
    if (activeTab === 'calendar') {
      return (
        <View className="flex-1">
          {isLoading && <ActivityIndicator color={Colors.primary} className="mb-2" />}
          <Calendar
            key={currentMonth} 
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#5639F8',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#00adf5',
              selectedDotColor: '#ffffff',
              arrowColor: 'black',
              monthTextColor: 'black',
              indicatorColor: 'blue',
              textDayFontFamily: 'System',
              textMonthFontFamily: 'System',
              textDayHeaderFontFamily: 'System',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14
            }}
            markedDates={markedDates}
            onDayPress={(day: any) => setSelectedDate(day.dateString)}
            onMonthChange={(month: any) => {
                fetchMonthPlans(month.year, month.month);
                setCurrentMonth(month.dateString);
            }}
            enableSwipeMonths={true}
          />
          <View className="flex-row justify-center gap-4 mt-6">
              <View className="flex-row items-center gap-2"><View className="w-3 h-3 rounded-full bg-[#5639F8]"/><Text className="text-gray-500 text-xs">Eventos</Text></View>
              <View className="flex-row items-center gap-2"><View className="w-3 h-3 rounded-full bg-purple-600"/><Text className="text-gray-500 text-xs">Viajes</Text></View>
          </View>
        </View>
      );
    } else {
      return <PlansList />;
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View style={{ paddingTop: insets.top + 10 }} className="px-5 mb-2 bg-white z-10">
         <Text className="text-3xl font-bold text-black mb-4">Agenda</Text>
         
         <View
            className="flex-row h-[42px] rounded-xl p-[3px] gap-[1px]"
            style={{
              backgroundColor: Colors.white,
              shadowColor: Colors.black,
              shadowOffset: { height: 2, width: 0 }, 
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 3,
              marginBottom: 10
            }}
          >
            <Pressable
              onPress={() => setActiveTab('calendar')}
              className={`flex-1 items-center justify-center rounded-[9px]`}
              style={{
                backgroundColor: activeTab === 'calendar' ? Colors.black : Colors.white,
              }}
            >
              <Text
                className="text-md font-normal"
                style={{
                  color: activeTab === 'calendar' ? Colors.white : Colors.black,
                  fontSize: 13,
                  fontWeight: '500',
                  fontFamily: 'System', 
                }}
              >
                CALENDARIO
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('list')}
              className={`flex-1 items-center justify-center rounded-[9px]`}
              style={{
                backgroundColor: activeTab === 'list' ? Colors.black : Colors.white,
              }}
            >
              <Text
                className="text-md font-normal"
                style={{
                  color: activeTab === 'list' ? Colors.white : Colors.black,
                  fontSize: 13,
                  fontWeight: '500',
                  fontFamily: 'System',
                }}
              >
                MIS PLANES
              </Text>
            </Pressable>
         </View>
      </View>

      <View className="flex-1">
          {renderContent()}
      </View>

      <Pressable 
        className="absolute bottom-5 right-5 bg-black w-14 h-14 rounded-full justify-center items-center shadow-lg"
        onPress={() => {
            router.push('/nuevo-plan'); 
        }}
      >
          <Text className="text-white font-bold text-2xl">+</Text>
      </Pressable>
    </View>
  );
}