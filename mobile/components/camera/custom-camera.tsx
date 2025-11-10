import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { useRef, useState } from 'react';
import { Alert, Modal, Pressable, Text, View } from 'react-native';
import CustomCameraAcceptModal from './custom-camera-accept-modal';

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
    setFoto(fotoTomada.uri ?? undefined);
    setMostrarCamara(false);
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

      <CustomCameraAcceptModal
        visible={!!foto && !mostrarCamara}
        uri={foto ?? undefined}
        onClose={() => setFoto(undefined)}
        onSave={guardarYCerrar}
        onRepeat={() => {
          setFoto(undefined);
          setMostrarCamara(true);
        }}
      />

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
