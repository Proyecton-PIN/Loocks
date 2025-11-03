import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <View className="flex-1 bg-black ">
        <View className="flex-row justify-between bg-black px-6 items-center mt-10 mb-5">
          <Text className="text-white text-3xl font-semibold py-6">loocks</Text>
          <View className="flex-row items-center space-x-2">
            <Ionicons name="person-circle-outline" size={30} color="#00aaff" />
          </View>
        </View>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Register only the top-level routes that actually exist at this level.
              The `armario`, `calendario` and `principal` screens live inside the
              `(tabs)` group, so exposing them here causes "No route named" warnings.
              Declare the index/login routes and the `(tabs)` group instead. */}
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
    </>
  );
}
