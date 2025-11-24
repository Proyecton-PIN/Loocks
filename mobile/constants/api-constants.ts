import Constants from 'expo-constants';

export const ApiUrl =
  Constants.expoConfig?.extra?.apiUrl ?? 'http://192.168.1.205:8080';
