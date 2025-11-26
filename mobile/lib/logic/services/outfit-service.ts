import http from '@/lib/data/http';
import { Articulo } from '@/lib/domain/models/articulo';
import { OutfitLog } from '@/lib/domain/models/outfit-log';
import { Outfit } from '@/lib/domain/models/outift';

export async function probarOutfitEnAvatar(
  uri: string,
  articulos: Articulo[],
): Promise<string | undefined> {
  const formData = new FormData();
  formData.append('file', {
    uri: uri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any);

  formData.append('data', JSON.stringify(articulos.map((a) => a.id)));

  try {
    const resp = await http.postForm<string>('outfits/tryOnAvatar', formData);

    return resp;
  } catch {
    alert('Intentalo más tarde');
  }
}

export async function getOutfitSuggestions(): Promise<Outfit[]> {
  try {
    const resp = http.post<any>('outfits/generateSuggestions', {
      body: JSON.stringify({ limit: 5 }),
    });

    return resp;
  } catch (e) {
    return [];
  }
}

export async function getOutfitLogs(): Promise<OutfitLog[]> {
  try {
    const resp = await http.get<OutfitLog[]>('outfits/logs');
    return resp.map((e) => ({
      ...e,
      fechaInicio: new Date(e.fechaInicio),
    }));
  } catch (e) {
    return [];
  }
}

export async function createOutfit(
  outfit: Partial<OutfitLog>,
): Promise<OutfitLog | undefined> {
  try {
    const resp = await http.post<OutfitLog>('outfits/create', {
      body: JSON.stringify(outfit),
    });
    return {
      ...resp,
      fechaInicio: new Date(resp.fechaInicio),
    };
  } catch {
    return undefined;
  }
}

export async function removeOutfit(id: number): Promise<boolean> {
  try {
    await http.delete<void>(`outfits/${id}`);
    return true;
  } catch (e) {
    return false;
  }
}
