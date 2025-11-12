import { NewItemDataDTO } from '@/lib/domain/dtos/new-item-data-dto';
import { Prenda } from '@/lib/domain/models/prenda';
import {
  deleteArticulo as deleteArticuloService,
  fetchArticulos,
  generateDetails,
  saveProcessed,
  updateArticulo,
} from '@/lib/logic/services/articulos-service';
import { create } from 'zustand';

interface State {
  isLoading: boolean;
  prendas: Prenda[];
  newItem?: NewItemDataDTO;

  fetchPrendas(): Promise<void>;
  generateDetails(uri?: string): Promise<void>;
  clearNewItem(): void;
  addArticulo(details: NewItemDataDTO): Promise<void>;
  updateArticulo(id: number, dto: Partial<any>): Promise<void>;
  deleteArticulo(id: number): Promise<boolean>;
}

export const useArticulos = create<State>((set, get) => ({
  isLoading: true,
  prendas: [],

  async fetchPrendas() {
    const prendas = await fetchArticulos();
    set({ prendas, isLoading: false });
  },

  async generateDetails(uri?: string) {
    if (!uri) return;
    set({ isLoading: true });

    const resp = await generateDetails(uri);
    if (!resp) {
      set({ newItem: undefined, isLoading: false });
      return;
    }

    const info = (resp as any).details ?? resp;
    const imageFromServer = (resp as any).image ?? uri;

    set({
      newItem: {
        details: {
          coloresSecundarios: (info.colors?.map((e: any) => e.color) as string[]) ?? [],
          colorPrimario: info.primaryColor ?? info.primary_color ?? '',
          estacion: info.seassons ?? info.seasons ?? '',
          imageUrl: imageFromServer,
          type: info.type ?? info.tipo ?? '',
        },
        isPrenda: info.isPrenda ?? info.is_prenda ?? false,
      },
      isLoading: false,
    });
  },

  clearNewItem() {
    set({ newItem: undefined });
  },

  async updateArticulo(id: number, dto: Partial<any>) {
    const updated = await updateArticulo(id, dto);
    if (!updated) return;

    set((s) => ({ prendas: s.prendas.map((p) => (p.id === id ? updated : p)) }));
  },

  async deleteArticulo(id: number) {
    const ok = await deleteArticuloService(id);
    if (!ok) return false;

    // Refresh prendas from server to ensure the UI reflects the current state
    try {
      await get().fetchPrendas();
    } catch (e) {
      // Fallback to local removal if fetch fails
      set((s) => ({ prendas: s.prendas.filter((p) => p.id !== id) }));
    }

    return true;
  },

  async addArticulo(data: NewItemDataDTO) {
    // For processed images we send the final data to the saveProcessed endpoint
    // The backend expects a JSON body. Build a body with details and image reference.
    const body = {
      ...data.details,
      armarioId: 1, // TODO: replace with real value
      tagsIds: [],
      isPrenda: data.isPrenda,
      image: data.details.imageUrl,
    };

    const newPrenda = await saveProcessed(body);

    set({ newItem: undefined });
    if (!newPrenda) return;

    set((s) => ({ prendas: [newPrenda, ...s.prendas] }));
  },
}));
