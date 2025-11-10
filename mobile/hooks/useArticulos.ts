import { Prenda } from '@/lib/domain/models/prenda';
import { fetchArticulos } from '@/lib/logic/services/articulos-service';
import { create } from 'zustand';

interface State {
  isLoading: boolean;
  prendas: Prenda[];
  fetchPrendas(): Promise<void>;
}

export const useArticulos = create<State>((set, get) => ({
  isLoading: true,
  prendas: [],

  async fetchPrendas() {
    const prendas = await fetchArticulos();
    set({ prendas, isLoading: false });
  },
}));
