export interface Reporte {
  id: number;
  placaAgente: string;
  fechaIncidente: Date; // yyyy-mm-dd
  horaIncidente: Date; // hh:mm
  ubicacion: string;
  tipoIncidente: string;
  descripcion: string;
  resenaCiudadano: string;
  resumenOperativo?: string;
  direccion?: string;
  tipoInfraccion?: string;
  acompanado?: boolean;
  placaCompanero?: string;
  huboComparendo?: boolean;
}
