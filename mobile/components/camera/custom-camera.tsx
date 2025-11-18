import { AddIcon } from '@/constants/icons';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import { Camera, CameraView } from 'expo-camera';
import { useRef, useState } from 'react';
import { Alert, Modal, Pressable, Text, View } from 'react-native';
// After taking the photo we call onTakeImage(uri) immediately so the
// app can call the backend processPreview endpoint and show the
// processed image + editable details.

interface Props {
  onTakeImage(uri?: string): void;
  className?: string;
}

export default function CustomCamera({ onTakeImage, className }: Props) {
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
        className={clsx(
          'aspect-square rounded-full w-[58] items-center justify-center',
          className,
        )}
        style={{ backgroundColor: Colors.primary }}
      >
        <AddIcon />
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
              <Text className="text-[#222222] font-bold">Tomar Foto</Text>
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
