export interface Agente {
  id: number;
  placa: string;
  nombre: string;
  documento: string;
  estado: 'DISPONIBLE' | 'OCUPADO' | 'FUERA_SERVICIO';
  telefono: string;
  foto?: string;
  promedioResenas: number;
  activo?: boolean;
}