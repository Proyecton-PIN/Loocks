import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

const tabConfig: { name: string; label: string; icon: IoniconsName }[] = [
  { name: "calendario", label: "Calendario", icon: "calendar-outline" },
  { name: "principal", label: "Principal", icon: "home-outline" },
  { name: "armario", label: "Armario", icon: "cube-outline" },
  { name: "perfil", label: "Perfil", icon: "person-outline" },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        header: ({ route }) => (
          <View className="bg-[#F3F3F3] mx-4 pt-12 pb-5 px-5">
            <Text className="text-[26px] font-bold text-[#2A2343]">
              {route.name === "armario" ? "Armario" : route.name.charAt(0).toUpperCase() + route.name.slice(1)}
            </Text>
          </View>
        ),
      }}
      tabBar={({ state, navigation }) => (
        <View className="flex-row bg-[#DFDFDF] rounded-full px-3 pb-2 pt-3 mx-7 mb-5">
          {tabConfig.map((tab, idx) => {
            const isFocused = state.index === idx;
            return (
              <Pressable
                key={tab.name}
                onPress={() => navigation.navigate(tab.name)}
                className={`flex-1 items-center py-1 rounded-full ${isFocused ? 'bg-[#E0DBFF]' : ''}`}
              >
                <Ionicons
                  name={tab.icon}
                  size={26}
                  color={isFocused ? "#5639F8" : "#686868"}


                  style={{ marginBottom: 3 }}
                />
                <Text className={`text-xs ${isFocused ? "text-[#5639F8] font-bold" : "text-[#91919F]"}`}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    >
      <Tabs.Screen name="calendario" />
      <Tabs.Screen name="principal" />
      <Tabs.Screen name="armario" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  );
}
