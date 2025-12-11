import http from '@/lib/data/http'; 
import { Planificacion } from '@/lib/domain/models/planificacion';

const formatDateSpanish = (dateString: string | Date | undefined) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); 
    const year = d.getFullYear();

    return `${day}-${month}-${year}`; 
};

const formatDateISO = (dateString: string | Date | undefined) => {
    if (!dateString) return '';
    if (typeof dateString === 'string' && dateString.includes('T')) {
        return dateString.split('T')[0];
    }
    
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); 
    const year = d.getFullYear();

    return `${day}-${month}-${year}`; 
};

export async function createPlan(plan: Partial<Planificacion>): Promise<Planificacion | null> {
  try {
    const payload = {
        ...plan,
        fechaInicio: formatDateSpanish(plan.fechaInicio),
        fechaFin: formatDateSpanish(plan.fechaFin),
        temperaturaMedia: plan.temperaturaMedia ? Number(plan.temperaturaMedia) : null
    };

    return await http.post<Planificacion>('planning/create', {
        body: JSON.stringify(payload)
    });
  } catch (e) {
    console.error("Error creating plan:", e);
    return null;
  }
}

export async function getPlansRange(start: string, end: string): Promise<Planificacion[]> {
  try {
    return await http.get<Planificacion[]>(`planning/range?start=${start}&end=${end}`);
  } catch (e) {
    console.error("Error fetching plans:", e);
    return [];
  }
}

export async function getAllPlans(): Promise<Planificacion[]> {
    try {
        const start = '2023-01-01';
        const end = '2025-12-31';
        return await http.get<Planificacion[]>(`planning/range?start=${start}&end=${end}`);
    } catch (e) {
        console.error("Error fetching all plans:", e);
        return [];
    }
}

export async function addOutfitToPlan(planId: number, outfitId: number, fecha: string): Promise<boolean> {
  try {
    const fechaLimpia = formatDateISO(fecha);

    await http.post('planning/add-outfit', {
        body: JSON.stringify({ 
            planId, 
            outfitId, 
            fecha: fechaLimpia 
        })
    });
    return true;
  } catch (e) {
    console.error("Error adding outfit to plan:", e);
    return false;
  }
}