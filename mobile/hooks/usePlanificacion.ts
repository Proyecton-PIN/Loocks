import { create } from 'zustand';
import { 
    getPlansRange, 
    createPlan, 
    addOutfitToPlan,
    getAllPlans
} from '@/lib/logic/services/planificacion-service'
import { Planificacion } from '@/lib/domain/models/planificacion';

interface State {
  plans: Planificacion[];      
  allPlans: Planificacion[];  
  isLoading: boolean;

  fetchMonthPlans: (year: number, month: number) => Promise<void>;
  fetchAllPlans: () => Promise<void>;
  createNewPlan: (plan: Partial<Planificacion>) => Promise<boolean>;
}

export const usePlanning = create<State>((set, get) => ({
  plans: [],
  allPlans: [],
  isLoading: false,

  fetchMonthPlans: async (year: number, month: number) => {
    set({ isLoading: true });
    
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

    const data = await getPlansRange(startDate, endDate);
    
    set({ plans: data, isLoading: false });
  },

  fetchAllPlans: async () => {
    set({ isLoading: true });
  
    const data = await getAllPlans();

    const sortedData = data.sort((a, b) => {
        return new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime();
    });

    set({ allPlans: sortedData, isLoading: false }); 
  },

  createNewPlan: async (plan) => {
     set({ isLoading: true });
     
     const result = await createPlan(plan); 
     
     if (result) {
         set(state => ({ 
             plans: [...state.plans, result], 
             allPlans: [result, ...state.allPlans], 
         }));
         return true;
     }
     
     set({ isLoading: false });
     return false;
  }
}));