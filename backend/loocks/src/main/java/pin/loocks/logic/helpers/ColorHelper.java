package pin.loocks.logic.helpers;

public class ColorHelper {
  public static double distanciaColorHex(String hex1, String hex2,
      double wH, double wS, double wL) {
    float[] hsl1 = hexToHsl(hex1);
    float[] hsl2 = hexToHsl(hex2);
    return distanciaColorHsl(hsl1, hsl2, wH, wS, wL);
  }

  // Sobrecarga con pesos por defecto
  public static double distanciaColorHex(String hex1, String hex2) {
    double wH = 0.6;
    double wS = 0.25;
    double wL = 0.15;
    return distanciaColorHex(hex1, hex2, wH, wS, wL);
  }

  private static double distanciaColorHsl(float[] c1, float[] c2,
      double wH, double wS, double wL) {
    double h1 = c1[0];
    double s1 = c1[1];
    double l1 = c1[2];

    double h2 = c2[0];
    double s2 = c2[1];
    double l2 = c2[2];

    // diferencia de tono, corrigiendo wrap 360°
    double diffHue = Math.abs(h1 - h2);
    double dh = Math.min(diffHue, 360.0 - diffHue) / 180.0; // [0,1]

    double ds = Math.abs(s1 - s2); // asumiendo S en [0,1]
    double dl = Math.abs(l1 - l2); // asumiendo L en [0,1] o [0,1] equiv.

    return wH * dh + wS * ds + wL * dl;
  }

  private static float[] hexToHsl(String hex) {
    int[] rgb = hexToRgb(hex);
    return rgbToHsl(rgb[0], rgb[1], rgb[2]);
  }

  private static int[] hexToRgb(String hex) {
    String h = hex.replace("#", "").trim();
    if (h.length() == 3) {
      // formato corto #RGB -> #RRGGBB
      char r = h.charAt(0);
      char g = h.charAt(1);
      char b = h.charAt(2);
      h = ("" + r + r + g + g + b + b);
    }
    int r = Integer.parseInt(h.substring(0, 2), 16);
    int g = Integer.parseInt(h.substring(2, 4), 16);
    int b = Integer.parseInt(h.substring(4, 6), 16);
    return new int[] { r, g, b };
  }

  private static float[] rgbToHsl(int r, int g, int b) {
    float rf = r / 255f;
    float gf = g / 255f;
    float bf = b / 255f;

    float max = Math.max(rf, Math.max(gf, bf));
    float min = Math.min(rf, Math.min(gf, bf));
    float h, s;
    float l = (max + min) / 2f;

    if (max == min) {
      // gris
      h = 0f;
      s = 0f;
    } else {
      float d = max - min;

      // saturación
      s = l > 0.5f ? d / (2f - max - min) : d / (max + min);

      // tono
      if (max == rf) {
        h = (gf - bf) / d + (gf < bf ? 6f : 0f);
      } else if (max == gf) {
        h = (bf - rf) / d + 2f;
      } else {
        h = (rf - gf) / d + 4f;
      }
      h *= 60f; // pasar a grados
    }

    return new float[] { h, s, l };
  }
}
