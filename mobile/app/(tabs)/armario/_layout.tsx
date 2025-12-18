import CustomCamera from '@/components/camera/custom-camera';
import ImageAnalyzingModal from '@/components/camera/image-analyzing-modal';
import { AddIcon, IconProps } from '@/constants/icons';
import { Colors } from '@/constants/theme';
import { useArticulos } from '@/hooks/useArticulos';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavBarIcon = (props: IconProps) => React.JSX.Element;
type NavBarItem = {
  name: string;
  label: string;
};

const tabConfig: NavBarItem[] = [
  { name: 'prendas-page', label: 'ARTICULO' },
  { name: 'outfits-page', label: 'OUTFITS' },
  { name: 'looks-page', label: 'LOOCKBOOK' },
];

export default function ArmarioLayout() {
  const router = useRouter();
  const generateDetails = useArticulos((s) => s.generateDetails);
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [lookbookCameraOpen, setLookbookCameraOpen] = useState(false);
  const [aiGeneratingOutfit, setAiGeneratingOutfit] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarPosition: 'top',
        }}
        tabBar={({ state, navigation }) => (
          <View
            className="flex-row h-[42px] mx-5 rounded-xl p-[3px] 
              gap-[1px] mb-[37px] mt-7"
            style={{
              backgroundColor: Colors.white,
              shadowColor: Colors.black,
              shadowOffset: { height: 10, width: 0 },
              shadowOpacity: 1,
              shadowRadius: 5,
              marginTop: insets.top + 10,
            }}
          >
            {tabConfig.map((tab, idx) => {
              const isFocused = state.index === idx;
              return (
                <Pressable
                  key={tab.name}
                  onPress={() => navigation.navigate(tab.name)}
                  className={`flex-1 items-center justify-center bg-red-500 rounded-[9px]`}
                  style={{
                    backgroundColor: isFocused ? Colors.black : Colors.white,
                  }}
                >
                  <Text
                    className="text-md font-normal"
                    style={{
                      color: isFocused ? Colors.white : Colors.black,
                      fontSize: 13,
                      fontWeight: 500,
                      fontFamily: 'Shatoshi',
                    }}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      >
        {tabConfig.map((e) => (
          <Tabs.Screen name={e.name} />
        ))}
      </Tabs>

      {/* Menú de opciones flotantes */}
      {menuOpen && (
        <>
          {/* Overlay para cerrar el menú al tocar afuera */}
          <Pressable
            onPress={() => setMenuOpen(false)}
            style={styles.overlay}
          />
          
          {/* Opciones del menú */}
          <View style={styles.menuContainer}>
            <Pressable
              onPress={() => {
                setMenuOpen(false);
                router.push('/probar-outfit');
              }}
              style={styles.menuItem}
            >
              <View style={styles.menuButton}>
                <Ionicons name="shirt" size={24} color="white" />
              </View>
              <Text style={styles.menuLabel}>Probar outfit</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setMenuOpen(false);
                router.push('/generador-outfit');
              }}
              style={styles.menuItem}
            >
              <View style={styles.menuButton}>
                <Ionicons name="sparkles" size={24} color="white" />
              </View>
              <Text style={styles.menuLabel}>Generar outfit IA</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setMenuOpen(false);
                setLookbookCameraOpen(true);
              }}
              style={styles.menuItem}
            >
              <View style={styles.menuButton}>
                <Ionicons name="camera" size={24} color="white" />
              </View>
              <Text style={styles.menuLabel}>Nuevo lookbook</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setMenuOpen(false);
                setCameraOpen(true);
              }}
              style={styles.menuItem}
            >
              <View style={styles.menuButton}>
                <Ionicons name="add" size={24} color="white" />
              </View>
              <Text style={styles.menuLabel}>Nuevo artículo</Text>
            </Pressable>
          </View>
        </>
      )}

      {/* Botón principal FAB */}
      <Pressable
        onPress={() => setMenuOpen(!menuOpen)}
        style={[styles.fab, { transform: [{ rotate: menuOpen ? '45deg' : '0deg' }] }]}
      >
        <AddIcon />
      </Pressable>

      {/* CustomCamera component for new articles */}
      {cameraOpen && (
        <CustomCamera
          onTakeImage={(uri) => {
            setCameraOpen(false);
            setIsLoading(true);
            generateDetails(uri).then(() => {
              setIsLoading(false);
              router.push('/(tabs)/armario/prendas-page');
            });
          }}
          trigger={(solicitarPermisos) => {
            solicitarPermisos();
            return null;
          }}
        />
      )}

      {/* CustomCamera component for lookbook */}
      {lookbookCameraOpen && (
        <CustomCamera
          onTakeImage={async (uri) => {
            setLookbookCameraOpen(false);
            setIsLoading(true);
            
            // TODO: Implementar lógica para guardar foto en lookbook
            // Por ahora solo cierra la cámara
            console.log('Foto para lookbook:', uri);
            
            setIsLoading(false);
            router.push('/(tabs)/armario/looks-page');
          }}
          trigger={(solicitarPermisos) => {
            solicitarPermisos();
            return null;
          }}
        />
      )}

      <ImageAnalyzingModal show={isLoading} text="Recortando imagen" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 20,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    zIndex: 15,
    gap: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  menuLabel: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
