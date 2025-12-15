import { useArticulos } from '@/hooks/useArticulos';
import clsx from 'clsx';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
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
  '#F6B9F8',
  '#E272AF',
  '#FF7E8D',
  '#FFA90B',
  '#FFDEB3',
  '#A0E4E7',
  '#9BCCFF',
  '#B3B9FF',
  '#CFEB9D',
  '#F7F7F7',
  '#CFCFCF',
  '#D8D2AD',
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
  const [selected, setSelected] = useState(false);

  const [colorSelector, setColorSelector] = useState(false);
  const sheetRef = useRef(null);
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <View>
      <Pressable
        // onPress={() => setSelected(true)}
        onPress={() => sheetRef.current?.open()}
        className={clsx(
          'px-[9px] pt-[10px] flex-row rounded-t-3xl pb-[30px] mb-[-18px]',
        )}
        style={{ backgroundColor: color }}
      >
        <View className="flex-1 gap-[10px] px-[9px]">
          <Text className="flex-1 text-[32px] font-medium text-[#222222]">
            {name}
          </Text>
          <Text className={clsx(!articulos && 'opacity-0')}>
            {articulos?.length} prendas
          </Text>
        </View>
        <View className="rounded-full w-[44px] h-[44px] bg-black/10 items-center justify-center">
          <IconComponent />
        </View>
      </Pressable>

      <RBSheet 
        height={dimensions.height - insets.top}
        // draggable
        dragOnContent
        ref={sheetRef}
        openDuration={300}
        customModalProps={{
          animationType: "fade",
          statusBarTranslucent: true,
        }}
        customStyles={{
          draggableIcon: {
            backgroundColor: "#DFDFDF"
          },
          wrapper: {
            backgroundColor: color
          },
          container: {
            backgroundColor: "transparent"
          }
        }}
        customAvoidingViewProps={{
          enabled: false
        }}
      >
        <View className='flex-1 rounded-t-3xl'>
          <View className="bg-white flex-1 rounded-t-3xl px-[19px] pt-[10px]">
            <View className="items-center w-full">
              <View
                style={{
                  backgroundColor: '#F3F3F3',
                  width: 50,
                  height: 4,
                  borderRadius: '999',
                  marginBottom: 12,
                }}
              />
            </View>
            <View className="flex-row gap-[11px]">
              <TextInput
                value={name}
                onChangeText={(v) => setName(v)}
                style={{
                  borderColor: '#686868',
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  flex: 1,
                }}
              />

              <Pressable
                onPress={() => setColorSelector(true)}
                style={{
                  backgroundColor: color,
                  outlineColor: '#686868',
                  outlineWidth: 1,
                  outlineStyle: 'dashed',
                  borderRadius: 999,
                  width: 44,
                  height: 44,
                }}
              />

              <View style={{ backgroundColor: color, borderRadius: 1000 }}>
                <View className="rounded-full w-[44px] h-[44px] bg-black/10 items-center justify-center">
                  <IconComponent />
                </View>
              </View>
            </View>

            <Modal
              animationType="fade" // O "slide"
              transparent={true}
              visible={colorSelector}
              onRequestClose={() => setColorSelector(false)} // Para el botón de atrás en Android
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalTitle}>Selecciona un Color</Text>

                  {/* Cuadrícula de Círculos */}
                  <FlatList
                    data={defaultColors}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => {
                          setColor(item);
                          setColorSelector(false);
                        }}
                        style={{
                          backgroundColor: item,
                          borderRadius: 999,
                          width: 44,
                          height: 44,
                          margin: 10,
                        }}
                      />
                    )}
                    numColumns={4} // Define el número de columnas de la cuadrícula
                    contentContainerStyle={styles.colorGrid}
                  />

                  <Pressable
                    style={styles.closeButton}
                    onPress={() => setColorSelector(false)}
                  >
                    <Text style={styles.closeButtonText}>Cerrar</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>

            <FlatList
              style={{ marginTop: 20 }}
              numColumns={2}
              data={articulos}
              ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
              ListFooterComponent={() => <View style={{ height: 100 }} />}
              renderItem={({ item, index }) => {
                return (
                  <Pressable
                    onPress={() => {
                      // set selected articulo in store then navigate
                      try {
                        useArticulos.getState().selectArticulo(item);
                        router.push('/ver-articulo');
                      } catch (e) {
                        console.warn('Could not select articulo in store', e);
                      }
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: 'white',
                      overflow: 'hidden',
                      marginLeft: index % 2 === 1 ? 4 : 0,
                      marginRight: index % 2 === 0 ? 4 : 0,
                    }}
                  >
                    <View
                      style={{
                        borderColor: '#F3F3F3',
                        borderWidth: 1,
                        borderRadius: 12,
                        marginBottom: 5,
                        padding: 10,
                        aspectRatio: 1 / 1.5,
                      }}
                    >
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 8,
                        }}
                        resizeMode="contain"
                      />
                    </View>
                    <View className="flex-1 items-center">
                      <View
                        style={{
                          backgroundColor: '#F3F3F3',
                          width: 38,
                          height: 4,
                          borderRadius: '999',
                        }}
                      />
                    </View>
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </RBSheet>

      <Modal
        // visible={selected}
        visible={false}
        animationType="slide"
        onRequestClose={() => {
          setSelected(false);
          onClose(name, color);
        }}
      >
        <View
          style={{
            backgroundColor: color,
            flex: 1,
            paddingTop: 40,
          }}
        >
          <View className="bg-white flex-1 rounded-t-3xl px-[19px] pt-[10px]">
            <View className="items-center w-full">
              <View
                style={{
                  backgroundColor: '#F3F3F3',
                  width: 50,
                  height: 4,
                  borderRadius: '999',
                  marginBottom: 12,
                }}
              />
            </View>
            <View className="flex-row gap-[11px]">
              <TextInput
                value={name}
                onChangeText={(v) => setName(v)}
                style={{
                  borderColor: '#686868',
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  flex: 1,
                }}
              />

              <Pressable
                onPress={() => setColorSelector(true)}
                style={{
                  backgroundColor: color,
                  outlineColor: '#686868',
                  outlineWidth: 1,
                  outlineStyle: 'dashed',
                  borderRadius: 999,
                  width: 44,
                  height: 44,
                }}
              />

              <View style={{ backgroundColor: color, borderRadius: 1000 }}>
                <View className="rounded-full w-[44px] h-[44px] bg-black/10 items-center justify-center">
                  <IconComponent />
                </View>
              </View>
            </View>

            <Modal
              animationType="fade" // O "slide"
              transparent={true}
              visible={colorSelector}
              onRequestClose={() => setColorSelector(false)} // Para el botón de atrás en Android
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalTitle}>Selecciona un Color</Text>

                  {/* Cuadrícula de Círculos */}
                  <FlatList
                    data={defaultColors}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => {
                          setColor(item);
                          setColorSelector(false);
                        }}
                        style={{
                          backgroundColor: item,
                          borderRadius: 999,
                          width: 44,
                          height: 44,
                          margin: 10,
                        }}
                      />
                    )}
                    numColumns={4} // Define el número de columnas de la cuadrícula
                    contentContainerStyle={styles.colorGrid}
                  />

                  <Pressable
                    style={styles.closeButton}
                    onPress={() => setColorSelector(false)}
                  >
                    <Text style={styles.closeButtonText}>Cerrar</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>

            <FlatList
              style={{ marginTop: 20 }}
              numColumns={2}
              data={articulos}
              ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
              ListFooterComponent={() => <View style={{ height: 100 }} />}
              renderItem={({ item, index }) => {
                return (
                  <Pressable
                    onPress={() => {
                      // set selected articulo in store then navigate
                      try {
                        useArticulos.getState().selectArticulo(item);
                        router.push('/ver-articulo');
                      } catch (e) {
                        console.warn('Could not select articulo in store', e);
                      }
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: 'white',
                      overflow: 'hidden',
                      marginLeft: index % 2 === 1 ? 4 : 0,
                      marginRight: index % 2 === 0 ? 4 : 0,
                    }}
                  >
                    <View
                      style={{
                        borderColor: '#F3F3F3',
                        borderWidth: 1,
                        borderRadius: 12,
                        marginBottom: 5,
                        padding: 10,
                        aspectRatio: 1 / 1.5,
                      }}
                    >
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 8,
                        }}
                        resizeMode="contain"
                      />
                    </View>
                    <View className="flex-1 items-center">
                      <View
                        style={{
                          backgroundColor: '#F3F3F3',
                          width: 38,
                          height: 4,
                          borderRadius: '999',
                        }}
                      />
                    </View>
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // --- Estilos del Botón de Despliegue ---
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
  },
  previewCircle: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: 'white',
  },

  // --- Estilos del Modal (Desplegable) ---
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Fondo semi-transparente para el overlay
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    width: '80%', // Ajusta el ancho del modal
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  // --- Estilos de la Cuadrícula ---
  colorGrid: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15,
  },
  colorCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    margin: 8, // Espacio entre los círculos
    borderWidth: 1,
    borderColor: '#CCC',
  },

  // --- Estilos del Botón de Cerrar ---
  closeButton: {
    marginTop: 15,
    backgroundColor: '#DEDEDE',
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
});
