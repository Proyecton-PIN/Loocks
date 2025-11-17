import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import LooksPage from './looks-page';
import PrendasPage from './prendas-page';

export default function Armario() {
  const [tab, setTab] = useState('prendas');
  return (
    <View className="flex-1 bg-[#F3F3F3]">
      {/* Tabs internos */}
      <View className="bg-[#FFFFFF] flex-row bg-violet-50 rounded-xl p-1 mx-4 mb-5 mt-7">
        <Pressable
          onPress={() => setTab('prendas')}
          className={`flex-1 items-center py-2 mx-1 rounded-lg transition-all ${tab === 'prendas' ? 'bg-[#5639F8]' : ''}`}
        >
          <Text className={`${tab === 'prendas' ? 'text-white ' : 'text-[#544497]'} text-lg tracking-wider`}>
            PRENDAS
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab('looks')}
          className={`flex-1 items-center py-2 mx-1 rounded-lg transition-all ${tab === 'looks' ? 'bg-[#5639F8]' : ''}`}
        >
          <Text className={`${tab === 'looks' ? 'text-white ' : 'text-[#544497]'} text-lg tracking-wider`}>
            LOOKS
          </Text>
        </Pressable>
      </View>

      <View className="flex-1">
        {tab === 'prendas' ? <PrendasPage /> : <LooksPage />}
      </View>
    </View>
  );
}
