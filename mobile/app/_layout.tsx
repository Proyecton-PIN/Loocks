import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Satoshi': require('../assets/fonts/satoshi/Satoshi-Regular.otf'),
    'Satoshi-Regular': require('../assets/fonts/satoshi/Satoshi-Regular.otf'),
  });

  // Apply global default font once loaded
  if (fontsLoaded) {
    // Preserve any existing default styles
    // and ensure Satoshi is the default across all Text components
    // Note: defaultProps is safe for RN built-in components
    // and helps avoid changing every Text usage individually.
    Text.defaultProps = Text.defaultProps || {};
    const existing = (Text.defaultProps.style || {}) as any;
    Text.defaultProps.style = Array.isArray(existing)
      ? [...existing, { fontFamily: 'Satoshi-Regular' }]
      : { ...existing, fontFamily: 'Satoshi-Regular' };
  }

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View className="flex-1 bg-[#F3F3F3]">
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
