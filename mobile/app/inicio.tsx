import { router } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function Inicio() {
  return (
    <View className="flex-1 bg-[#F3F3F3]">
      <View className="absolute top-0 left-0 w-full h-[60%] ">
        <Image
          source={require('../assets/imagenes-login/camiseta.png')}
          className="absolute opacity-100"
          style={{
            width: 232,
            height: 234,
            top: 128.25,
            left: 168.02,
            transform: [{ rotate: '-12.12deg' }],
          }}
        />

        <Image
          source={require('../assets/imagenes-login/chaqueta.png')}
          className="absolute opacity-100"
          style={{
            width: 249,
            height: 311,
            top: -59,
            left: -122,
            transform: [{ rotate: '-12.93deg' }],
          }}
        />
        <Image
          source={require('../assets/imagenes-login/zapatillas.png')}
          className="absolute opacity-100"
          style={{
            width: 300,
            height: 110,
            top: 290,
            left: -113,
            transform: [{ rotate: '148.67deg' }],
          }}
        />
        <Image
          source={require('../assets/imagenes-login/bolso.png')}
          className="absolute opacity-100"
          style={{
            width: 145.56,
            height: 169.85,
            top: -87,
            left: 197,
            transform: [{ rotate: '18.05deg' }],
          }}
        />
        <Image
          source={require('../assets/imagenes-login/pantalon.png')}
          className="absolute opacity-100"
          style={{
            width: 177,
            height: 358,
            top: 361,
            left: 250,
            transform: [{ rotate: '-13.51deg' }],
          }}
        />
      </View>

      <View className="flex-1 justify-end items-center px-4 pb-12">
        <View className="w-full max-w-[350px] bg-white rounded-3xl shadow-xl p-6">
          <Text className="text-center text-4xl font-bold text-gray-900 mb-1">
            Loocks
          </Text>
          <Text className="text-center font-semibold text-base text-gray-700 mb-[100px]">
            Vestir bien, sin esfuerzo
          </Text>

          <TouchableOpacity
            onPress={() => {
              /* Registro*/
            }}
            className="w-full rounded-xl py-[10px] mb-3 bg-[#5639F8]"
          >
            <Text className="text-center text-base font-semibold text-white">
              Empezar...
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.replace('/login');
            }}
            className="w-full border border-gray-300 rounded-xl py-[8px] bg-[#F3F3F3]"
          >
            <Text className="text-center text-base font-semibold text-gray-400">
              Iniciar sesión...
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
