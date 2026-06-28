export enum EstadoReporte {
  PENDIENTE  = 'pendiente',
  EN_PROCESO = 'en_proceso',
  RECHAZADO  = 'rechazado',
  FINALIZADO = 'finalizado'
}

export interface Reporte {
  id: number;
  tipoInfraccion: string;
  direccion: string;
  horaIncidente: string;
  fechaIncidente: Date;
  descripcion: string;
  foto: string;
  latitud: number;
  longitud: number;
  etiqueta: string;
  lat?: number;
  lng?: number;
  estado?: EstadoReporte;
  fechaAceptado?: Date;
  fechaFinalizado?: Date;
  resumenOperativo?: string;
  fechaRechazado?: Date;
  acompanado?: boolean;
  placaCompanero?: string;
  nombreCompanero?: string;
  placaAgente?: string;
  nombreAgente?: string;
  esCompanero?: boolean;
  huboComparendo?: boolean | null;
}

export interface Tarea {
  id: number;
  titulo: string;
  admin: string;
  descripcion: string;
  estado: 'PENDIENTE' | 'EN PROCESO' | 'FINALIZADO' | 'RECHAZADO';
  hora: string;
  fecha: string;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA';
  fechaInicio?: Date;
  fechaFin?: Date;
  resumenOperativo?: string;
}

export interface Notificacion {
  id?: number;
  tipo: 'REPORTE' | 'TAREA';
  texto: string;
  hora: string;
  data?: any;
  leida: boolean;
  idReferencia?: number;
}

export interface ReporteAsignado {
  id: number;
  tipoInfraccion: string;
  direccion: string;
  horaIncidente: string;
  fechaIncidente: string;
  descripcion: string;
  urlFoto: string;
  latitud: number;
  longitud: number;
  prioridad: string;
  estado: string;
  fechaAceptado?: string;
  fechaFinalizado?: string;
  fechaRechazado?: string;
  resumenOperativo?: string;
  acompanado?: boolean;
  placaCompanero?: string;
  nombreCompanero?: string;
  placaAgente?: string;
  nombreAgente?: string;
  huboComparendo?: boolean | null;
}
