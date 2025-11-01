import { API_URL } from '@env';
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

  // --- Configuración Supabase ---
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

    try {
      const blob = await fetch(foto).then((r) => r.blob());

      const userId = '1';
      const fileName = `${Date.now()}.png`;
      const filePath = `users/${userId}/${fileName}`;
      const SUPABASE_KEY =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlreWVtcmhheWZ0dHBweHZtYXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTY1NzAsImV4cCI6MjA3NjAzMjU3MH0.p4rJlMg8bH4jGyXwFLcIfn8i8got7U5e8-EqPewZk1U';

      const uploadUrl = `https://ykyemrhayfttppxvmaqu.supabase.co/storage/v1/object/user-images/users/${userId}/${fileName};
`;

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
        await fetch(`${API_URL}/api/articulos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: '1',
            nombre: 'Prueba',
            tipo: 'CAMISETA',
            colorPrimario: 'RRGGBBAA',
            fechaCompra: new Date().toISOString(),
            imagenUrl: uploadUrl,
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

  return (
    <View>
      <TouchableOpacity
        onPress={solicitarPermisos}
        className="border border-dashed border-neutral-600 rounded-xl py-4 mb-6 items-center"
      >
        <Text className="text-white">+ Añadir prenda</Text>
      </TouchableOpacity>

      {foto && !mostrarCamara && (
        <View className="w-full items-center mt-2">
          <Image source={{ uri: foto }} className="w-56 h-72 rounded-lg mb-3" />
          <View className="flex-row space-x-4">
            <TouchableOpacity
              onPress={aceptarFoto}
              className="bg-blue-500 px-4 py-2 rounded"
            >
              <Text className="text-white font-bold">Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFoto(null)}
              className="bg-gray-700 px-4 py-2 rounded"
            >
              <Text className="text-white">Repetir</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal visible={mostrarCamara} animationType="slide">
        <View style={{ flex: 1 }}>
          <CameraView ref={camaraRef} style={{ flex: 1 }} />
          <View
            style={{
              position: 'absolute',
              bottom: 30,
              left: 0,
              right: 0,
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={tomarFoto}
              style={{
                backgroundColor: 'white',
                padding: 14,
                borderRadius: 40,
              }}
            >
              <Text style={{ color: 'black', fontWeight: 'bold' }}>
                Tomar Foto
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              setMostrarCamara(false);
              setFoto(null);
            }}
            style={{
              position: 'absolute',
              top: 40,
              left: 20,
              backgroundColor: 'red',
              padding: 8,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
