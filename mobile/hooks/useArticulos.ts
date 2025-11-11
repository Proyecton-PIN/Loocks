import { NewItemDataDTO } from '@/lib/domain/dtos/new-item-data-dto';
import { Prenda } from '@/lib/domain/models/prenda';
import {
    fetchArticulos,
    generateDetails,
    saveProcessed
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

    const details = await generateDetails(uri);
    if (!details) {
      set({ newItem: undefined, isLoading: false });
      return;
    }

    set({
      newItem: {
        details: {
          coloresSecundarios: details.colors.map((e) => e.color) ?? [],
          colorPrimario: details.primaryColor,
          estacion: details.seassons,
          imageUrl: uri,
          type: details.type,
        },
        isPrenda: details.isPrenda,
      },
      isLoading: false,
    });
  },

  clearNewItem() {
    set({ newItem: undefined });
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
