import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SoporteService } from '../../service/soporte.service';
import { SoporteWebSocketService } from '../../service/soporte-websocket.service';
import { AuthService } from '../../service/auth.service';
import { TicketSoporte, TicketDetalle, NotificacionSoporte } from '../../models/soporte.model';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-soporte',
  standalone: true,
  imports: [CommonModule, FormsModule, Nav, Footer],
  templateUrl: './soporte.html',
  styleUrls: ['./soporte.css']
})
export class Soporte implements OnInit, OnDestroy {
  tickets: TicketSoporte[] = [];
  ticketSeleccionado: TicketDetalle | null = null;
  
  mostrarCrear = false;
  respuestaTexto = '';
  tituloNuevo = '';
  descripcionNueva = '';
  prioridadNueva = 'MEDIA';
  
  cargando = false;
  creando = false;
  enviandoRespuesta = false;
  
  toastNotificacion: NotificacionSoporte | null = null;
  private timeoutToast: any;

  private subscriptions: Subscription[] = [];

  constructor(
    private soporteService: SoporteService,
    private wsService: SoporteWebSocketService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarTickets();
    this.conectarWebSocket();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.wsService.disconnect();
    if (this.timeoutToast) {
      clearTimeout(this.timeoutToast);
    }
  }

  conectarWebSocket(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.wsService.connectUser(userId);
      
      const subNotif = this.wsService.notifications$.subscribe(notif => {
        this.mostrarToast(notif);
        this.cargarTickets();
        this.cdr.detectChanges();
      });
      this.subscriptions.push(subNotif);
    }
  }

  mostrarToast(notif: NotificacionSoporte): void {
    this.toastNotificacion = notif;
    if (this.timeoutToast) {
      clearTimeout(this.timeoutToast);
    }
    this.timeoutToast = setTimeout(() => {
      this.toastNotificacion = null;
      this.cdr.detectChanges();
    }, 5000);
  }

  cerrarToast(): void {
    this.toastNotificacion = null;
    if (this.timeoutToast) {
      clearTimeout(this.timeoutToast);
    }
  }

  cargarTickets(): void {
    this.cargando = true;
    this.soporteService.misTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  crearTicket(): void {
    if (!this.tituloNuevo.trim() || !this.descripcionNueva.trim()) {
      return;
    }

    this.creando = true;
    this.soporteService.crearTicket({
      titulo: this.tituloNuevo.trim(),
      descripcion: this.descripcionNueva.trim(),
      prioridad: this.prioridadNueva
    }).subscribe({
      next: () => {
        this.tituloNuevo = '';
        this.descripcionNueva = '';
        this.prioridadNueva = 'MEDIA';
        this.mostrarCrear = false;
        this.creando = false;
        this.cargarTickets();
        this.cdr.detectChanges();
      },
      error: () => {
        this.creando = false;
        this.cdr.detectChanges();
      }
    });
  }

  seleccionarTicket(ticket: TicketSoporte): void {
    this.soporteService.verMiTicket(ticket.id).subscribe({
      next: (detalle) => {
        this.ticketSeleccionado = detalle;
        this.cdr.detectChanges();
      }
    });
  }

  cerrarDetalle(): void {
    this.ticketSeleccionado = null;
    this.respuestaTexto = '';
  }

  enviarRespuesta(): void {
    if (!this.respuestaTexto.trim() || !this.ticketSeleccionado) return;

    this.enviandoRespuesta = true;
    this.soporteService.responderMiTicket(
      this.ticketSeleccionado.id,
      this.respuestaTexto.trim()
    ).subscribe({
      next: () => {
        this.seleccionarTicket({ ...this.ticketSeleccionado!, id: this.ticketSeleccionado!.id } as TicketSoporte);
        this.respuestaTexto = '';
        this.enviandoRespuesta = false;
        this.cargarTickets();
        this.cdr.detectChanges();
      },
      error: () => {
        this.enviandoRespuesta = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getClasePrioridad(prioridad: string): string {
    return `prioridad-${prioridad.toLowerCase()}`;
  }

  getClaseEstado(estado: string): string {
    return `estado-${estado.toLowerCase()}`;
  }
}
