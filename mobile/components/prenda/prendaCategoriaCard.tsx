// PrendaCategoriaCard.tsx
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, TextInput, View } from 'react-native';

export default function PrendaCategoriaCard({
  initialName,
  initialColor,
  initialIcon,
  cantidad,
  expanded,
  onPress,
  children
}: {
  initialName: string;
  initialColor?: string;
  initialIcon: string;
  cantidad: number;
  expanded: boolean;
  onPress: () => void;
  children?: React.ReactNode;
}) {
  const animation = useRef(new Animated.Value(expanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: expanded ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  const panelHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120], // Ajusta la altura del panel según lo que necesites
  });

  return (
    <View>
      <Pressable
        onPress={onPress}
        className={clsx(
          "rounded-2xl px-6 pt-5 pb-[20px] mb-[-30px] shadow-[0_-10px_20px_rgba(0,0,0,1.7)] bg-[#FFFFFF]  flex-row items-center",
          expanded && "border-blue-400"
        )}
        style={{ backgroundColor: initialColor || '#FFF' }}
      >
        <Text className="text-4xl mr-4">{initialIcon}</Text>
        <TextInput
          value={initialName}
          editable={false}
          className="flex-1 text-lg text-[26px] text-gray-900"
        />
        <Text className="ml-4 text-gray-400 text-base">{cantidad} prendas</Text>
      </Pressable>
      {/* Panel desplegable */}
      <Animated.View style={{ height: panelHeight, overflow: 'hidden' }}>
        {expanded && (
          <View className="px-6 py-4 mt-4" style={{ backgroundColor: initialColor || '#FFF' }}>
            {children}
          </View>
        )}
      </Animated.View>
    </View>
  );
}
