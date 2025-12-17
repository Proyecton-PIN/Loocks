import { Articulo } from '@/lib/domain/models/articulo';
import {
  createArticulo,
  deleteArticulo as deleteArticuloService,
  fetchArticulos,
  generateDetails,
  updateArticulo as updateArticuloService,
} from '@/lib/logic/services/articulos-service';
import { router } from 'expo-router';
import { create } from 'zustand';

interface State {
  isLoading: boolean;
  articulos: Articulo[];
  armarioArticulos: Record<string, Articulo[]>;
  selectedArticulo?: Articulo;

  selectArticulo(articulo: Articulo): void;

  fetchPrendas(): Promise<void>;
  generateDetails(uri?: string): Promise<void>;
  unselectArticulo(): void;

  divideArticulosByTipo(articulos: Articulo[]): Promise<void>;
  updateSelectedArticulo(data: Partial<Articulo>): void;
  saveArticulo(): Promise<void>;
  removeArticulo(): Promise<void>;
  updateArticulo(
    id: number,
    data: Partial<Record<string, any>>,
  ): Promise<any | undefined>;
  deleteArticulo(id: number): Promise<boolean>;
  setArticulos: (lista: Articulo[]) => void;
}

export const useArticulos = create<State>((set, get) => ({
  isLoading: true,
  articulos: [],
  armarioArticulos: {},

  setArticulos: (lista) => set({ articulos: lista }),

  async fetchPrendas() {
    const prendas = await fetchArticulos();
    set({ articulos: prendas, isLoading: false });
  },

  async divideArticulosByTipo(articulos: Articulo[]) {
    let armarioArticulos: Record<string, Articulo[]> = {};

    for (let a of articulos) {
      if (!armarioArticulos[a.tipo]) {
        armarioArticulos[a.tipo] = [a];
        continue;
      }
      armarioArticulos[a.tipo].push(a);
    }

    armarioArticulos['TODAS'] = articulos;

    set({ armarioArticulos });
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
    if (!current) return;

    const newData = {
      ...current,
      ...data,
    } as Articulo;

    set({ selectedArticulo: newData });
  },

  selectArticulo(articulo: Articulo) {
    set({ selectedArticulo: articulo });
  },

  async saveArticulo() {
    const current = get().selectedArticulo;
    if (!current) return;

    set({ isLoading: true });
    if (current.id) {
      // Build payload matching backend contract for PUT /api/articulos/{id}
      const colorPrimario =
        (current as any).colorPrimario ??
        (Array.isArray(current.colores) && current.colores.length > 0
          ? current.colores[0].color
          : undefined);
      const coloresSecundarios = Array.isArray(current.colores)
        ? current.colores
            .map((c: any) => c.color)
            .filter((c: string) => c !== colorPrimario)
        : [];

      const dto: any = {
        nombre: current.nombre,
        marca: current.marca ?? '',
        colorPrimario: colorPrimario ?? '',
        coloresSecundarios,
        estacion: current.estacion,
        fechaUltimoUso: current.fechaUltimoUso
          ? current.fechaUltimoUso instanceof Date
            ? current.fechaUltimoUso.toISOString()
            : String(current.fechaUltimoUso)
          : undefined,
        usos: typeof current.usos === 'number' ? current.usos : 0,
        armarioId: (current as any).armarioId ?? 0,
        tagsIds: Array.isArray((current as any).tags)
          ? (current as any).tags.map((t: any) =>
              typeof t === 'number' ? t : Number(t),
            )
          : [],
        imageUrl: current.imageUrl ?? undefined,
        tipo: current.tipo,
      };

      const updated = await updateArticuloService(current.id, dto);

      if (updated) {
        set((state) => ({
          articulos: state.articulos.map((a) =>
            a.id === updated.id ? updated : a,
          ),
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

    const success = await deleteArticuloService(current.id);

    if (success) {
      set((state) => ({
        articulos: state.articulos.filter((a) => a.id !== current.id),
      }));
      router.back();
    }
    set({ isLoading: false });
  },
  async updateArticulo(id: number, data: Partial<Record<string, any>>) {
    try {
      const resp = await updateArticuloService(id, data as any);
      if (resp) {
        set((s) => ({
          articulos: s.articulos.map((a) =>
            a.id === id ? { ...a, ...resp } : a,
          ),
          selectedArticulo: resp,
        }));
      }
      return resp;
    } catch (e) {
      console.error('store.updateArticulo error', e);
      return undefined;
    }
  },

  async deleteArticulo(id: number) {
    try {
      const ok = await deleteArticuloService(id);
      if (ok) {
        set((s) => ({
          articulos: s.articulos.filter((a) => a.id !== id),
          selectedArticulo: undefined,
        }));
      }
      return ok;
    } catch (e) {
      console.error('store.deleteArticulo error', e);
      return false;
    }
  },
}));
