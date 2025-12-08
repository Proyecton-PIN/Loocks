import http from '@/lib/data/http'; 
import { Planificacion } from '@/lib/domain/models/planificacion';

export async function getPlansRange(start: string, end: string): Promise<Planificacion[]> {
  try {
    return await http.get<Planificacion[]>(`planning/range?start=${start}&end=${end}`);
  } catch (e) {
    console.error("Error fetching plans:", e);
    return [];
  }
}

export async function createPlan(plan: Partial<Planificacion>): Promise<Planificacion | null> {
  try {
    // CORRECCIÓN: Tu http.ts necesita que los datos vayan en 'body' como string
    return await http.post<Planificacion>('planning/create', {
        body: JSON.stringify(plan)
    });
  } catch (e) {
    console.error("Error creating plan:", e);
    return null;
  }
}

export async function addOutfitToPlan(planId: number, outfitId: number, fecha: string): Promise<boolean> {
  try {
    // CORRECCIÓN: Igual aquí, envolvemos los datos
    await http.post('planning/add-outfit', {
        body: JSON.stringify({ planId, outfitId, fecha })
    });
    return true;
  } catch (e) {
    console.error("Error adding outfit to plan:", e);
    return false;
  }
}