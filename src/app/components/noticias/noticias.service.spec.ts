import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoticiasService, Noticia } from './noticias.service';
import { environment } from '../../../environments/environment';

describe('NoticiasService', () => {
  let service: NoticiasService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NoticiasService]
    });
    service = TestBed.inject(NoticiasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch noticias and cache them', () => {
    const mockNoticias: Noticia[] = [
      { titulo: 'Noticia 1', imagen: 'img1.jpg', fecha: '2024-01-01', contenido: 'Contenido 1' },
      { titulo: 'Noticia 2', imagen: 'img2.jpg', fecha: '2024-01-02', contenido: 'Contenido 2' }
    ];

    // First call should hit the API
    let firstResult: Noticia[] = [];
    service.obtenerNoticias(0, 1).subscribe(data => { firstResult = data; });

    const req = httpMock.expectOne(`${environment.apiNoticias}/api/noticias?start=0`);
    expect(req.request.method).toBe('GET');
    req.flush(mockNoticias);

    expect(firstResult).toEqual(mockNoticias);

    // Second call for the same page should return cached data (no HTTP request)
    let secondResult: Noticia[] = [];
    service.obtenerNoticias(0, 1).subscribe(data => { secondResult = data; });

    httpMock.expectNone(`${environment.apiNoticias}/api/noticias?start=0`);
    expect(secondResult).toEqual(mockNoticias);
  });

  it('should handle error when API fails', () => {
    let result: Noticia[] = [];
    service.obtenerNoticias(5, 2).subscribe(data => { result = data; });

    const req = httpMock.expectOne(`${environment.apiNoticias}/api/noticias?start=5`);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(result).toEqual([]);
  });

  it('should fetch noticia detalle', () => {
    const mockDetalle: Noticia = {
      titulo: 'Detalle Noticia',
      imagen: 'detalle.jpg',
      fecha: '2024-03-15',
      contenido: 'Contenido detallado de la noticia'
    };

    let result: Noticia | undefined;
    service.obtenerDetalle('mi-noticia-ejemplo').subscribe(data => { result = data; });

    const expectedUrl = `${environment.apiNoticias}/api/noticia-detalle?url=${encodeURIComponent('mi-noticia-ejemplo')}`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockDetalle);

    expect(result).toEqual(mockDetalle);
  });
});
