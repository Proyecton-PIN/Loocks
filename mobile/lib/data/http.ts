import { ApiUrl } from '@/constants/api-constants';
import { HttpError } from '../domain/errors/http-error';
import { NetworkError } from '../domain/errors/network-error';
import { SecureStore } from '../logic/services/secure-store-service';

class Http {
  private baseUrl: string = '';
  private token?: string = '';

  public async init(token?: string) {
    this.baseUrl = ApiUrl + '/api/';
    this.token = token ?? (await SecureStore.get('token')) ?? '';
  }

  private async query<T>(
    method: 'GET' | 'POST' | 'DELETE',
    url: string,
    extra?: RequestInit,
  ): Promise<T> {
    try {
      const resp = await fetch(this.baseUrl + url, {
        ...extra,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...extra?.headers,
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (!resp.ok) throw new HttpError(resp.status, resp.statusText);

      return resp.json() as T;
    } catch (error) {
      if (
        error instanceof TypeError &&
        error.message === 'Network request failed'
      ) {
        throw new NetworkError();
      }

      throw error;
    }
  }

  public async get<T>(url: string, extra?: RequestInit): Promise<T> {
    return this.query<T>('GET', url, extra);
  }

  public async post<T>(url: string, extra?: RequestInit): Promise<T> {
    return this.query<T>('POST', url, extra);
  }

  public async delete<T>(url: string, extra?: RequestInit): Promise<T> {
    return this.query<T>('DELETE', url, extra);
  }

  public async postForm<T>(url: string, form: FormData): Promise<T> {
    return this.query('POST', url, {
      body: form,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

const http: Http = new Http();
http.init();

export default http;
