import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConsultaMultasService, DatosConsulta, ResultadoMultas } from './consulta-multas.service';
import { environment } from '../../environments/environment';

describe('ConsultaMultasService', () => {
  let service: ConsultaMultasService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConsultaMultasService]
    });
    service = TestBed.inject(ConsultaMultasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should consultar multas', () => {
    const mockResultado: ResultadoMultas = {
      success: true,
      multas: [
        { comparendo: '12345', infraccion: 'Exceso de velocidad', estado: 'Pendiente', valorMulta: 500000 }
      ],
      totales: { totalMultas: 1, valorTotal: 500000 },
      tieneDeudas: true
    };
    const datos: DatosConsulta = { tipo: 'documento', tipoDoc: 'CC', valor: '123456789' };

    let result: ResultadoMultas | undefined;
    service.consultarMultas(datos).subscribe(data => { result = data; });

    const req = httpMock.expectOne(`${environment.apiScrappi}/api/consultar`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(datos);
    req.flush(mockResultado);

    expect(result).toEqual(mockResultado);
  });

  it('should generate PDF', () => {
    const mockBlob = new Blob(['%PDF-1.4 mock content'], { type: 'application/pdf' });
    const datos: DatosConsulta = { tipo: 'documento', tipoDoc: 'CC', valor: '123456789' };

    let result: Blob | undefined;
    service.generarPDF('session-abc-123', datos).subscribe(blob => { result = blob; });

    const req = httpMock.expectOne(`${environment.apiScrappi}/api/generar-pdf`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ sessionId: 'session-abc-123' });
    expect(req.request.responseType).toBe('blob');
    req.flush(mockBlob);

    expect(result).toBeDefined();
    expect(result!.type).toBe('application/pdf');
    expect(result!.size).toBeGreaterThan(0);
  });

  it('should generate PDF with datosConsulta when no sessionId', () => {
    const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' });
    const datos: DatosConsulta = { tipo: 'documento', tipoDoc: 'CC', valor: '987654321' };

    service.generarPDF('', datos).subscribe();

    const req = httpMock.expectOne(`${environment.apiScrappi}/api/generar-pdf`);
    expect(req.request.body).toEqual(datos);
    req.flush(mockBlob);
  });

  it('should get API status', () => {
    const mockStatus = { status: 'ok', uptime: 12345, version: '1.0.0' };

    let result: any;
    service.getEstado().subscribe(data => { result = data; });

    const req = httpMock.expectOne(`${environment.apiScrappi}/api/estado`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStatus);

    expect(result).toEqual(mockStatus);
  });

  it('should allow overriding API URL', () => {
    const newUrl = 'https://custom-api.example.com/api';
    service.setApiUrl(newUrl);
    expect(service.getApiUrl()).toBe(newUrl);

    const datos: DatosConsulta = { tipo: 'documento', tipoDoc: 'CC', valor: '111' };
    service.consultarMultas(datos).subscribe();

    const req = httpMock.expectOne(`${newUrl}/consultar`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
