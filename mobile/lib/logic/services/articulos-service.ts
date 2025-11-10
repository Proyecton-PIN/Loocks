import http from '@/lib/data/http';
import { Prenda } from '@/lib/domain/models/prenda';

export async function fetchArticulos(): Promise<Prenda[]> {
  try {
    const data = await http.get<Prenda[]>('articulos');
    return data;
  } catch (err) {
    console.error('Error cargando prendas:', err);
    return [];
  }
}
