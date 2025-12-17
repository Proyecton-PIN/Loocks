import { useArticulos } from '@/hooks/useArticulos';
import clsx from 'clsx';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const defaultColors = [
  '#F6B9F8', '#E272AF', '#FF7E8D', '#FFA90B', '#FFDEB3', '#A0E4E7',
  '#9BCCFF', '#B3B9FF', '#CFEB9D', '#F7F7F7', '#CFCFCF', '#D8D2AD',
];

export default function PrendaCategoriaCard({
  initialName,
  initialColor,
  initialIcon: IconComponent,
  tipo,
  onClose,
}: {
  initialName: string;
  initialColor?: string;
  initialIcon: React.ElementType;
  tipo: string;
  onClose(name: string, color?: string): void;
}) {
  const articulos = useArticulos((s) => s.armarioArticulos)[tipo];
  const [color, setColor] = useState(initialColor);
  const [name, setName] = useState(initialName);
  
  const [colorSelector, setColorSelector] = useState(false);
  const sheetRef = useRef<any>(null);
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // --- LÓGICA DEL GESTO PARA CERRAR ---
  const panResponder = useRef(
    PanResponder.create({
      // Preguntar: ¿Quiere este componente ser el que responda al toque?
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Solo robamos el foco si se mueve verticalmente hacia abajo
        // y el movimiento vertical es mayor que el horizontal
        return gestureState.dy > 5 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        // Si deslizó hacia abajo más de 30px (más sensible), cerramos
        if (gestureState.dy > 30) {
          sheetRef.current?.close();
        }
      },
    })
  ).current;

  return (
    <View>
      <Pressable
        onPress={() => sheetRef.current?.open()}
        className={clsx('px-[9px] pt-[10px] flex-row rounded-t-3xl pb-[30px] mb-[-18px]')}
        style={{ backgroundColor: color }}
      >
        <View className="flex-1 gap-[10px] px-[9px]">
          <Text className="flex-1 text-[32px] font-medium text-[#222222]">{name}</Text>
          <Text className={clsx(!articulos && 'opacity-0')}>{articulos?.length} prendas</Text>
        </View>
        <View className="rounded-full w-[44px] h-[44px] bg-black/10 items-center justify-center">
          <IconComponent />
        </View>
      </Pressable>

      <RBSheet
        height={dimensions.height - insets.top}
        // IMPORTANTE: dragOnContent={false} evita que la librería pelee con tu FlatList
        dragOnContent={false} 
        ref={sheetRef}
        openDuration={300}
        customModalProps={{ animationType: 'fade', statusBarTranslucent: true }}
        customStyles={{
          draggableIcon: { backgroundColor: '#DFDFDF' },
          wrapper: { backgroundColor: color },
          container: { backgroundColor: 'transparent' },
        }}
        customAvoidingViewProps={{ enabled: false }}
        // Al cerrar, guardamos los cambios
        onClose={() => onClose(name, color)}
      >
        <View className="flex-1 rounded-t-3xl">
          <View className="bg-white flex-1 rounded-t-3xl px-[19px] pt-[10px]">
            
            {/* --- ZONA DE AGARRE (HANDLE) --- */}
            {/* Solo esta View recibe el gesto de deslizar para cerrar */}
            <View 
                {...panResponder.panHandlers} 
                style={{ 
                    alignItems: 'center', 
                    width: '100%', 
                    paddingVertical: 10, // Aumentamos el área táctil vertical
                    backgroundColor: 'transparent' // Transparente pero detectable
                }}
            >
                <View style={{ backgroundColor: '#F3F3F3', width: 50, height: 4, borderRadius: 999 }} />
            </View>

            {/* --- RESTO DEL HEADER (INPUTS) --- */}
            {/* Esto está FUERA del panResponder para que puedas escribir sin problemas */}
            <View className="flex-row gap-[11px] mb-2 mt-2">
                <TextInput
                  value={name}
                  onChangeText={(v) => setName(v)}
                  style={{ borderColor: '#686868', borderWidth: 1, borderStyle: 'dashed', borderRadius: 12, paddingHorizontal: 12, flex: 1, height: 44 }}
                />
                <Pressable
                  onPress={() => setColorSelector(true)}
                  style={{ backgroundColor: color, borderWidth: 1, borderColor: '#686868', borderStyle: 'dashed', borderRadius: 999, width: 44, height: 44 }}
                />
                <View style={{ backgroundColor: color, borderRadius: 1000 }}>
                  <View className="rounded-full w-[44px] h-[44px] bg-black/10 items-center justify-center">
                    <IconComponent />
                  </View>
                </View>
            </View>

            {/* Modal Selector de Color */}
            <Modal animationType="fade" transparent={true} visible={colorSelector} onRequestClose={() => setColorSelector(false)}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalTitle}>Selecciona un Color</Text>
                  <FlatList
                    data={defaultColors}
                    renderItem={({ item }) => (
                      <Pressable onPress={() => { setColor(item); setColorSelector(false); }} style={{ backgroundColor: item, borderRadius: 999, width: 44, height: 44, margin: 10 }} />
                    )}
                    numColumns={4}
                    contentContainerStyle={styles.colorGrid}
                  />
                  <Pressable style={styles.closeButton} onPress={() => setColorSelector(false)}>
                    <Text style={styles.closeButtonText}>Cerrar</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>

            {/* Lista de ropa */}
            <FlatList
              style={{ marginTop: 20 }}
              numColumns={2}
              data={articulos}
              ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
              ListFooterComponent={() => <View style={{ height: 100 }} />}
              // scrollEnabled siempre activo, ya no choca con el gesto
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => {
                    try {
                      useArticulos.getState().selectArticulo(item);
                      router.push('/ver-articulo');
                    } catch (e) { console.warn('Error selecting', e); }
                  }}
                  style={{ flex: 1, backgroundColor: 'white', overflow: 'hidden', marginLeft: index % 2 === 1 ? 4 : 0, marginRight: index % 2 === 0 ? 4 : 0 }}
                >
                  <View style={{ borderColor: '#F3F3F3', borderWidth: 1, borderRadius: 12, marginBottom: 5, padding: 10, aspectRatio: 1 / 1.5 }}>
                    <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: '100%', borderRadius: 8 }} resizeMode="contain" />
                  </View>
                  <View className="flex-1 items-center">
                    <View style={{ backgroundColor: '#F3F3F3', width: 38, height: 4, borderRadius: 999 }} />
                  </View>
                </Pressable>
              )}
            />
          </View>
        </View>
      </RBSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  modalView: { margin: 20, backgroundColor: 'white', borderRadius: 15, padding: 25, alignItems: 'center', width: '80%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  colorGrid: { justifyContent: 'center', alignItems: 'center', paddingBottom: 15 },
  closeButton: { marginTop: 15, backgroundColor: '#DEDEDE', padding: 10, borderRadius: 8 },
  closeButtonText: { color: '#333', fontWeight: 'bold' },
});