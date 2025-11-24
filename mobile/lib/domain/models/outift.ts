import { Estacion } from '../enums/estacion';
import { Estilo } from '../enums/estilo';
import { Articulo } from './articulo';

export interface Outfit {
  id?: number;
  estacion: Estacion;
  estilo: Estilo;
  isFavorito?: boolean;
  articulos: Articulo[];
}
