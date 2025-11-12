import { ApiUrl } from '@/constants/api-constants';
import { SecureStore } from './secure-store-service';

export async function createOutfit(dto: Record<string, any>): Promise<any | undefined> {
  try {
    const token = (await SecureStore.get('token')) ?? '';
    const resp = await fetch(`${ApiUrl}/api/outfits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    if (!resp.ok) {
      let bodyText = '';
      try {
        bodyText = await resp.text();
      } catch (e) {
        /* ignore */
      }
      console.error('createOutfit failed', resp.status, resp.statusText, bodyText);
      return undefined;
    }

    const data = await resp.json();
    return data;
  } catch (e) {
    console.error('createOutfit error', e);
    return undefined;
  }
}
