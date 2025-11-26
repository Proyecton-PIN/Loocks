import { OutfitLog } from '@/lib/domain/models/outfit-log';
import { Outfit } from '@/lib/domain/models/outift';
import {
  createOutfit,
  getOutfitLogs,
  getOutfitSuggestions,
  removeOutfit,
} from '@/lib/logic/services/outfit-service';
import { router } from 'expo-router';
import { create } from 'zustand';

interface State {
  suggested: Outfit[];
  logs: OutfitLog[];
  selectedOutfit?: OutfitLog;
  loadOutfits(): Promise<void>;
  createOutfit(outfit: Partial<Outfit>): Promise<void>;
  removeOutfit(id: number): Promise<boolean>;
  selectOutfit?(o?: OutfitLog): void;
  addOutfitLog(log: OutfitLog): void;
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
}));
