import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Reporte, EstadoReporte } from '../agente.types';
import { CommonModule } from '@angular/common';
import { AgenteServiceTs } from '../../../service/agente.service';

@Component({
  selector: 'app-historial',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial implements OnInit {
  @Input() filtroInicial: 'TODOS' | 'ACEPTADOS' | 'RECHAZADOS' = 'TODOS';

  @Input() historial!: Reporte[];
  @Input() perfilAgenteNombre: string = '';
  @Input() perfilAgentePlaca: string = '';
  @Output() verDetalle = new EventEmitter<Reporte>();

  EstadoReporte = EstadoReporte;

  constructor(private agenteService: AgenteServiceTs) {}

  abrir(r: Reporte) {
    this.verDetalle.emit(r);
  }

  descargarPdf(r: Reporte, event: Event) {
    event.stopPropagation();
    
    
    const reporteConPerfil = {
      ...r,
      nombreAgente: this.perfilAgenteNombre || r.nombreAgente || '',
      placaAgente: this.perfilAgentePlaca || r.placaAgente || ''
    };
    
    
    this.agenteService.generarPdfOperativo(reporteConPerfil).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `operativo_${r.id}_${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al generar PDF:', err);
        import('sweetalert2').then(({ default: Swal }) => {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo generar el PDF',
            text: 'Hubo un problema al crear el documento. Verifica tu conexión e intenta de nuevo.'
          });
        });
      }
    });
  }

  ngOnInit(){
    this.filtroActivo = this.filtroInicial;
  }

  filtroActivo: 'TODOS' | 'ACEPTADOS' | 'RECHAZADOS' = 'TODOS';

  cambiarFiltro(filtro: 'TODOS' | 'ACEPTADOS' | 'RECHAZADOS') {
    this.filtroActivo = filtro;
  }

  get historialFiltrado() {
    if (this.filtroActivo === 'ACEPTADOS') {
      // ✅ Comparación contra EstadoReporte enum (minúsculas)
      return this.historial.filter(h => h.estado === EstadoReporte.FINALIZADO);
    }

    if (this.filtroActivo === 'RECHAZADOS') {
      return this.historial.filter(h => h.estado === EstadoReporte.RECHAZADO);
    }

    return this.historial;
  }

  // ✅ Fecha formateada para mostrar
  getFechaDisplay(r: Reporte): string {
    const fecha = r.fechaFinalizado ?? r.fechaRechazado ?? r.fechaIncidente;
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }
}
