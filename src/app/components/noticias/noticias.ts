import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NoticiasService, Noticia } from './noticias.service';
import { SanitizeHtmlPipe } from '../../shared/sanitize-html.pipe';
import { Nav } from '../../shared/nav/nav';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, RouterModule, SanitizeHtmlPipe, Nav],
  templateUrl: './noticias.html',
  styleUrls: ['./noticias.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoticiasComponent implements OnInit, OnDestroy {

  @Input() modoPreview = false;

  noticias: Noticia[] = [];
  noticiaSeleccionada: Noticia | null = null;
  paginaActual = 1;
  cargando = false;
  hayError = false;
  intentoActual = 0;
  readonly maxIntentos = 3;

  private retryTimer?: ReturnType<typeof setTimeout>;
  private pendingStart = 0;
  private pendingPagina = 1;

  startMap: Record<number, number> = {
    1: 0, 2: 12, 3: 24, 4: 36, 5: 48
  };

  constructor(
    private noticiasService: NoticiasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarNoticias(1);
  }

  ngOnDestroy() {
    clearTimeout(this.retryTimer);
  }

  trackByIndex(index: number): number {
    return index;
  }

  get noticiasMostradas(): Noticia[] {
    return this.modoPreview ? this.noticias.slice(0, 4) : this.noticias;
  }

  get skeletonItems(): number[] {
    return this.modoPreview ? [1, 2, 3, 4] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  }

  get mensajeEspera(): string {
    if (this.intentoActual === 1) return 'El servidor está despertando, esto puede tardar unos segundos...';
    return `Reintentando... (${this.intentoActual} de ${this.maxIntentos})`;
  }

  cargarNoticias(pagina: number) {
    clearTimeout(this.retryTimer);
    this.paginaActual = pagina;
    this.pendingStart = this.startMap[pagina] ?? 0;
    this.pendingPagina = pagina;
    this.cargando = true;
    this.hayError = false;
    this.intentoActual = 0;
    this.cdr.markForCheck();
    this.intentarCarga();
  }

  private intentarCarga() {
    this.intentoActual++;
    this.cdr.markForCheck();

    this.noticiasService.obtenerNoticias(this.pendingStart, this.pendingPagina).subscribe({
      next: (data) => {
        this.noticias = data;
        this.cargando = false;
        this.hayError = false;
        if (!this.modoPreview) this.precargarSiguiente(this.pendingPagina);
        this.cdr.markForCheck();
      },
      error: () => {
        if (this.intentoActual < this.maxIntentos) {
          this.retryTimer = setTimeout(() => {
            this.intentarCarga();
          }, 8000);
          this.cdr.markForCheck();
        } else {
          this.cargando = false;
          this.hayError = true;
          this.cdr.markForCheck();
        }
      }
    });
  }

  reintentar() {
    this.cargarNoticias(this.paginaActual);
  }

  private precargarSiguiente(pagina: number) {
    const siguiente = pagina + 1;
    if (siguiente <= 5) {
      const start = this.startMap[siguiente];
      this.noticiasService.obtenerNoticias(start, siguiente).subscribe({ error: () => {} });
    }
  }

  siguiente() {
    if (this.paginaActual < 5) this.cargarNoticias(this.paginaActual + 1);
  }

  anterior() {
    if (this.paginaActual > 1) this.cargarNoticias(this.paginaActual - 1);
  }

  verDetalle(index: number) {
    this.noticiaSeleccionada = this.noticiasMostradas[index];
    if (!this.modoPreview) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  volver() {
    this.noticiaSeleccionada = null;
  }
}
