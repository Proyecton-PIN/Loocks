import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const error = useAuth((s) => s.error);
  const login = useAuth((s) => s.login);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);

    login(email, password).then(() => {
      setIsLoading(false);
      // setPassword('');
    });
  };

  return (
    <View className="flex-1 justify-center px-6">
      <View className="flex-1 justify-center">
        {/* Header */}
        <View className="mb-12 items-center">
          <Text className="text-gray-400">Ingresa tus credenciales</Text>
        </View>

        {/* Email */}
        <View className="mb-5">
          <Text className="text-sm font-medium text-gray-400 mb-2">
            Correo Electrónico
          </Text>
          <View className="flex-row items-center border border-gray-700 rounded-xl px-3 bg-gray-900">
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 text-white py-3 px-2 text-base"
              placeholder="tu@email.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
              onSubmitEditing={handleSubmit}
            />
          </View>
        </View>

        {/* Password */}
        <View className="mb-5">
          <Text className="text-sm font-medium text-gray-400 mb-2">
            Contraseña
          </Text>
          <View className="flex-row items-center border border-gray-700 rounded-xl px-3 bg-gray-900">
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 text-white py-3 px-2 text-base"
              placeholder="Tu contraseña"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              value={password}
              autoCapitalize="none"
              onChangeText={setPassword}
              onSubmitEditing={handleSubmit}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="p-2"
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Error */}
        {error && (
          <View className="bg-red-100 border border-red-300 rounded-xl p-3 mb-4">
            <Text className="text-red-700 text-center text-sm">{error}</Text>
          </View>
        )}

        {/* Botón */}
        <TouchableOpacity
          disabled={isLoading}
          onPress={handleSubmit}
          className={`w-full py-4 rounded-xl mt-6 ${
            isLoading
              ? 'bg-blue-600 opacity-50'
              : 'bg-blue-600 active:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-semibold text-base">
              Iniciar Sesión
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
