import { Link } from 'expo-router';
import { View } from 'react-native';

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Link href="/login" style={{ padding: 10,marginBottom: 20, backgroundColor: 'white' }}>Login</Link>
      <Link href="/armario" style={{ padding: 10,marginBottom: 20, backgroundColor: 'white' }}>Armario</Link>
    </View>
  );
}
