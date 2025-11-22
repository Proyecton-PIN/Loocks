import { Estacion } from '../enums/estacion';
import { Articulo } from './articulo';

export interface Outfit {
  id?: number;
  estacion?: Estacion;
  estilo?: string;
  isFavorito: boolean;
  articulos: Articulo[];
}
