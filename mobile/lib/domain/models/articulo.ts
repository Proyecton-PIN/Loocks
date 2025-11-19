import { ClothingAnalysisDTO } from '../dtos/clothing-analysis-dto';

export interface Articulo extends ClothingAnalysisDTO {
  imageUrl?: string;
  fechaCompra?: Date;
}
