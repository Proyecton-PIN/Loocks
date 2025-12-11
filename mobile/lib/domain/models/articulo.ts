import { ClothingAnalysisDTO } from '../dtos/clothing-analysis-dto';
import { Estacion } from "../enums/estacion";
import { Estilo } from "../enums/estilo";
import { TipoArticulo } from "../enums/tipo-articulo";

export interface Articulo extends ClothingAnalysisDTO {
  id?: number;
  nombre: string;
  marca?: string;
  fechaCompra?: Date;
  fechaUltimoUso?: Date;

  imageUrl?: string;
  base64Img?: string;

  isFavorito?: boolean;
  usos?: number;

  estacion: Estacion;
  estilo: Estilo;
  tipo: TipoArticulo;
  colores: any[];
  zonasCubiertas?: string[];
}
