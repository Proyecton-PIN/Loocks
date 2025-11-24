import { Estacion } from '../enums/estacion';
import { Estilo } from '../enums/estilo';
import { TipoArticulo } from '../enums/tipo-articulo';

export interface ClothingAnalysisDTO {
  nombre: string;
  marca?: string;
  colores: ColorInfo[];
  colorPrimario: string;
  estacion: Estacion;
  tipo: TipoArticulo;
  base64Img?: string;
  estilo?: Estilo;
}

export interface ColorInfo {
  color: string;
  porcentaje: number;
}
