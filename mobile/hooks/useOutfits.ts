import { Outfit } from '@/lib/domain/models/outift';
import {
  getOutfits,
  getOutfitSuggestions,
} from '@/lib/logic/services/outfit-service';
import { create } from 'zustand';

interface State {
  suggested: Outfit[];
  logs: Outfit[];
  loadOutfits(): Promise<void>;
}

export const useOutfit = create<State>((set, get) => ({
  suggested: [],
  logs: [],

  async loadOutfits() {
    set({
      suggested: await getOutfitSuggestions(),
      logs: await getOutfits(0, 10),
    });
  },
}));
