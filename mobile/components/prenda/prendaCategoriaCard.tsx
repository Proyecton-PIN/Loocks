import clsx from 'clsx';
import { useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';

const ICONS = ['👕', '🧢', '👗', '👜', '⭐', '🧥'];

export default function PrendaCategoriaCard({ initialName, initialColor, initialIcon, cantidad }: { initialName: string; initialColor?: string; initialIcon: string; cantidad: number; }) {
  const [name, setName] = useState(initialName);
  const [icon, setIcon] = useState(initialIcon);
  const [showIcons, setShowIcons] = useState(false);

  return (
    <View className={clsx(
      "rounded-2xl px-6 py-5 mx-2 shadow-md bg-[#FFFFFF] border border-gray-200 flex-row items-center",
      "relative"
    )}>
      <Pressable onPress={() => setShowIcons(true)} className="w-11 h-11 rounded-full justify-center items-center bg-gray-100 mr-4">
        <Text className="text-2xl">{icon}</Text>
      </Pressable>
      <TextInput
        value={name}
        onChangeText={setName}
        className="flex-1 text-lg font-semibold text-gray-900"
        placeholder="Nombre"
      />
      <Text className="ml-4 text-gray-400 text-base">{cantidad} prendas</Text>
      {/* Modal de iconos */}
      <Modal visible={showIcons} transparent animationType="slide">
        <Pressable className="flex-1 justify-center items-center bg-[#222222]/20" onPress={() => setShowIcons(false)}>
          <View className="bg-[#FFFFFF] rounded-2xl p-5 flex-row flex-wrap w-64">
            {ICONS.map((ic) => (
              <Pressable key={ic} onPress={() => { setIcon(ic); setShowIcons(false); }}>
                <Text className="text-2xl m-3">{ic}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
