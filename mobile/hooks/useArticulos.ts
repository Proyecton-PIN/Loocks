import { ClothingAnalysisDTO } from '@/lib/domain/dtos/clothing-analysis-dto';
import { Articulo } from '@/lib/domain/models/articulo';
import {
  createArticulo,
  fetchArticulos,
  generateDetails,
} from '@/lib/logic/services/articulos-service';
import { router } from 'expo-router';
import { create } from 'zustand';

interface State {
  isLoading: boolean;
  articulos: Articulo[];
  newItem?: ClothingAnalysisDTO;

  fetchPrendas(): Promise<void>;
  generateDetails(uri?: string): Promise<void>;
  clearNewItem(): void;
  addArticulo(): Promise<void>;
  updateNewItem(data: Partial<ClothingAnalysisDTO>): void;
}

export const useArticulos = create<State>((set, get) => ({
  isLoading: true,
  articulos: [],

  async fetchPrendas() {
    const prendas = await fetchArticulos();
    set({ articulos: prendas, isLoading: false });
  },

  async generateDetails(uri?: string) {
    if (!uri) return;
    set({ isLoading: true });

    const resp = await generateDetails(uri);

    if (!resp) {
      set({ newItem: undefined, isLoading: false });
      return;
    }

    set({
      newItem: resp,
      isLoading: false,
    });
    router.push('/articulo-detalles');
  },

  clearNewItem() {
    set({ newItem: undefined });
  },

  async addArticulo() {
    if (!get().newItem) return;

    const newArticulo = await createArticulo(get().newItem!);
    if (!newArticulo) return;

    set((s) => ({ articulos: [...s.articulos, newArticulo] }));
  },

  updateNewItem(data: Partial<ClothingAnalysisDTO>) {
    let newData = get().newItem;
    newData = {
      ...newData,
      ...data,
    } as ClothingAnalysisDTO;

    set({ newItem: newData });
  },
}));
