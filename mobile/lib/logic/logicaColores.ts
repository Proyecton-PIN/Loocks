

function hexToSimpleName(hex?: string) {
  if (!hex) return hex;

  // Normalize to #rrggbb
  let h = hex.trim().toLowerCase();
  if (h.startsWith('0x')) h = '#' + h.slice(2);
  if (!h.startsWith('#')) h = '#' + h;
  if (h.length === 4) h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];

  const named: Record<string, string> = {
    '#000000': 'Negro',
    '#ffffff': 'Blanco',
    '#ff0000': 'Rojo',
    '#8b0000': 'Rojo oscuro',
    '#b22222': 'Rojo ladrillo',
    '#ff7f50': 'Coral',
    '#ffa500': 'Naranja',
    '#ffd700': 'Dorado',
    '#ffff00': 'Amarillo',
    '#808000': 'Oliva',
    '#008000': 'Verde',
    '#00ff00': 'Verde claro',
    '#006400': 'Verde oscuro',
    '#00ffff': 'Cian',
    '#40e0d0': 'Turquesa',
    '#0000ff': 'Azul',
    '#1e90ff': 'Azul dodger',
    '#00008b': 'Azul oscuro',
    '#4b0082': 'Índigo',
    '#800080': 'Morado',
    '#ff00ff': 'Magenta',
    '#ffc0cb': 'Rosa',
    '#f5deb3': 'Beige',
    '#deb887': 'Marrón claro',
    '#a52a2a': 'Marrón',
    '#808080': 'Gris',
    '#2f4f4f': 'Gris oscuro',
    '#add8e6': 'Azul claro',
    '#f0e68c': 'Caqui',
  };

  if (named[h]) return named[h];

  // Fallback: find nearest named color by RGB distance
  function hexToRgb(hexStr: string) {
    const r = parseInt(hexStr.substr(1, 2), 16);
    const g = parseInt(hexStr.substr(3, 2), 16);
    const b = parseInt(hexStr.substr(5, 2), 16);
    return { r, g, b };
  }

  try {
    const target = hexToRgb(h);
    let bestName = h;
    let bestDist = Infinity;
    for (const [k, name] of Object.entries(named)) {
      const c = hexToRgb(k);
      const dr = c.r - target.r;
      const dg = c.g - target.g;
      const db = c.b - target.b;
      const dist = dr * dr + dg * dg + db * db;
      if (dist < bestDist) {
        bestDist = dist;
        bestName = name;
      }
    }
    return bestName;
  } catch (e) {
    return hex;
  }
}

export { hexToSimpleName };
