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
): Promise<ClothingAnalysisDTO | undefined> {
  const formData = new FormData();
  formData.append('file', {
    uri: uri,
    type: 'image/png', // o el tipo que corresponda
    name: 'photo.png', // nombre del archivo
  } as any);

  try {
    return await http.post<ClothingAnalysisDTO>('image/generateDetails', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function uploadPrenda(data: any, uri: string): Promise<boolean> {
  return uploadArticulo(data, uri, 'prenda');
}

export async function uploadAccesorio(
  data: any,
  uri: string,
): Promise<boolean> {
  return uploadArticulo(data, uri, 'articulo');
}

async function uploadArticulo(
  data: any,
  uri: string,
  endpoint: 'prenda' | 'articulo',
): Promise<boolean> {
  const formData = new FormData();
  formData.append('file', {
    uri: uri,
    type: 'image/png', // o el tipo que corresponda
    name: 'photo.png', // nombre del archivo
  } as any);

  formData.append('data', data);

  try {
    await http.post(`articulos/create/${endpoint}`, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    return true;
  } catch (e) {
    console.error(e);
  }

  return false;
}
