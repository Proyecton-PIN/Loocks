import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

// Evita que la pantalla de carga se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Satoshi-Regular': require('../assets/fonts/satoshi/Satoshi-Regular.otf'),
  });

  useEffect(() => {
    if (loaded || error) {
      // Oculta la pantalla de carga una vez las fuentes están listas
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <Stack screenOptions={{ 
          headerShown: false,
          // Puedes pasar la fuente aquí para que afecte a los títulos de los headers
          headerTitleStyle: { fontFamily: 'Satoshi-Regular' } 
        }} 
      />
    </View>
  );
}