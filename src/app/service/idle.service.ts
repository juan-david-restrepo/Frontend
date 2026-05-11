import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdleService {

  private timeoutId: any;
  private cleanupFns: (() => void)[] = [];

  private readonly IDLE_TIME = 10 * 60 * 1000;

  startWatching(onIdle: () => void) {
    this.stopWatching();
    this.resetTimer(onIdle);

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => {
      const handler = () => this.resetTimer(onIdle);
      window.addEventListener(event, handler, { passive: true });
      this.cleanupFns.push(() => window.removeEventListener(event, handler));
    });
  }

  resetIdle(onIdle: () => void) {
    this.resetTimer(onIdle);
  }

  stopWatching() {
    clearTimeout(this.timeoutId);
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];
  }

  private resetTimer(onIdle: () => void) {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => onIdle(), this.IDLE_TIME);
  }
}
