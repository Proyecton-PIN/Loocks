import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';


export default function RootLayout() {

  return (
    <View style={{flex: 1}}>
      <Stack/>
      <StatusBar style="auto" />
    </View>
  );
}
