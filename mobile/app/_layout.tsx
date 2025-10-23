import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Text, View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

const pages = ['armario', 'calendario', 'principal'];
const settings = ['perfil']

export default function RootLayout() {
  return (
    
    <View className="flex-1 bg-black ">
      <View className="flex-row justify-between bg-black px-6 items-center mt-10 mb-5">
              <Text className="text-white text-3xl font-semibold py-6">loocks</Text>
              <View className="flex-row items-center space-x-2">
                <Ionicons name="person-circle-outline" size={30} color="#00aaff" />
              </View>
            </View>
      <Stack>
        {pages.map((page) => (
          <Stack.Screen key={page} name={page} />
        ))}
      </Stack>
    </View>
  );
}
