import React, { FC, useEffect } from 'react';
import { Modal, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface Props {
  show: boolean;
  text: string;
}

export default function ImageAnalyzingModal({ show, text }: Props) {
  return (
    <Modal visible={show} animationType="slide">
      <View className="items-center justify-center flex-1">
        <LoadingSpinner text={text} />
      </View>
    </Modal>
  );
}

// Hacemos el Circle de SVG animable para aplicar estilos animados.
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// --- Configuraciones del Spinner ---
const SIZE = 100; // Ancho y alto del área del spinner
const STROKE_WIDTH = 8; // Grosor de la línea
const RADIUS = (SIZE - STROKE_WIDTH) / 2; // Radio del círculo
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // Circunferencia completa

// Valores de color para el gradiente
const COLOR_START = '#5639F8'; // Púrpura
const COLOR_END = '#A3E7F3'; // Rosa/Magenta

/**
 * Propiedades del componente LoadingSpinner
 * @interface
 */
interface LoadingSpinnerProps {
  /** El texto principal de la acción (e.g., "Recortando imagen"). */
  text: string;
  /** El subtexto opcional (e.g., "Revisa los valores de la IA..."). */
  subText?: string;
  /** Estilos opcionales para el contenedor principal. */
  style?: ViewStyle;
}

/**
 * Componente de Carga con Anillo Giratorio y Texto
 */
const LoadingSpinner: FC<LoadingSpinnerProps> = ({ text, subText, style }) => {
  // 1. Valor compartido para la rotación (de 0 a 360 grados)
  const rotation = useSharedValue(0);

  // 2. Estilo animado para aplicar la rotación al contenedor del SVG
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // 3. Efecto para iniciar la animación al montar el componente
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1500, // 1.5 segundos por vuelta
        easing: Easing.linear,
      }),
      -1, // Repetición infinita
      false, // No invierte la dirección
    );
  }, [rotation]); // Dependencia del efecto

  return (
    <View style={[styles.container, style]}>
      {/* --- EL SPINNER (Anillo Giratorio) --- */}
      <View style={styles.spinnerWrapper}>
        <Animated.View style={[styles.ringContainer, animatedStyles]}>
          <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            {/* Definición del gradiente lineal */}
            <Defs>
              <LinearGradient
                id="spinnerGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor={COLOR_START} stopOpacity="1" />
                <Stop offset="100%" stopColor={COLOR_END} stopOpacity="1" />
              </LinearGradient>
            </Defs>

            <AnimatedCircle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              strokeWidth={STROKE_WIDTH}
              stroke="url(#spinnerGradient)" // Referencia al gradiente
              fill="transparent"
              strokeLinecap="round"
              // Define el arco: 75% trazo, 25% espacio.
              strokeDasharray={[CIRCUMFERENCE * 0.75, CIRCUMFERENCE * 0.25]}
              strokeDashoffset={0}
            />
          </Svg>
        </Animated.View>
      </View>

      {/* --- EL TEXTO DE CARGA --- */}
      <Text style={styles.text}>{text}</Text>

      {/* --- EL SUBTEXTO --- */}
      {subText && <Text style={styles.subText}>{subText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // Puedes eliminar el backgroundColor aquí si prefieres que la pantalla lo defina
    // backgroundColor: '#F7F7F7',
  },
  spinnerWrapper: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringContainer: {
    // Estilo vacío, la animación se aplica directamente
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 20, // Espacio entre el spinner y el texto
  },
  subText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 40,
    marginTop: 10,
  },
});
