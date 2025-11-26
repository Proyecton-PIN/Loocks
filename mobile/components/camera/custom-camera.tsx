import { CameraFlashIcon, CloseIcon, LeftArrowIcon } from '@/constants/icons';
import { Camera, CameraView, FlashMode } from 'expo-camera';
import { ReactNode, useRef, useState } from 'react';
import { Alert, Modal, Pressable, View } from 'react-native';

interface Props {
  onTakeImage(uri?: string): void;
  trigger?(solicitarPermisos: () => Promise<void>): ReactNode;
}

export default function CustomCamera({
  onTakeImage,
  trigger,
}: Props) {
  const [mostrarCamara, setMostrarCamara] = useState(false);
  const camaraRef = useRef<CameraView | null>(null);
  const [flashNumber, setFlashNumber] = useState(0);

  const solicitarPermisos = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la cámara.');
      return;
    }
    setMostrarCamara(true);
  };

  const tomarFoto = async () => {
    if (!camaraRef.current) return;

    const fotoTomada = await camaraRef.current.takePictureAsync({
      quality: 0,
      skipProcessing: true,
    });
    const uri = fotoTomada.uri ?? undefined;
    setMostrarCamara(false);

    try {
      onTakeImage(uri);
    } catch (e) {
      console.error('onTakeImage error', e);
    }
  };

  const closeCamera = () => {
    setMostrarCamara(false);
  };

  const toggleFlash = async () => {
    setFlashNumber((s) => (s + 1) % 3);
  };

  let flash = 'auto' as FlashMode;
  switch (flashNumber) {
    case 0:
      flash = 'off';
      break;
    case 1:
      flash = 'on';
      break;
    case 2:
      flash = 'auto';
      break;
  }

  return (
    <View>
      {trigger?.(solicitarPermisos)}

      <Modal visible={mostrarCamara} animationType="slide">
        <View className="flex-1">
          <CameraView ref={camaraRef} style={{ flex: 1 }} flash={flash} />

          <View
            className="absolute top-0 inset-x-0 h-[80] 
          bg-black items-end justify-between flex-row"
          >
            <Pressable onPress={closeCamera} className="px-9 py-6">
              <LeftArrowIcon />
            </Pressable>
            <Pressable className="px-9 py-6" onPress={toggleFlash}>
              <CameraFlashIcon />
            </Pressable>
            <Pressable onPress={closeCamera} className="px-9 py-6">
              <CloseIcon />
            </Pressable>
          </View>

          <View className="absolute bottom-12 items-center inset-x-0">
            <Pressable
              onPress={tomarFoto}
              className="items-center justify-center
             aspect-square w-[76] border-2 border-white rounded-full"
            >
              <View className="bg-red aspect-square w-[66] bg-white rounded-full" />
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
