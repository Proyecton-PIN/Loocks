import { router } from 'expo-router';
import React from 'react';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function Inicio() {

  return ( 
    <View className="flex-1 justify-center items-center bg-[#F3F3F3] px-4">
       <View className="w-300px y-300px mb-10">
        <TouchableOpacity
          onPress={() => {}}
          className=" items-center w-full 0 rounded-xl py-2 mb-4 bg-[#5639F8]"
        >
          <Text className="flex-1 text-center text-base font-semibold text-gray-800">
            Empezar...
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {router.replace('/login')}}
          className=" items-center w-full border border-gray-300 rounded-xl py-2 mb-6 bg-[#F3F3F3]"
        >
          <Text className="flex-1 text-center text-base font-semibold text-gray-800">
            Iniciar Sesión
          </Text>
        </TouchableOpacity>
        </View>
    </View>
  );
}
