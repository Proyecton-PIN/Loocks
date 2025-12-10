import { OutfitLog } from "./outfit-log";

export interface Planificacion {
  id?: number;
  titulo?: string;
  ubicacion?: string;
  
  fechaInicio: string; 
  fechaFin: string;
  
  isMaleta: boolean;
  temperaturaMedia?: number;
  
  outfitLogs?: OutfitLog[]; 
}