import http from '@/lib/data/http';
import { HttpError } from '@/lib/domain/errors/http-error';
import { NetworkError } from '@/lib/domain/errors/network-error';
import { SecureStore } from './secure-store-service';

export async function login(
  email: string,
  password: string,
): Promise<string | undefined> {
  try {
    const resp = await http.post<{ token: string; userId: string }>('auth/login', {
      body: JSON.stringify({ email, password }),
    });


    SecureStore.save('token', resp.token);
    http.init(resp.token);
    SecureStore.save('userId', resp.userId);

  } catch (e) {
    if (e instanceof NetworkError) {
      return e.message;
    }
    if (e instanceof HttpError) {
      if (e.statusCode === 401) {
        return 'Credenciales incorrectas';
      } else {
        return 'Error al iniciar sesión';
      }
    }
  }
}

export async function checkAuth(): Promise<boolean> {
  let authenticated: boolean = true;
  try {
    authenticated = await http.get<boolean>('auth/check');
  } catch (e) {
    if (e instanceof NetworkError) return true;
    authenticated = false;
  }

  if (!authenticated) {
    SecureStore.remove('token');
  }

  return authenticated;
}
