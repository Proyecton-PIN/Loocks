import { Articulo } from '@/lib/domain/models/articulo';
import { OutfitLog } from '@/lib/domain/models/outfit-log';
import { Outfit } from '@/lib/domain/models/outfits';
import {
  createOutfit,
  getOutfitLogs,
  getOutfitSuggestions,
  probarOutfitEnAvatar,
  removeOutfit,
} from '@/lib/logic/services/outfit-service';
import { router } from 'expo-router';
import { create } from 'zustand';

type SuggestionParams = {
    temperatura?: number;
    estilo?: string;
    estacion?: string;
    limit?: number;
};

interface State {
  suggested: Outfit[];
  logs: OutfitLog[];
  selectedOutfit?: OutfitLog;
  outfitProbadoImg?: string;
  isOpenProbadorOutfit: boolean;
  isLoading: boolean;

  loadOutfits(): Promise<void>;
  generateWithFilters(params: SuggestionParams): Promise<void>;
  
  createOutfit(outfit: Partial<Outfit>): Promise<void>;
  removeOutfit(id: number): Promise<boolean>;
  selectOutfit?(o?: OutfitLog): void;
  addOutfitLog(log: OutfitLog): void;

  unSelectProbarEnAvatar(): void;
  probarEnAvatar(uri: string, articulos: Articulo[]): Promise<void>;
}

export const useOutfit = create<State>((set, get) => ({
  suggested: [],
  logs: [],
  isOpenProbadorOutfit: false,
  isLoading: false,

  async loadOutfits() {
    set({ isLoading: true });
    try{
      const [suggested, logs] = await Promise.all([
        await getOutfitSuggestions(),
        await getOutfitLogs(),
      ]);

      set({
        suggested,
        logs,
        isLoading: false
      });
    }catch(e){
      console.error("Error cargando outfits:", e);
      set({ isLoading: false });
    }
  },

  async generateWithFilters(params) {
    set({ isLoading: true });
    try {
        const suggested = await getOutfitSuggestions(params);
        set({ suggested, isLoading: false });
    } catch (e) {
        console.error("Error generando sugerencias:", e);
        set({ isLoading: false });
    }
  },

  async createOutfit(outfit: Partial<Outfit>) {
    const createdOutfit = await createOutfit(outfit);
    if (!createdOutfit) return;

    set((s) => ({
      logs: [createdOutfit, ...s.logs],
    }));
  },

  addOutfitLog(log: OutfitLog) {
    set((s) => ({ logs: [...s.logs, log] }));
  },

  selectOutfit(o?: OutfitLog): void {
    set({ selectedOutfit: o });
  },

  async removeOutfit(id: number) {
    const ok = await removeOutfit(id);
    if (!ok) return false;

    set((s) => ({
      logs: s.logs.filter((l) => l.outfit.id !== id),
      selectedOutfit: undefined,
    }));
    router.back();

    return true;
  },

  async probarEnAvatar(uri: string, articulos: Articulo[]): Promise<void> {
    const base64Img = await probarOutfitEnAvatar(uri, articulos);
    if (!base64Img) return;

    set({ outfitProbadoImg: base64Img, isOpenProbadorOutfit: true });
  },

  unSelectProbarEnAvatar() {
    set({ isOpenProbadorOutfit: false });
  },
}));
