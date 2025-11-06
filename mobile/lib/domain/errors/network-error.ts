export class NetworkError extends Error {
  constructor() {
    super('No hay conexión a internet');
  }
}
