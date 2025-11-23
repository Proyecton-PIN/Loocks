import {
  ArmarioIcon,
  CalendarioIcon,
  HomeIcon,
  IconProps,
  PersonaIcon,
} from '@/constants/icons';
import { Colors } from '@/constants/theme';
import { Tabs } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

type NavBarIcon = (props: IconProps) => React.JSX.Element;
type NavBarItem = {
  name: string;
  label: string;
  icon: NavBarIcon;
};

const tabConfig: NavBarItem[] = [
  { name: 'principal', label: 'Home', icon: HomeIcon },
  { name: 'calendario', label: 'Calendario', icon: CalendarioIcon },
  { name: 'armario', label: 'Armario', icon: ArmarioIcon },
  { name: 'perfil', label: 'Perfil', icon: PersonaIcon },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => (
        <View
          className="flex-row pb-5 pt-4 px-5"
          style={{
            backgroundColor: Colors.background,
            borderTopColor: Colors.muted,
            borderTopWidth: 0.5,
          }}
        >
          {tabConfig.map((tab, idx) => {
            const isFocused = state.index === idx;
            return (
              <Pressable
                key={tab.name}
                onPress={() => navigation.navigate(tab.name)}
                className={`flex-1 items-center py-1 rounded-full`}
              >
                <tab.icon bold={isFocused} />
                <Text
                  // className={`text-md ${isFocused ? 'text-[#5639F8] font-bold' : 'text-[#91919F]'}`}
                  className="text-md font-normal"
                  style={{ color: isFocused ? Colors.black : Colors.muted }}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    >
      {tabConfig.map((e) => (
        <Tabs.Screen name={e.name} />
      ))}
    </Tabs>
  );
}
