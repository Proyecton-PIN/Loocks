import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const error = useAuth((s) => s.error);
  const login = useAuth((s) => s.login);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    login(email, password).finally(() => setIsLoading(false));
  };

  return (
    <View className="flex-1 justify-center items-center bg-[#F3F3F3] px-4">
      <View className="w-full max-w-[340px]">
        {/* Header */}
        <View className="mt-3 mb-[60px] items-center">
          <Text className="text-black text-[25px] font-bold tracking-wide">LOOCKS</Text>
          <Text className="text-black text-[12px] font-semibold tracking-wide">Vestir bien, sin esfuerzo</Text>
        </View>
        {/* Email */}
        <View className="mb-3">
          <Text className="mb-1 text-black text-[12px] font-bold tracking-wide">Inicio de Sesión</Text>
          <TextInput
            className="bg-white rounded-lg px-4 py-3 text-base text-black"
            placeholder="Email"
            placeholderTextColor="#ffff"
            value={email}
            autoCapitalize="none"
            onChangeText={setEmail}
            keyboardType="email-address"
            returnKeyType="next"
          />
        </View>
        {/* Password */}
        <View className="mb-2">
          <TextInput
            className="bg-white rounded-lg px-4 py-3 text-base text-black"
            placeholder="Password"
            placeholderTextColor="#ffff"
            secureTextEntry
            value={password}
            autoCapitalize="none"
            onChangeText={setPassword}
            returnKeyType="go"
          />
        </View>
        <View className="flex-row justify-end">
          <Pressable onPress={() => {}}>
            <Text className="text-xs text-[#6A5DF8] underline mr-1">Forgot Password?</Text>
          </Pressable>
        </View>
        {/* Error */}
        {error && (
          <View className="bg-red-100 border border-red-200 rounded-xl px-4 py-2 mt-2 mb-2">
            <Text className="text-red-700 text-center text-sm">{error}</Text>
          </View>
        )}
        {/* Botón principal */}
        <TouchableOpacity
          disabled={isLoading}
          onPress={handleSubmit}
          className="w-full py-3 rounded-xl my-6 bg-[#5639F8]"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-semibold text-base">
              Aceptar
            </Text>
          )}
        </TouchableOpacity>
        {/* Separador */}
        <View className="flex-row items-center my-3">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="px-2 text-sm text-gray-400">or</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>
        {/* Botón Google */}
        <TouchableOpacity
          onPress={() => {}}
          className="flex-row items-center w-full border border-gray-300 rounded-xl py-2 mb-4 bg-[#F3F3F3]"
        >
          <Ionicons name="logo-google" size={20} color="#111" className="ml-2" />
          <Text className="flex-1 text-center text-base font-semibold text-gray-800">
            Continue with Google
          </Text>
        </TouchableOpacity>
        {/* Botón Apple */}
        <TouchableOpacity
          onPress={() => {}}
          className="flex-row items-center w-full border border-gray-300 rounded-xl py-2 mb-6 bg-[#F3F3F3]"
        >
          <Ionicons name="logo-apple" size={20} color="#111" className="ml-2" />
          <Text className="flex-1 text-center text-base font-semibold text-gray-800">
            Continue with Apple
          </Text>
        </TouchableOpacity>
        {/* Footer */}
        <View className="mt-2 mb-1 flex-row justify-center">
          <Text className="text-sm text-gray-800">Don’t have an account?</Text>
          <Pressable onPress={() => {}}>
            <Text className="text-[#6A5DF8] text-sm font-semibold ml-1 underline">
              Sing Up
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
