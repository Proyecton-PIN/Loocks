import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { useRef, useState } from 'react';
import { Alert, Modal, Pressable, Text, View } from 'react-native';
// After taking the photo we call onTakeImage(uri) immediately so the
// app can call the backend processPreview endpoint and show the
// processed image + editable details.

interface Props {
  onTakeImage(uri?: string): void;
}

export default function CustomCamera({ onTakeImage }: Props) {
  const [mostrarCamara, setMostrarCamara] = useState(false);
  const [foto, setFoto] = useState<string | undefined>(undefined);
  const camaraRef = useRef<CameraView | null>(null);

  const solicitarPermisos = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la cámara.');
      return;
    }
    setFoto(undefined);
    setMostrarCamara(true);
  };

  const tomarFoto = async () => {
    if (!camaraRef.current) return;

    const fotoTomada = await camaraRef.current.takePictureAsync();
    const uri = fotoTomada.uri ?? undefined;
    setFoto(uri);
    setMostrarCamara(false);

    // call the handler immediately so the app can process the image
    // (e.g. upload to processPreview and show editable results)
    try {
      onTakeImage(uri);
    } catch (e) {
      // swallow errors here; the caller (store/service) handles failures
      console.error('onTakeImage error', e);
    }
  };

  const guardarYCerrar = () => {
    if (!foto) return;
    setFoto(undefined);
    setMostrarCamara(false);
    onTakeImage(foto);
  };

  return (
    <View>
      <Pressable
        onPress={solicitarPermisos}
        className="border border-dashed border-neutral-600 rounded-xl py-4 mb-6 items-center"
      >
        <Text className="text-white">+ Añadir prenda</Text>
      </Pressable>

      {/* We no longer show a local accept modal; after taking the photo we
          call `onTakeImage` immediately which will open the edit modal
          (EditDetailsModal) once the backend returns data. */}

      <Modal visible={mostrarCamara} animationType="slide">
        <View className="flex-1">
          <CameraView ref={camaraRef} style={{ flex: 1 }} />

          <View className="absolute left-0 right-0 bottom-8 items-center">
            <Pressable
              onPress={tomarFoto}
              className="bg-white px-4 py-3 rounded-full"
            >
              <Text className="text-black font-bold">Tomar Foto</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => {
              setMostrarCamara(false);
              setFoto(undefined);
            }}
            className="absolute top-10 left-5 bg-red-500 p-2 rounded-md"
          >
            <Ionicons name="close" size={20} color={'white'} />
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
