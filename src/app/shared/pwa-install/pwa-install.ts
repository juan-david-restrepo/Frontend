import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pwa-install',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pwa-install.html',
  styleUrl: './pwa-install.css'
})
export class PwaInstallComponent implements OnInit, OnDestroy {
  visible = false;
  esIos = false;
  yaInstalada = false;

  private deferredPrompt: any = null;
  private readonly STORAGE_KEY = 'pwa_install_dismissed';
  private readonly DISMISS_DAYS = 7;

  private promptHandler = (e: Event) => {
    e.preventDefault();
    this.deferredPrompt = e;
    if (!this.fueDesestimadoReciente()) {
      setTimeout(() => this.visible = true, 2500);
    }
  };

  ngOnInit(): void {
    // No mostrar si ya está instalada (modo standalone)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.yaInstalada = true;
      return;
    }

    // Detectar iOS (Safari no soporta beforeinstallprompt)
    const ua = window.navigator.userAgent;
    this.esIos = /iphone|ipad|ipod/i.test(ua) && !(window as any).MSStream;

    if (this.esIos && !this.fueDesestimadoReciente()) {
      setTimeout(() => this.visible = true, 2500);
      return;
    }

    window.addEventListener('beforeinstallprompt', this.promptHandler as EventListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeinstallprompt', this.promptHandler as EventListener);
  }

  async instalar(): Promise<void> {
    if (this.esIos) {
      // En iOS solo podemos mostrar instrucciones
      return;
    }
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    this.visible = false;

    if (outcome === 'accepted') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ ts: Date.now(), accepted: true }));
    }
  }

  desestimar(): void {
    this.visible = false;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ ts: Date.now(), accepted: false }));
  }

  private fueDesestimadoReciente(): boolean {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return false;
    try {
      const { ts, accepted } = JSON.parse(raw);
      if (accepted) return true;
      const dias = (Date.now() - ts) / (1000 * 60 * 60 * 24);
      return dias < this.DISMISS_DAYS;
    } catch {
      return false;
    }
  }
}
