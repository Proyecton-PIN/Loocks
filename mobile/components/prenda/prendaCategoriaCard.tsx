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
  // Aseguramos que articulos nunca sea undefined
  const articulosData = useArticulos((s) => s.armarioArticulos)[tipo];
  const articulos = articulosData || []; 

  const [color, setColor] = useState(initialColor);
  const [name, setName] = useState(initialName);
  
  const [colorSelector, setColorSelector] = useState(false);
  const sheetRef = useRef<any>(null);
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // --- GESTO PARA CERRAR ---
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      // Solo activamos si el movimiento es vertical hacia abajo y mayor que el horizontal
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        // Umbral de 30px para cerrar
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
          <Text className={clsx(articulos.length === 0 && 'opacity-0')}>
            {articulos.length} prendas
          </Text>
        </View>
        <View className="rounded-full w-[44px] h-[44px] bg-black/10 items-center justify-center">
          <IconComponent />
        </View>
      </Pressable>

      <RBSheet
        height={dimensions.height - insets.top}
        dragOnContent={false} // Desactivado para evitar conflicto con FlatList
        ref={sheetRef}
        openDuration={300}
        customModalProps={{ animationType: 'fade', statusBarTranslucent: true }}
        customStyles={{
          draggableIcon: { backgroundColor: '#DFDFDF' },
          wrapper: { backgroundColor: color },
          container: { backgroundColor: 'transparent' },
        }}
        customAvoidingViewProps={{ enabled: false }}
        onClose={() => onClose(name, color)}
      >
        <View className="flex-1 rounded-t-3xl">
          <View className="bg-white flex-1 rounded-t-3xl px-[19px] pt-[10px]">
            
            {/* --- HEADER CON GESTO DE CIERRE --- */}
            <View {...panResponder.panHandlers} style={{ alignItems: 'center', width: '100%', paddingVertical: 10, backgroundColor: 'transparent' }}>
                <View style={{ backgroundColor: '#F3F3F3', width: 50, height: 4, borderRadius: 999 }} />
            </View>

            {/* --- INPUTS (Fuera del gesto para poder escribir) --- */}
            <View className="flex-row gap-[11px] mb-2">
                <TextInput
                  value={name}
                  onChangeText={setName}
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

            {/* --- LISTA DE ARTÍCULOS --- */}
            <FlatList
              style={{ marginTop: 20, flex: 1 }} // flex: 1 es CRUCIAL para que se vea
              numColumns={2}
              data={articulos}
              keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
              ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
              ListFooterComponent={() => <View style={{ height: 100 }} />} // Espacio extra abajo
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => {
                    // 1. Cerramos la hoja
                    sheetRef.current?.close();
                    
                    try {
                      // 2. Seleccionamos el artículo
                      useArticulos.getState().selectArticulo(item);
                      
                      // 3. Navegamos con un pequeño retraso para permitir que la hoja empiece a cerrarse
                      // Esto soluciona que tengas que cerrar manualmente para ver la nueva pantalla
                      setTimeout(() => {
                        router.push('/ver-articulo');
                      }, 250); 
                    } catch (e) { console.warn('Error selecting', e); }
                  }}
                  style={{ 
                    flex: 1, 
                    backgroundColor: 'white', 
                    overflow: 'hidden', 
                    marginLeft: index % 2 === 1 ? 4 : 0, 
                    marginRight: index % 2 === 0 ? 4 : 0 
                  }}
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