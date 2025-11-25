import { ClothingAnalysisDTO } from '@/lib/domain/dtos/clothing-analysis-dto';
import { Articulo } from '@/lib/domain/models/articulo';
import {
  createArticulo,
  fetchArticulos,
  generateDetails,
  updateArticulo,
  deleteArticulo,
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
  updateSelectedArticulo(data: Partial<Articulo>): void;
  saveArticulo(): Promise<void>;
  removeArticulo(): Promise<void>;
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
      selectedArticulo: resp as Articulo,
      isLoading: false,
    });
    router.push('/editar-crear-articulo');
  },

  unselectArticulo() {
    set({ selectedArticulo: undefined });
  },

  updateSelectedArticulo(data: Partial<Articulo>) {
    let current = get().selectedArticulo;
    if(!current) return;

    const newData = {
      ...current,
      ...data,
    } as Articulo;

    set({ selectedArticulo: newData });
  },

  async saveArticulo() {
    const current = get().selectedArticulo;
    if (!current) return;

    set({ isLoading: true }); 
    if (current.id) {
      const updated = await updateArticulo(current.id, current);

      if (updated) {
        set(state => ({
                articulos: state.articulos.map(a => a.id === updated.id ? updated : a)
            }));
            router.back();
          }
    } else {
      const newArticulo = await createArticulo(current);

      if (newArticulo) {
        set((s) => ({ articulos: [...s.articulos, newArticulo] }));
        router.back();
      }
    }
    set({ isLoading: false }); 
    router.back(); 
  },
 async removeArticulo() {
      const current = get().selectedArticulo;

      if (!current || !current.id) return; 
      set({ isLoading: true });
      
      const success = await deleteArticulo(current.id);
      
      if (success) {
          set(state => ({
              articulos: state.articulos.filter(a => a.id !== current.id)
          }));
          router.back();
      }
      set({ isLoading: false });
  },
}));
