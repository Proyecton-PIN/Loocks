package pin.loocks.logic.helpers;

import java.awt.Color;

import pin.loocks.domain.models.Articulo;

public class ColorHelper {
  public static double calculateColorAffinity(Articulo torso, Articulo piernas, Articulo pies) {
    double sumaPonderada = 0;
    double pesoAcumulado = 0;
    double pesoTorsoPiernas = 0.4,
        pesoPiernasPies = 0.25,
        pesoTorsoPies = 0.2,
        pesoSec = 0.075;

    if (torso != null && piernas != null) {
      sumaPonderada += getAfinidad(torso.getColorPrimario(), piernas.getColorPrimario()) * pesoTorsoPiernas;
      pesoAcumulado += pesoTorsoPiernas;
    }

    if (pies != null && torso != null) {
      sumaPonderada += getAfinidad(torso.getColorPrimario(), pies.getColorPrimario()) * pesoTorsoPies;
      pesoAcumulado += pesoTorsoPies;
    }

    if (pies != null && piernas != null) {
      sumaPonderada += getAfinidad(piernas.getColorPrimario(), pies.getColorPrimario()) * pesoPiernasPies;
      pesoAcumulado += pesoPiernasPies;
    }

    if (torso != null && torso.getColorSecundario() != null && piernas != null) {
      sumaPonderada += getAfinidad(torso.getColorSecundario(), piernas.getColorPrimario()) * pesoSec;
      pesoAcumulado += pesoSec;
    }

    if (piernas != null && piernas.getColorSecundario() != null && torso != null) {
      sumaPonderada += getAfinidad(piernas.getColorSecundario(), torso.getColorPrimario()) * pesoSec;
      pesoAcumulado += pesoSec;
    }

    double afinidad = sumaPonderada / pesoAcumulado;
    return (Math.round(afinidad) * 100.0) / 100.0;
  }

  private static double getAfinidad(String hex1, String hex2) {
    if (hex1 == null || hex2 == null)
      return 0.5; // Neutro si falta datos

    float[] hsb1 = hexToHSB(hex1);
    float[] hsb2 = hexToHSB(hex2);

    // --- REGLA 1: NEUTROS ---
    // Si alguno es casi blanco, negro o gris (baja saturación o brillo extremo)
    if (isNeutral(hsb1) || isNeutral(hsb2)) {
      return 1.0; // Los neutros combinan con todo
    }

    // --- REGLA 2: RUEDA DE COLOR ---
    // Hue viene de 0.0 a 1.0 en Java, lo multiplicamos por 360
    float h1 = hsb1[0] * 360;
    float h2 = hsb2[0] * 360;

    // Diferencia angular (distancia más corta en el círculo)
    float diff = Math.abs(h1 - h2);
    if (diff > 180)
      diff = 360 - diff;

    // Lógica de Puntuación
    if (diff <= 15)
      return 1.0; // Monocromático (Mismo color)
    if (diff <= 45)
      return 0.8; // Análogo (Colores vecinos)
    if (diff >= 160)
      return 0.9; // Complementario (Opuestos)
    if (diff >= 120 && diff <= 150)
      return 0.4; // Triada/Choque (Riesgoso)

    return 0.5; // Ni fu ni fa
  }

  // Convierte Hex "#FFFFFF" a HSB [Hue, Saturation, Brightness]
  private static float[] hexToHSB(String hex) {
    Color c = Color.decode(hex);
    return Color.RGBtoHSB(c.getRed(), c.getGreen(), c.getBlue(), null);
  }

  // Detecta si un color es visualmente "neutro" (Blanco, Negro, Gris, Beige muy
  // suave)
  private static boolean isNeutral(float[] hsb) {
    float saturation = hsb[1];
    float brightness = hsb[2];

    if (saturation < 0.15)
      return true; // Muy poco color (Gris)
    if (brightness < 0.15)
      return true; // Muy oscuro (Negro)
    if (brightness > 0.95 && saturation < 0.3)
      return true; // Muy claro (Blanco/Crema)

    return false;
  }

  // public static double distanciaColorHex(String hex1, String hex2,
  // double wH, double wS, double wL) {
  // float[] hsl1 = hexToHsl(hex1);
  // float[] hsl2 = hexToHsl(hex2);
  // return distanciaColorHsl(hsl1, hsl2, wH, wS, wL);
  // }

  // // Sobrecarga con pesos por defecto
  // public static double distanciaColorHex(String hex1, String hex2) {
  // double wH = 0.6;
  // double wS = 0.25;
  // double wL = 0.15;
  // return distanciaColorHex(hex1, hex2, wH, wS, wL);
  // }

  // private static double distanciaColorHsl(float[] c1, float[] c2,
  // double wH, double wS, double wL) {
  // double h1 = c1[0];
  // double s1 = c1[1];
  // double l1 = c1[2];

  // double h2 = c2[0];
  // double s2 = c2[1];
  // double l2 = c2[2];

  // // diferencia de tono, corrigiendo wrap 360°
  // double diffHue = Math.abs(h1 - h2);
  // double dh = Math.min(diffHue, 360.0 - diffHue) / 180.0; // [0,1]

  // double ds = Math.abs(s1 - s2); // asumiendo S en [0,1]
  // double dl = Math.abs(l1 - l2); // asumiendo L en [0,1] o [0,1] equiv.

  // return wH * dh + wS * ds + wL * dl;
  // }

  // private static float[] hexToHsl(String hex) {
  // int[] rgb = hexToRgb(hex);
  // return rgbToHsl(rgb[0], rgb[1], rgb[2]);
  // }

  // private static int[] hexToRgb(String hex) {
  // String h = hex.replace("#", "").trim();
  // if (h.length() == 3) {
  // // formato corto #RGB -> #RRGGBB
  // char r = h.charAt(0);
  // char g = h.charAt(1);
  // char b = h.charAt(2);
  // h = ("" + r + r + g + g + b + b);
  // }
  // int r = Integer.parseInt(h.substring(0, 2), 16);
  // int g = Integer.parseInt(h.substring(2, 4), 16);
  // int b = Integer.parseInt(h.substring(4, 6), 16);
  // return new int[] { r, g, b };
  // }

  // private static float[] rgbToHsl(int r, int g, int b) {
  // float rf = r / 255f;
  // float gf = g / 255f;
  // float bf = b / 255f;

  // float max = Math.max(rf, Math.max(gf, bf));
  // float min = Math.min(rf, Math.min(gf, bf));
  // float h, s;
  // float l = (max + min) / 2f;

  // if (max == min) {
  // // gris
  // h = 0f;
  // s = 0f;
  // } else {
  // float d = max - min;

  // // saturación
  // s = l > 0.5f ? d / (2f - max - min) : d / (max + min);

  // // tono
  // if (max == rf) {
  // h = (gf - bf) / d + (gf < bf ? 6f : 0f);
  // } else if (max == gf) {
  // h = (bf - rf) / d + 2f;
  // } else {
  // h = (rf - gf) / d + 4f;
  // }
  // h *= 60f; // pasar a grados
  // }

  // return new float[] { h, s, l };
  // }
}
