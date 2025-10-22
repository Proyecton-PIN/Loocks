import { Camera, CameraView } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useRef, useState } from "react";
import { Alert, Image, Modal, Text, TouchableOpacity, View } from "react-native";

export default function BotonCamara() {
  const [mostrarCamara, setMostrarCamara] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);
  const camaraRef = useRef<CameraView | null>(null);

  const solicitarPermisos = async () => {
    const { status: camaraStatus } = await Camera.requestCameraPermissionsAsync();
    const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();

    if (camaraStatus !== "granted") {
      Alert.alert("Permiso denegado", "Se necesita acceso a la cámara.");
      return;
    }

    setMostrarCamara(true);
  };

  const tomarFoto = async () => {
    if (camaraRef.current) {
  // CameraView instance exposes takePictureAsync
  const fotoTomada = await camaraRef.current.takePictureAsync();
      // CameraView.takePictureAsync returns CameraCapturedPicture which has uri
  setFoto((fotoTomada as any).uri ?? null);
      setMostrarCamara(false);

      const { status: permisoMedia } = await MediaLibrary.requestPermissionsAsync();
      if (permisoMedia === "granted") {
          await MediaLibrary.saveToLibraryAsync((fotoTomada as any).uri);
        Alert.alert("Foto guardada", "La foto se ha guardado en la galería.");
      }
    }
  };

  return (
    <View className="items-center">
      <TouchableOpacity
        onPress={solicitarPermisos}
        className="bg-blue-500 px-5 py-3 rounded-lg"
      >
        <Text className="text-white font-bold">📷 Abrir Cámara</Text>
      </TouchableOpacity>

      {foto && (
        <Image source={{ uri: foto }} className="w-56 h-72 mt-4 rounded-lg" />
      )}

      <Modal visible={mostrarCamara} animationType="slide">
  <CameraView ref={camaraRef} className="flex-1">
          <TouchableOpacity
            onPress={tomarFoto}
            className="absolute bottom-10 self-center bg-white px-6 py-3 rounded-full"
          >
            <Text className="text-black font-bold">Tomar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMostrarCamara(false)}
            className="absolute top-10 left-5 bg-red-500 px-4 py-2 rounded"
          >
            <Text className="text-white">Cerrar</Text>
          </TouchableOpacity>
  </CameraView>
      </Modal>
    </View>
  );
}
