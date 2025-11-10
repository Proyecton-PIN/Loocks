
export interface ClothingAnalysisDTO {
  primaryColor: string;
  colors: ColorInfo[];
  tags: string[];
  seassons: string;
  isPrenda: boolean;
  type: string;
}

interface ColorInfo {
  color: string;
  percentage: number;
}
