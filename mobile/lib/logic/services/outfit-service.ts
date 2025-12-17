import http from '@/lib/data/http';
import { Articulo } from '@/lib/domain/models/articulo';
import { OutfitLog } from '@/lib/domain/models/outfit-log';
import { Outfit } from '@/lib/domain/models/outfits';

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

  articulos.forEach((e) => {
    formData.append('data', String(e.id));
  });
  // formData.append('data', JSON.stringify(articulos.map((a) => a.id)));

  try {
    const resp = await http.postForm<{
      data: { b64_json: string }[];
    }>('outfits/tryOnAvatar', formData);

    const img = resp.data[0].b64_json;
    console.log(img);

    return img;
  } catch (e) {
    console.log(e);
    alert('Intentalo más tarde');
  }
}

export async function getOutfitSuggestions(params: any = {}): Promise<Outfit[]> {
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

  export async function updateOutfit(
  outfitId: number,
  articulosIds: number[]
): Promise<boolean> {
  try {
    await http.post(`outfits/update/${outfitId}`, {
      body: JSON.stringify({ articulosIds }),
    });
    return true;
  } catch (e) {
    console.error('Error updating outfit:', e);
    return false;
  }
}
