import { ApiUrl } from '@/constants/api-constants';
import http from '@/lib/data/http';
import { ClothingAnalysisDTO } from '@/lib/domain/dtos/clothing-analysis-dto';
import { Articulo } from '@/lib/domain/models/articulo';
import { Prenda } from '@/lib/domain/models/prenda';
import { SecureStore } from './secure-store-service';

export async function fetchArticulos(): Promise<Articulo[]> {
  try {
    const data = await http.get<Articulo[]>('articulos');
    return data;
  } catch (err) {
    console.error('Error cargando prendas:', err);
    return [];
  }
}

export async function generateDetails(
  uri: string,
): Promise<ClothingAnalysisDTO | undefined> {
  // Send the pho.
  console.log(uri);

  const formData = new FormData();
  formData.append('file', {
    uri: uri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any);

  try {
    console.log(
      'generateDetails: calling http.postForm processPreview fileUri=',
      uri,
    );
    const resp = await http.postForm<ClothingAnalysisDTO>(
      'articulos/getDetails',
      formData,
    );

    console.log(resp);

    if (!resp) {
      console.warn('generateDetails: empty response from postForm');
      return undefined;
    }

    return resp;
  } catch (e) {
    console.log('generateDetails error', e);
    return undefined;
  }
}

export async function createArticulo(data: Articulo): Promise<Articulo | undefined> {
  try {
    const resp = await http.post<Articulo>('articulos/create', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: JSON.stringify(data),
    });
    return resp;
  } catch (e) {
    console.error(e);
  }
}

export async function saveProcessed(body: any): Promise<Prenda | undefined> {
  try {
    const resp = await http.post<Prenda>('saveProcessed', {
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return resp;
  } catch (e) {
    console.error('saveProcessed error', e);
    return undefined;
  }
}

export async function updateArticulo(
  id: number,
  body: Partial<Record<string, any>>,
): Promise<any | undefined> {
  try {
    const token = (await SecureStore.get('token')) ?? '';
    const resp = await fetch(`${ApiUrl}/api/articulos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      console.error('updateArticulo failed', resp.status, resp.statusText);
      return undefined;
    }

    const data = await resp.json();
    return data;
  } catch (e) {
    console.error('updateArticulo error', e);
    return undefined;
  }
}

export async function deleteArticulo(id: number): Promise<boolean> {
  try {
    const token = (await SecureStore.get('token')) ?? '';
    const resp = await fetch(`${ApiUrl}/api/articulos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resp.ok) {
      let bodyText = '';
      try {
        bodyText = await resp.text();
      } catch (e) {
        /* ignore */
      }
      console.error('deleteArticulo failed', resp.status, resp.statusText, bodyText);
      return false;
    }

    return true;
  } catch (e) {
    console.error('deleteArticulo error', e);
    return false;
  }
}

