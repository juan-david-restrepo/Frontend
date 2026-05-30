import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true
})
export class SafeUrlPipe implements PipeTransform {
  private readonly ALLOWED_PROTOCOLS = ['https:', 'http:'];

  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    try {
      const parsed = new URL(url);
      if (!this.ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
        return '';
      }
    } catch {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
