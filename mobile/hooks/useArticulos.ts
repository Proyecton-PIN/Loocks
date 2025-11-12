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
  // prefer data-url / base64 payload if backend returned imageBase64
  // backend returns `imageUrl` in the processPreview response, prefer that
  const imageFromServer = (resp as any).imageBase64 ?? (resp as any).imageUrl ?? (resp as any).image ?? uri;

    set({
      newItem: {
        // editable/displayable details used by the edit modal
        details: {
          coloresSecundarios: (info.colors?.map((e: any) => e.color) as string[]) ?? [],
          colorPrimario: info.primaryColor ?? info.primary_color ?? '',
          estacion: info.seassons ?? info.seasons ?? '',
          imageUrl: imageFromServer,
          type: info.type ?? info.tipo ?? '',
          tagsIds: info.tags ?? [],
        },
        // raw analysis returned by the backend (ClothingAnalysisDTO-like)
        rawDetails: info,
        // if backend returned a base64 data URL, keep it so we can send it later
        imageBase64: (resp as any).imageBase64 ?? null,
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
    // Build payload matching backend's saveProcessed contract:
    // { imageBase64: 'data:...', details: <ClothingAnalysisDTO-like object>, armarioId?, isPrenda }
    const anyData: any = data as any;

    // Helper: if we only have an imageUrl, fetch and convert to data URL
    async function urlToDataUrl(url?: string | null): Promise<string | null> {
      if (!url) return null;
      try {
        const r = await fetch(url);
        if (!r.ok) return null;
        const contentType = r.headers.get('Content-Type') || 'image/png';
        const arrayBuffer = await r.arrayBuffer();
        // Use Buffer if available (Metro often polyfills it);
        const b64 = (global as any).Buffer
          ? (global as any).Buffer.from(arrayBuffer).toString('base64')
          : typeof btoa === 'function'
          ? btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
          : null;
        if (!b64) return null;
        return `data:${contentType};base64,${b64}`;
      } catch (e) {
        console.error('urlToDataUrl failed', e);
        return null;
      }
    }

    let imageBase64: string | null = anyData.imageBase64 ?? null;
    if (!imageBase64) {
      // try details.imageUrl first
      const url = anyData.details?.imageUrl ?? anyData.imageUrl ?? null;
      if (url) {
        imageBase64 = await urlToDataUrl(url);
      }
    }

    // start from rawDetails if available (the original analysis) so we preserve tags/colors
    const raw = anyData.rawDetails ?? {};

    const edited = anyData.details ?? {};

    const detailsForSave: any = {
      ...raw,
    };

    // normalize primary color / colors
    if (edited.colorPrimario) {
      detailsForSave.primaryColor = edited.colorPrimario;
    } else if (edited.primaryColor) {
      detailsForSave.primaryColor = edited.primaryColor;
    }

    const colors: any[] = [];
    if (edited.colorPrimario) colors.push({ color: edited.colorPrimario });
    if (edited.primaryColor) colors.push({ color: edited.primaryColor });
    if (Array.isArray(edited.coloresSecundarios)) {
      edited.coloresSecundarios.forEach((c: any) => colors.push({ color: c }));
    }
    if (colors.length > 0) detailsForSave.colors = colors;

    if (edited.estacion) detailsForSave.seassons = [edited.estacion];

    // tags
    if (Array.isArray(edited.tagsIds) && edited.tagsIds.length > 0) {
      detailsForSave.tags = edited.tagsIds;
    } else if (Array.isArray(edited.tags)) {
      detailsForSave.tags = edited.tags;
    } else if (typeof edited.tags === 'string' && edited.tags.trim()) {
      detailsForSave.tags = edited.tags.split(',').map((s: string) => s.trim());
    }

    const body: any = {
      imageBase64,
      details: detailsForSave,
      isPrenda: anyData.isPrenda,
    };

    const newPrenda = await saveProcessed(body);

    set({ newItem: undefined });
    if (!newPrenda) return;

    set((s) => ({ prendas: [newPrenda, ...s.prendas] }));
  },
}));
