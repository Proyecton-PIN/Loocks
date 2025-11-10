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

  async addArticulo(details: NewItemDataDTO) {
    let query: Promise<boolean>;

    if (details.isPrenda) {
      query = uploadPrenda(details.details, details.details.imageUrl);
    } else {
      query = uploadAccesorio(details.details, details.details.imageUrl);
    }

    const uploaded = await query;

    //TODO: Aquí suben los articulos o las prendas, modificar uploadPrenda/uploadAccesorio y el resultado tratarlo aquí
  },
}));
