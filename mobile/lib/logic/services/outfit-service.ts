import http from '@/lib/data/http';
import { Outfit } from '@/lib/domain/models/outift';

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

export async function getOutfits(
  offset?: number,
  limit?: number,
): Promise<Outfit[]> {
  try {
    const resp = http.post<Outfit[]>('outfits/filtered', {
      body: JSON.stringify({ offset, limit }),
    });
    return resp;
  } catch (e) {
    return [];
  }
}
