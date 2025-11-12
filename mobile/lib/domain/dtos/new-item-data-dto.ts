import { Articulo } from '../models/articulo';

export interface NewItemDataDTO {
  details: Articulo;
  isPrenda: boolean;
  // optional raw analysis returned by the backend (ClothingAnalysisDTO-like)
  rawDetails?: any;
  // optional base64 data URL of the processed image (if backend returned it)
  imageBase64?: string | null;
}
