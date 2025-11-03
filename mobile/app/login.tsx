import { ApiUrl } from '@/constants/api-constants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // bandera de montaje
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, ingresa un correo electrónico válido');
      return;
    }

    if (password.length < 5) {
      setError('La contraseña debe tener al menos 5 caracteres');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      fetch(`${ApiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
        .then(() => {
          if (!isMounted.current) return;
          router.replace('/armario');
          setIsLoading(false);
          setEmail('');
          setPassword('');
        })
        .catch(() => {
          if (!isMounted.current) return;
          setIsLoading(false);
          setError('Error al iniciar sesión');
        });
    }, 1000);
  };

  return (
    <View className="flex-1 bg-black justify-center px-6">
      <View className="flex-1 justify-center">
        {/* Header */}
        <View className="mb-12 items-center">
          <Text className="text-3xl font-bold text-white mb-2">
            Iniciar Sesión
          </Text>
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
        {error ? (
          <View className="bg-red-100 border border-red-300 rounded-xl p-3 mb-4">
            <Text className="text-red-700 text-center text-sm">{error}</Text>
          </View>
        ) : null}

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
