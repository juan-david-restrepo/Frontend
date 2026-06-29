import * as AOS from 'aos';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import { interval, Subject, Subscription } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { NoticiasComponent } from '../noticias/noticias';
import { AuthService } from '../../service/auth.service';

type ModuleKey = 'subir-reporte' | 'consulta-multas' | 'pico-placa' | 'parking';

interface Module {
  title: string;
  description: string;
  image?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Nav, Footer, RouterModule, NoticiasComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();

  /* ------------------------------------------
     Modal de módulos
  ------------------------------------------- */
  isModalOpen = false;
  isLoggedIn = false;
  selectedModule: Module | null = null;

  modulesData: Record<ModuleKey, Module> = {
    'subir-reporte': {
      title: 'Reporta una Foto Multa',
      description:
        'Sube evidencias de infracciones y contribuye a mejorar la movilidad en tu ciudad.',
      image: 'https://res.cloudinary.com/dcmdvvxv5/image/upload/v1782695880/foto_multaslegales_carroya_pj4ilo.webp',
    },
    'consulta-multas': {
      title: 'Consulta tus Multas',
      description:
        'Revisa fácilmente el estado de tus infracciones de tránsito.',
      image: 'https://res.cloudinary.com/dcmdvvxv5/image/upload/v1782695914/multas-de-transito_avvwi8.webp',
    },
    'pico-placa': {
      title: 'Consulta del Pico y Placa',
      description:
        'Conoce las restricciones vehiculares vigentes para tu zona.',
      image: 'assets/images/Captura de pantalla 2025-11-13 195849.png',
    },
    parking: {
      title: 'Localización de Parqueaderos',
      description:
        'Encuentra los parqueaderos más cercanos y sus horarios de atención.',
      image: 'assets/images/120180114105953.jpg',
    },
  };

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  openModal(moduleKey: ModuleKey) {
    if (!this.isLoggedIn) {
      this.selectedModule = this.modulesData[moduleKey];
      this.isModalOpen = true;
    } else {
      this.router.navigate([`/${moduleKey}`]);
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  /* ------------------------------------------
     Carrusel de SECCIONES (información inferior)
  ------------------------------------------- */

  sections: string[] = [
    'infracciones',
    'informacionVial',
    'integracion',
    'notificaciones',
  ];

  selectedSection = this.sections[0];
  currentIndex = 0;

  private sectionTimer?: Subscription;
  private readonly SECTION_INTERVAL = 5000;

  startCarousel() {
    this.sectionTimer = interval(this.SECTION_INTERVAL).subscribe(() => {
      this.nextSection();
    });
  }

  stopCarousel() {
    this.sectionTimer?.unsubscribe();
  }

  nextSection() {
    this.currentIndex = (this.currentIndex + 1) % this.sections.length;
    this.selectedSection = this.sections[this.currentIndex];
  }

  selectSection(section: string) {
    this.selectedSection = section;
    this.currentIndex = this.sections.indexOf(section);
  }

  getSectionIcon(section: string): string {
    const icons: Record<string, string> = {
      'infracciones': 'fa-clipboard-list',
      'informacionVial': 'fa-road',
      'integracion': 'fa-handshake',
      'notificaciones': 'fa-bell'
    };
    return icons[section] || 'fa-circle';
  }

  getSectionTitle(section: string): string {
    const titles: Record<string, string> = {
      'infracciones': 'Registro de Infracciones',
      'informacionVial': 'Información Vial',
      'integracion': 'Integración con Autoridades',
      'notificaciones': 'Notificaciones en Tiempo Real'
    };
    return titles[section] || section;
  }

  getSectionDescription(section: string): string {
    const descriptions: Record<string, string> = {
      'infracciones': 'Captura y gestión eficiente de infracciones vehiculares.',
      'informacionVial': 'Estado de vías, cierres y normativas de tránsito.',
      'integracion': 'Conexión directa con organismos de tránsito.',
      'notificaciones': 'Alertas instantáneas sobre novedades viales.'
    };
    return descriptions[section] || '';
  }

  /* ------------------------------------------
     Carrusel del HEADER (principal)
  ------------------------------------------- */

  headerIndex = 0;

  headerSlides = [
    {
      image: 'https://res.cloudinary.com/dcmdvvxv5/image/upload/v1782695567/principal_yppt4q.png',
      text: `"La seguridad vial empieza contigo.<br>
              Reporta, participa, mejora tu ciudad."`,
      buttonText: 'SUBIR REPORTE',
      buttonLink: '/subir-reporte',
    },
    {
      image: 'https://res.cloudinary.com/dcmdvvxv5/image/upload/v1782695621/secundario_gpajzn.png',
      text: `"Reporta infracciones fácilmente.<br>
              Solo sube una foto o video."`,
      buttonText: 'REPORTES PÚBLICOS',
      buttonLink: '/reportes-publicos',
    },
    {
      image: 'https://res.cloudinary.com/dcmdvvxv5/image/upload/v1782695588/Armenia_rmu7c8.webp',
      text: `"Mejora tu ciudad.<br>
              Cada reporte cuenta."`,
      buttonText: 'MIS REPORTES',
      buttonLink: '/mis-reportes',
    },
    {
      image: 'https://res.cloudinary.com/dcmdvvxv5/image/upload/v1782697718/se%C3%B1ales-de-transito_h1si4p.webp',
      text: `"Aprende las señales de tránsito.<br>
              Conduce con seguridad y conocimiento."`,
      buttonText: 'VER SEÑALES',
      buttonLink: '/senales',
    },
    {
      image: 'https://res.cloudinary.com/dcmdvvxv5/image/upload/v1782697830/hq720_ahso2e.jpg',
      text: `"Mantente informado.<br>
              Noticias de tránsito del Quindío."`,
      buttonText: 'VER NOTICIAS',
      buttonLink: '/noticias',
    },
  ];

  private headerTimer?: Subscription;
  private readonly HEADER_INTERVAL = 10000;

  nextSlide() {
    this.headerIndex = (this.headerIndex + 1) % this.headerSlides.length;
  }

  prevSlide() {
    this.headerIndex =
      (this.headerIndex - 1 + this.headerSlides.length) %
      this.headerSlides.length;
  }

  startHeaderCarousel() {
    this.headerTimer = interval(this.HEADER_INTERVAL).subscribe(() => {
      this.nextSlide();
    });
  }

  stopHeaderCarousel() {
    this.headerTimer?.unsubscribe();
  }

  /* ------------------------------------------
     Ciclo de vida Angular
  ------------------------------------------- */

  ngOnInit() {
    // Redirigir al panel correspondiente si ya hay sesión activa
    this.authService.loading$.pipe(
      filter(loading => !loading),
      take(1),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      const role = this.authService.getUserRole();
      if (role === 'ADMIN') {
        this.router.navigate(['/admin']);
        return;
      }
      if (role === 'AGENTE') {
        this.router.navigate(['/agente']);
        return;
      }
    });

    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => { this.isLoggedIn = state; });
    this.startCarousel();
    this.startHeaderCarousel();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopCarousel();
    this.stopHeaderCarousel();
  }

  ngAfterViewInit() {
    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach((acc) => {
      acc.addEventListener('click', () => {
        const isActive = acc.classList.contains('active');

        // Cerrar todos
        accordions.forEach((a) => a.classList.remove('active'));

        // Abrir el seleccionado
        if (!isActive) acc.classList.add('active');
      });
    });

    AOS.init({
      duration: 1100, // duración de la animación
      once: true, // solo animar la primera vez
    });

    // Opcional: recalcular si hay contenido dinámico
    AOS.refresh();
  }
}
