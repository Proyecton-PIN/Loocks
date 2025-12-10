import CustomCamera from '@/components/camera/custom-camera';
import ImageAnalyzingModal from '@/components/camera/image-analyzing-modal';
import { AddIcon, IconProps } from '@/constants/icons';
import { Colors } from '@/constants/theme';
import { useArticulos } from '@/hooks/useArticulos';
import { Tabs } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type NavBarIcon = (props: IconProps) => React.JSX.Element;
type NavBarItem = {
  name: string;
  label: string;
};

const tabConfig: NavBarItem[] = [
  { name: 'prendas-page', label: 'ARTICULO' },
  { name: 'outfits-page', label: 'OUTFITS' },
  { name: 'looks-page', label: 'LOOCKBOOK' },
];

export default function ArmarioLayout() {
  const generateDetails = useArticulos((s) => s.generateDetails);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View className="flex-1">

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarPosition: 'top',
        }}
        tabBar={({ state, navigation }) => (
          <View
            className="flex-row h-[42px] mx-5 rounded-xl p-[3px] 
              gap-[1px] mb-[37px] mt-7"
            style={{
              backgroundColor: Colors.white,
              shadowColor: Colors.black,
              shadowOffset: { height: 10, width: 0 },
              shadowOpacity: 1,
              shadowRadius: 5,
            }}
          >
            {tabConfig.map((tab, idx) => {
              const isFocused = state.index === idx;
              return (
                <Pressable
                  key={tab.name}
                  onPress={() => navigation.navigate(tab.name)}
                  className={`flex-1 items-center justify-center bg-red-500 rounded-[9px]`}
                  style={{
                    backgroundColor: isFocused ? Colors.black : Colors.white,
                  }}
                >
                  <Text
                    className="text-md font-normal"
                    style={{
                      color: isFocused ? Colors.white : Colors.black,
                      fontSize: 13,
                      fontWeight: 500,
                      fontFamily: 'Shatoshi',
                    }}
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

      <CustomCamera
        onTakeImage={(uri) => {
          setIsLoading(true);
          generateDetails(uri).then(() => {
            setIsLoading(false);
          });
        }}
        trigger={(solicitarPermisos) => (
          <Pressable
            onPress={solicitarPermisos}
            className="aspect-square rounded-full w-[58] items-center justify-center absolute bottom-5 right-5"
            style={{ backgroundColor: Colors.primary }}
          >
            <AddIcon />
          </Pressable>
        )}
      />
      <ImageAnalyzingModal show={isLoading} />
    </View>
  );
}
