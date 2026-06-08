import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IdleService } from './service/idle.service';
import { AuthService } from './service/auth.service';
import { CommonModule } from '@angular/common';
import { FloatingActionsComponent } from './shared/floating-actions/floating-actions';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { PwaInstallComponent } from './shared/pwa-install/pwa-install';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FloatingActionsComponent, SplashScreenComponent, PwaInstallComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('y');

  showIdleModal = false;
  showSplash = false;
  countdown = 60;

  private countdownInterval: any;
  private splashCompleteHandler = this.onSplashComplete.bind(this);

  constructor(
    private idleService: IdleService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.idleService.startWatching(() => {
      // Solo mostrar el modal si hay sesión activa
      if (this.authService.getUserId()) {
        this.abrirModalInactividad();
      }
    });

    const splashStatus = sessionStorage.getItem('splashShown');
    if (splashStatus !== 'true') {
      this.showSplash = true;
      window.addEventListener('splashComplete', this.splashCompleteHandler);
    }
  }

  ngOnDestroy() {
    window.removeEventListener('splashComplete', this.splashCompleteHandler);
    this.limpiarCountdown();
    this.idleService.stopWatching();
  }

  private abrirModalInactividad() {
    this.showIdleModal = true;
    this.countdown = 60;
    this.limpiarCountdown();

    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.cerrarSesion();
      }
    }, 1000);
  }

  continuarSesion() {
    this.limpiarCountdown();
    this.showIdleModal = false;

    // Verificar que el token sigue válido antes de continuar
    this.authService.refreshUser().subscribe({
      next: (user) => {
        if (!user) {
          this.router.navigate(['/login']);
        } else {
          // Reiniciar el watcher con la misma lógica
          this.idleService.startWatching(() => {
            if (this.authService.getUserId()) {
              this.abrirModalInactividad();
            }
          });
        }
      },
      error: () => this.router.navigate(['/login'])
    });
  }

  cerrarSesion() {
    this.limpiarCountdown();
    this.showIdleModal = false;

    this.authService.logout().subscribe({
      complete: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }

  private limpiarCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  private onSplashComplete() {
    this.showSplash = false;
    sessionStorage.setItem('splashShown', 'true');
  }
}
