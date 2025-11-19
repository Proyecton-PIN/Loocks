import { Estacion } from '../enums/estacion';
import { TipoArticulo } from '../enums/tipo-accesorio';

export interface ClothingAnalysisDTO {
  nombre: string;
  marca?: string;
  colores: ColorInfo[];
  tags: string[];
  estacion: Estacion;
  tipo: TipoArticulo;
  base64Img?: string;
}

export interface ColorInfo {
  color: string;
  percentage: number;
}
