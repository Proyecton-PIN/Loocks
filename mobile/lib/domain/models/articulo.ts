export interface Articulo {
  nombre?: string;
  marca?: string;
  fechaCompra?: string;
  colorPrimario: string;
  coloresSecundarios: string[];
  estacion: string;
  imageUrl: string;
  tagsIds?: string[];
  type: string;
}
