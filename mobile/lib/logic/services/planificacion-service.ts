import http from '@/lib/data/http'; // Asegúrate de que la ruta a tu http.ts es esta
import { Planificacion } from '@/lib/domain/models/planificacion';

export async function getPlansRange(start: string, end: string): Promise<Planificacion[]> {
  try {
    // GET no necesita cambios, solo la URL
    return await http.get<Planificacion[]>(`planning/range?start=${start}&end=${end}`);
  } catch (e) {
    console.error("Error fetching plans:", e);
    return [];
  }
}

export async function createPlan(plan: Partial<Planificacion>): Promise<Planificacion | null> {
  try {
    // CORRECCIÓN: Envolvemos el plan en 'body' y lo convertimos a texto
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