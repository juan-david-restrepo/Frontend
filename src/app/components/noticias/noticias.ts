import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticiasService, Noticia } from './noticias.service';
import { SanitizeHtmlPipe } from '../../shared/sanitize-html.pipe';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, SanitizeHtmlPipe],
  templateUrl: './noticias.html',
  styleUrls: ['./noticias.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoticiasComponent implements OnInit {

  noticias: Noticia[] = [];
  noticiaSeleccionada: Noticia | null = null;
  paginaActual = 1;
  cargando = false;

  startMap: Record<number, number> = {
    1: 0,
    2: 12,
    3: 24,
    4: 36,
    5: 48
  };

  constructor(
    private noticiasService: NoticiasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarNoticias(1);
  }

  trackByIndex(index: number): number {
    return index;
  }

  cargarNoticias(pagina: number) {
    this.paginaActual = pagina;
    const start = this.startMap[pagina] ?? 0;
    this.cargando = true;
    this.cdr.markForCheck();

    this.noticiasService.obtenerNoticias(start, pagina)
      .subscribe(data => {
        this.noticias = data;
        this.cargando = false;
        this.cdr.markForCheck();
      });

    this.precargarSiguiente(pagina);
  }

  private precargarSiguiente(pagina: number) {
    const siguiente = pagina + 1;
    if (siguiente <= 5) {
      const start = this.startMap[siguiente];
      this.noticiasService.obtenerNoticias(start, siguiente).subscribe();
    }
  }

  siguiente() {
    if (this.paginaActual < 5) this.cargarNoticias(this.paginaActual + 1);
  }

  anterior() {
    if (this.paginaActual > 1) this.cargarNoticias(this.paginaActual - 1);
  }

  verDetalle(index: number) {
    this.noticiaSeleccionada = this.noticias[index];
  }

  volver() {
    this.noticiaSeleccionada = null;
  }
}
