import { Camera, CameraView } from "expo-camera";
import { useRef, useState } from "react";
import { Alert, Image, Modal, Text, TouchableOpacity, View, } from "react-native";

export default function BotonCamara() {
  const [mostrarCamara, setMostrarCamara] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);
  const camaraRef = useRef<CameraView | null>(null);

  const solicitarPermisos = async () => {
    try {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      if (cameraStatus !== "granted") {
        Alert.alert("Permiso denegado", "Se necesita acceso a la cámara.");
        return;
      }

      const { status: microphoneStatus } = await Camera.requestMicrophonePermissionsAsync();
      if (microphoneStatus !== "granted") {
        Alert.alert("Permiso denegado", "Se necesita acceso al micrófono.");
        return;
      }
    } catch (err) {
      console.warn("Error solicitando permisos:", err);
      Alert.alert("Error", "No se pudieron solicitar permisos necesarios.");
      return;
    }

    setFoto(null);
    setMostrarCamara(true);
  };

  const tomarFoto = async () => {
    if (camaraRef.current) {
      const fotoTomada = await camaraRef.current.takePictureAsync();
      setFoto((fotoTomada as any).uri ?? null);
    }
  };

  const aceptarFoto = async () => {
    if (!foto) return;
    try {
      const response = await fetch(
      `https://ykyemrhayfttppxvmaqu.supabase.co/storage/v1/object/user-images/users/${1}/${Date.now()}.${'png'}`,
      {
        method: 'PUT',
        headers: {
          apikey: '<TU_ANON_KEY>',
          Authorization: `Bearer <TU_ANON_KEY>`,
          'Content-Type': `image/${'png'}`,
        },
        body: await fetch(foto).then(r => r.blob()),
      }
    );
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la foto.");
    }
  };

  const repetirFoto = () => {
    setFoto(null);
  };

  return (
    <View>
      {/* 🔘 Botón principal con diseño "Añadir prenda" */}
      <TouchableOpacity
        onPress={solicitarPermisos}
        className="border border-dashed border-neutral-600 rounded-xl py-4 mb-6 items-center">
        <Text className="text-white">+ Añadir prenda</Text>
      </TouchableOpacity>

      {/* Vista previa de la foto tomada */}
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
              onPress={repetirFoto}
              className="bg-gray-700 px-4 py-2 rounded"
            >
              <Text className="text-white">Repetir</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modal con la cámara */}
      <Modal visible={mostrarCamara} animationType="slide">
        {!foto ? (
          <View style={{ flex: 1 }}>
            <CameraView ref={camaraRef} style={{ flex: 1 }} />

            <View style={{ position: "absolute", bottom: 30, left: 0, right: 0, alignItems: "center" }}>
              <TouchableOpacity
                onPress={tomarFoto}
                style={{ backgroundColor: "white", padding: 14, borderRadius: 40 }}
              >
                <Text style={{ color: "black", fontWeight: "bold" }}>Tomar Foto</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                setMostrarCamara(false);
                setFoto(null);
              }}
              style={{ position: "absolute", top: 40, left: 20, backgroundColor: "red", padding: 8, borderRadius: 8 }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
            <Image source={{ uri: foto }} style={{ width: 300, height: 420, borderRadius: 12 }} />
            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <TouchableOpacity onPress={aceptarFoto} style={{ backgroundColor: "#0ea5e9", padding: 12, borderRadius: 8, marginRight: 10 }}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setFoto(null); }} style={{ backgroundColor: "#374151", padding: 12, borderRadius: 8 }}>
                <Text style={{ color: "white" }}>Repetir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>

    </View>

  );
}
