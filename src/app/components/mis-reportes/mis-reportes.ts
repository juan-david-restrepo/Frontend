import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { MisReportesService, ReporteCiudadano, ReporteEstadisticas } from '../../service/mis-reportes.service';
import { AuthService, AuthUser } from '../../service/auth.service';
import { ActividadRecienteService } from '../../service/actividad-reciente.service';
import { WebsocketService } from '../../service/websocket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Nav, Footer],
  templateUrl: './mis-reportes.html',
  styleUrls: ['./mis-reportes.css']
})
export class MisReportes implements OnInit, OnDestroy {
  reportes: ReporteCiudadano[] = [];
  estadisticas: ReporteEstadisticas | null = null;
  isLoggedIn = false;
  isLoading = true;
  editingReporte: ReporteCiudadano | null = null;

  editForm = {
    descripcion: '',
    direccion: '',
    fechaIncidente: '',
    horaIncidente: '',
    tipoInfraccion: ''
  };

  private destroy$ = new Subject<void>();

  constructor(
    private misReportesService: MisReportesService,
    private authService: AuthService,
    private actividadService: ActividadRecienteService,
    private websocketService: WebsocketService,
    private router: Router
  ) {}

  ngOnInit() {
    this.actividadService.registrarAccesoModulo('Mis Reportes');

    this.authService.refreshUser().subscribe({
      next: (user: AuthUser | null) => {
        if (!user || !user.userId) {
          this.isLoggedIn = false;
          Swal.fire({ icon: 'warning', title: 'Acceso denegado', text: 'Debe iniciar sesión para ver sus reportes' })
            .then(() => this.router.navigate(['/login']));
          return;
        }
        this.isLoggedIn = true;
        this.loadData();
        this.conectarWebSocket(user.email);
      },
      error: () => {
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.websocketService.disconnect();
  }

  private conectarWebSocket(email: string) {
    this.websocketService.connectCiudadano(email);

    this.websocketService.notificacionesCiudadano$
      .pipe(takeUntil(this.destroy$))
      .subscribe((notif: any) => {
        this.loadData();

        const tipo = notif.tipo ?? '';
        const mensaje = notif.mensaje ?? '';

        if (tipo === 'REPORTE_ACEPTADO' || mensaje.toLowerCase().includes('aceptado')) {
          Swal.fire({ icon: 'info', title: '¡Tu reporte fue tomado!', text: mensaje, timer: 4000, showConfirmButton: false });
        } else if (tipo === 'REPORTE_RECHAZADO' || mensaje.toLowerCase().includes('rechazado')) {
          Swal.fire({ icon: 'warning', title: 'Reporte rechazado', text: mensaje, timer: 4000, showConfirmButton: false });
        } else if (tipo === 'REPORTE_FINALIZADO' || mensaje.toLowerCase().includes('finalizado')) {
          Swal.fire({ icon: 'success', title: '¡Reporte finalizado!', text: mensaje, timer: 4000, showConfirmButton: false });
        }
      });
  }

  loadData() {
    this.isLoading = true;
    this.misReportesService.getMisReportes().subscribe({
      next: (data) => {
        this.reportes = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los reportes' });
      }
    });

    this.misReportesService.getEstadisticas().subscribe({
      next: (data) => { this.estadisticas = data; },
      error: () => {}
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'estado-pendiente';
      case 'EN_PROCESO': return 'estado-proceso';
      case 'FINALIZADO': return 'estado-finalizado';
      case 'RECHAZADO': return 'estado-rechazado';
      default: return '';
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_PROCESO': return 'En Proceso';
      case 'FINALIZADO': return 'Finalizado';
      case 'RECHAZADO': return 'Rechazado';
      default: return estado;
    }
  }

  puedeEditar(estado: string): boolean { return estado === 'PENDIENTE'; }
  puedeEliminar(estado: string): boolean { return estado === 'PENDIENTE'; }

  openEditModal(reporte: ReporteCiudadano) {
    this.editingReporte = reporte;
    this.editForm = {
      descripcion: reporte.descripcion || '',
      direccion: reporte.direccion || '',
      fechaIncidente: reporte.fechaIncidente || '',
      horaIncidente: reporte.horaIncidente || '',
      tipoInfraccion: reporte.tipoInfraccion || ''
    };
  }

  closeEditModal() { this.editingReporte = null; }

  saveEdit() {
    if (!this.editingReporte) return;
    this.misReportesService.actualizarReporte(this.editingReporte.id, {
      descripcion: this.editForm.descripcion,
      direccion: this.editForm.direccion,
      fechaIncidente: this.editForm.fechaIncidente,
      horaIncidente: this.editForm.horaIncidente,
      tipoInfraccion: this.editForm.tipoInfraccion
    }).subscribe({
      next: (updated) => {
        const index = this.reportes.findIndex(r => r.id === updated.id);
        if (index !== -1) this.reportes[index] = updated;
        this.closeEditModal();
        this.actividadService.registrarEdicionReporte(updated.id);
        Swal.fire({ icon: 'success', title: '¡Éxito!', text: 'Reporte actualizado correctamente' });
      },
      error: () => Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el reporte' })
    });
  }

  deleteReport(id: number) {
    Swal.fire({
      title: '¿Está seguro?', text: 'Esta acción no se puede deshacer', icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.misReportesService.eliminarReporte(id).subscribe({
          next: () => {
            this.reportes = this.reportes.filter(r => r.id !== id);
            this.actividadService.registrarEliminacionReporte(id);
            this.loadData();
            Swal.fire({ icon: 'success', title: '¡Eliminado!', text: 'Reporte eliminado correctamente' });
          },
          error: () => Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el reporte' })
        });
      }
    });
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '-';
    try { return new Date(dateStr).toLocaleDateString('es-CO'); }
    catch { return dateStr; }
  }

  getEvidenciaUrl(reporte: ReporteCiudadano): string | null {
    return reporte.evidencias?.length ? reporte.evidencias[0].archivo : null;
  }

  openInNewTab(url: string | null) {
    if (url) window.open(url, '_blank');
  }
}
