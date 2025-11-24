import { OutfitLog } from '@/lib/domain/models/outfit-log';
import { Outfit } from '@/lib/domain/models/outift';
import {
  createOutfit,
  getOutfitLogs,
  getOutfitSuggestions,
} from '@/lib/logic/services/outfit-service';
import { create } from 'zustand';

interface State {
  suggested: Outfit[];
  logs: OutfitLog[];
  loadOutfits(): Promise<void>;
  createOutfit(outfit: Partial<Outfit>): Promise<void>;
}

export const useOutfit = create<State>((set, get) => ({
  suggested: [],
  logs: [],

  async loadOutfits() {
    const [suggested, logs] = await Promise.all([
      await getOutfitSuggestions(),
      await getOutfitLogs(),
    ]);

    set({
      suggested,
      logs,
    });
  },

  async createOutfit(outfit: Partial<Outfit>) {
    const createdOutfit = await createOutfit(outfit);
    if (!createdOutfit) return;

    set((s) => ({
      logs: [createdOutfit, ...s.logs],
    }));
  },
}));
