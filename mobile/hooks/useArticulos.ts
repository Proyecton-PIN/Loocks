import { NewItemDataDTO } from '@/lib/domain/dtos/new-item-data-dto';
import { Prenda } from '@/lib/domain/models/prenda';
import {
  fetchArticulos,
  generateDetails,
  uploadAccesorio,
  uploadPrenda,
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
    let query: Promise<Prenda | undefined>;

    const baseDetails = {
      ...data.details,
      armarioId: 1, // TODO: 1 por defecto
      tagsIds: [],
    };

    if (data.isPrenda) {
      query = uploadPrenda(
        {
          ...baseDetails,
          tipoPrenda: data.details.type,
        },
        data.details.imageUrl,
      );
    } else {
      query = uploadAccesorio(
        {
          ...baseDetails,
          tipoAccesorio: data.details.type,
        },
        data.details.imageUrl,
      );
    }

    const newPrenda = await query;
    
    set({ newItem: undefined });
    if (!newPrenda) return;

    set((s) => ({ prendas: [newPrenda, ...s.prendas] }));
  },
}));
