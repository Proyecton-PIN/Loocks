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
  selectedArticulo?: Articulo;

  fetchPrendas(): Promise<void>;
  generateDetails(uri?: string): Promise<void>;
  unselectArticulo(): void;
  addArticulo(): Promise<void>;
  updateSelectedArticulo(data: Partial<Articulo>): void;
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
      set({ selectedArticulo: undefined, isLoading: false });
      return;
    }

    set({
      selectedArticulo: resp,
      isLoading: false,
    });
    router.push('/articulo-detalles');
  },

  unselectArticulo() {
    set({ selectedArticulo: undefined });
  },

  async addArticulo() {
    if (!get().selectedArticulo) return;

    const newArticulo = await createArticulo(get().selectedArticulo!);
    if (!newArticulo) return;

    set((s) => ({ articulos: [...s.articulos, newArticulo] }));
    router.back();
  },

  updateSelectedArticulo(data: Partial<Articulo>) {
    let newData = get().selectedArticulo;
    newData = {
      ...newData,
      ...data,
    } as ClothingAnalysisDTO;

    set({ selectedArticulo: newData });
  },
}));
