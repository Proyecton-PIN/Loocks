import * as SecureStorage from 'expo-secure-store';

export class SecureStore {
  public static async save(key: string, value: string) {
    try {
      await SecureStorage.setItemAsync(key, value);
    } catch (error) {
      console.error('Error guardando token:', error);
    }
  }

  public static async get(key: string) {
    try {
      return await SecureStorage.getItemAsync(key);
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return null;
    }
  }

  public static async remove(key: string) {
    try {
      await SecureStorage.deleteItemAsync('authToken');
    } catch (error) {
      console.error('Error eliminando token:', error);
    }
  }
}
