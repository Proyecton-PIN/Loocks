import { Link } from 'expo-router';
import { View } from 'react-native';

export default function Calendario() {
  return (
    <View className="flex-1 items-center justify-center">
      <Link href="/login" style={{ padding: 10,marginBottom: 20, backgroundColor: 'blue' }}>Login</Link>
      <Link href="/armario">Armario</Link>
    </View>
  );
}
