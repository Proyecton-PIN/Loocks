import { Articulo } from '../models/articulo';

export interface NewItemDataDTO {
  details: Articulo;
  isPrenda: boolean;
}
