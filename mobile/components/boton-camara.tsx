import { ApiUrl } from '@/constants/api-constants';
import { SecureStore } from '@/lib/logic/services/secure-store-service';
import { Camera, CameraView } from 'expo-camera';
import { useRef, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function BotonCamara() {
  const [mostrarCamara, setMostrarCamara] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);
  const camaraRef = useRef<CameraView | null>(null);

  const SUPABASE_URL = 'https://ykyemrhayfttppxvmaqu.supabase.co';
  const SUPABASE_KEY = 'deda03150bbb7bbf3d0d2b2532250f3b';
  const BUCKET = 'user-images';

  const solicitarPermisos = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la cámara.');
      return;
    }
    setFoto(null);
    setMostrarCamara(true);
  };

  const tomarFoto = async () => {
    if (camaraRef.current) {
      const fotoTomada = await camaraRef.current.takePictureAsync();
      setFoto(fotoTomada.uri ?? null);
      setMostrarCamara(false);
    }
  };

  const aceptarFoto = async () => {
    if (!foto) return;
    await subirFoto(foto);
  };
  const subirFoto = async (fotoUri: string) => {
    try {
      const blob = await fetch(fotoUri).then((r) => r.blob());

  const userId = await SecureStore.get('userId');
      const fileName = `${Date.now()}.png`;
      const filePath = `users/${userId}/${fileName}`;
      const SUPABASE_KEY =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlreWVtcmhheWZ0dHBweHZtYXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTY1NzAsImV4cCI6MjA3NjAzMjU3MH0.p4rJlMg8bH4jGyXwFLcIfn8i8got7U5e8-EqPewZk1U';

      const uploadUrl = `https://ykyemrhayfttppxvmaqu.supabase.co/storage/v1/object/user-images/users/${userId}/${fileName};`;

      console.log('📤 Subiendo a:', uploadUrl);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'image/png',
        },
        body: blob,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error:', response.status, errorText);
        throw new Error('Error al subir a Supabase');
      }

      try {
        await fetch(`${ApiUrl}/api/articulos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            nombre: 'Prueba',
            tipo: 'CAMISETA',
            colorPrimario: 'RRGGBBAA',
            fechaCompra: new Date().toISOString(),
            imageUrl: uploadUrl,
          }),
        });
      } catch (dbErr) {
        console.error('DB insert error:', dbErr);
        Alert.alert('Error', 'Imagen subida pero fallo al crear el artículo.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo subir la imagen.');
    }
  };

  const guardarYCerrar = () => {
    const current = foto;
    if (!current) return;
    // close preview
    setFoto(null);
    setMostrarCamara(false);
    // upload in background
    void subirFoto(current);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={solicitarPermisos}
        className="border border-dashed border-neutral-600 rounded-xl py-4 mb-6 items-center"
      >
        <Text className="text-white">+ Añadir prenda</Text>
      </TouchableOpacity>

      <Modal visible={!!foto && !mostrarCamara} animationType="slide">
        <View className="flex-1 bg-black">
          <Image
            source={{ uri: foto ?? undefined }}
            className="flex-1 w-full h-full"
            resizeMode="contain"
          />

          <View className="absolute left-0 right-0 bottom-10 flex-row justify-around px-5">
            <TouchableOpacity
              onPress={guardarYCerrar}
              className="bg-blue-600 px-4 py-3 rounded-md"
            >
              <Text className="text-white font-bold">Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setFoto(null);
                setMostrarCamara(true);
              }}
              className="bg-gray-700 px-4 py-3 rounded-md"
            >
              <Text className="text-white">Repetir</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setFoto(null)}
            className="absolute top-10 left-5 bg-black/60 p-2 rounded-md"
          >
            <Text className="text-white font-bold">Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={mostrarCamara} animationType="slide">
        <View className="flex-1">
          <CameraView ref={camaraRef} style={{ flex: 1 }} />
          <View className="absolute left-0 right-0 bottom-8 items-center">
            <TouchableOpacity
              onPress={tomarFoto}
              className="bg-white px-4 py-3 rounded-full"
            >
              <Text className="text-black font-bold">Tomar Foto</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              setMostrarCamara(false);
              setFoto(null);
            }}
            className="absolute top-10 left-5 bg-red-500 p-2 rounded-md"
          >
            <Text className="text-white font-bold">Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
