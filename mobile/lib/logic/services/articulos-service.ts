import http from '@/lib/data/http';
import { ClothingAnalysisDTO } from '@/lib/domain/dtos/clothing-analysis-dto';
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

export async function generateDetails(
  uri: string,
): Promise<{ image?: string; details?: ClothingAnalysisDTO } | undefined> {
  // Send the photo to the backend processPreview endpoint which returns
  // a processed image and analysis details.
  const formData = new FormData();
  formData.append(
    'file',
    {
      uri: uri,
      type: 'image/png',
      name: 'photo.png',
    } as any,
  );

  try {
    // Expected response: { image: string (url or data-uri), details: ClothingAnalysisDTO }
    const resp = await http.postForm<{ image?: string; details?: ClothingAnalysisDTO }>(
      'processPreview',
      formData,
    );

    if (!resp) return undefined;

    // Return the whole response so the caller can use both processed image and details
    return resp;
  } catch (e) {
    console.log('generateDetails error', e);
    return undefined;
  }
}

export async function uploadPrenda(
  data: any,
  uri: string,
): Promise<Prenda | undefined> {
  const formData = new FormData();
  formData.append('file', {
    uri: uri,
    type: 'image/png', // o el tipo que corresponda
    name: 'photo.png', // nombre del archivo
  } as any);

  formData.append('data', data);

  try {
    const resp = await http.post<Prenda>('articulos/create/prenda', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    return resp;
  } catch (e) {
    console.error(e);
  }
}

export async function uploadAccesorio(
  data: any,
  uri: string,
): Promise<Prenda | undefined> {
  const formData = new FormData();
  formData.append('file', {
    uri: uri,
    type: 'image/png', // o el tipo que corresponda
    name: 'photo.png', // nombre del archivo
  } as any);

  formData.append('data', data);

  try {
    const resp = await http.post<Prenda>('articulos/create/articulo', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
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

