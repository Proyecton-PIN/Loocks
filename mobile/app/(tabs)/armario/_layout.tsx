import { useArticulos } from '@/hooks/useArticulos';
import { Prenda } from '@/lib/domain/models/prenda';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import clsx from 'clsx';
import { Stack, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function Armario() {
  const prendas = useArticulos((s) => s.prendas);
  const fetchPrendas = useArticulos((s) => s.fetchPrendas);

  useEffect(() => {
    fetchPrendas();
  }, []);

  return (
    <View className="flex-1 px-4">
      <Stack.Screen
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#000',
          },
        }}
      />
      <Estadisticas prendas={prendas} />

      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: {
            backgroundColor: '#000',
          },
          tabBarPosition: 'top',
        }}
      >
        <Tabs.Screen
          name="prendas-page"
          options={{
            title: 'prendas',
            tabBarIcon: () => <View />,
          }}
        />

        <Tabs.Screen
          name="outfit-page"
          options={{
            title: 'outfits',
            tabBarIcon: () => <View />,
          }}
        />

        <Tabs.Screen
          name="mood-page"
          options={{
            title: 'moods',
            tabBarIcon: () => <View />,
          }}
        />
      </Tabs>
    </View>
  );
}

function CustomTabBar({ state, navigation, descriptors }: BottomTabBarProps) {
  return (
    <View className="flex-row justify-around border-b border-neutral-700 mb-4">
      {state.routes.map((route, idx) => {
        const { options } = descriptors[route.key];
        const name = options?.title ?? route.name;
        const isFocused = idx === state.index;

        return (
          <Pressable
            key={idx}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            className={clsx('pb-2', isFocused && 'border-b-2 border-white')}
          >
            <Text
              // className={`${activeTab === tab ? 'text-white' : 'text-gray-400'} capitalize`}
              className={clsx(
                'capitalize',
                isFocused ? 'text-white' : 'text-gray-400',
              )}
            >
              {name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

interface EstadisticasProps {
  prendas: Prenda[];
}

function Estadisticas({ prendas }: EstadisticasProps) {
  return (
    <View className="flex-row justify-between mb-6">
      <View className="bg-neutral-900 justify-between p-3 rounded-xl w-[31%]">
        <Text className="text-gray-400 text-xm">Articulos</Text>
        <Text className="text-white my-4 text-4xl font-bold">
          {prendas.length}
        </Text>
        <Text className="text-gray-500 text-xm">+12 este mes</Text>
      </View>
      <View className="bg-neutral-900  justify-between p-3 rounded-xl w-[31%]">
        <Text className="text-gray-400 text-xm">Uso promedio</Text>
        <Text className="text-white my-4 text-4xl font-bold">68%</Text>
        <Text className="text-gray-500 text-xm">+5% este mes</Text>
      </View>
      <View className="bg-neutral-900  justify-between p-3 rounded-xl w-[31%]">
        <Text className="text-gray-400 text-xm">Outfits</Text>
        <Text className="text-white my-4 text-4xl font-bold">34</Text>
        <Text className="text-gray-500 text-xm">8 nuevos</Text>
      </View>
    </View>
  );
}
