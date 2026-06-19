import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, AuthUser } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    // Flush the initial refreshUser() call from constructor
    const req = httpMock.expectOne(`${environment.apiBackend}/api/auth/me`);
    req.flush(null, { status: 401, statusText: 'Unauthorized' });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and update auth state', () => {
    const mockUser: AuthUser = { userId: '123', email: 'test@test.com', role: 'user' };

    service.login('test@test.com', 'password').subscribe();

    const loginReq = httpMock.expectOne(`${environment.apiBackend}/api/auth/login`);
    expect(loginReq.request.method).toBe('POST');
    expect(loginReq.request.body).toEqual({ email: 'test@test.com', password: 'password' });
    expect(loginReq.request.withCredentials).toBeTrue();
    loginReq.flush({});

    // login triggers refreshUser internally
    const meReq = httpMock.expectOne(`${environment.apiBackend}/api/auth/me`);
    expect(meReq.request.method).toBe('GET');
    meReq.flush(mockUser);

    expect(service.getUserId()).toBe('123');
    expect(service.getUserRole()).toBe('user');
  });

  it('should logout and clear auth state', () => {
    service.setCurrentUser({ userId: '123', email: 'test@test.com', role: 'user' });
    service.setAuthenticated(true);

    service.logout().subscribe();

    const req = httpMock.expectOne(`${environment.apiBackend}/api/auth/logout`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBeTrue();
    req.flush({});

    expect(service.getUserId()).toBeNull();
    expect(service.getUserRole()).toBeNull();
  });

  it('should refresh user from backend', () => {
    const mockUser: AuthUser = { userId: '456', email: 'refresh@test.com', role: 'admin' };

    let result: AuthUser | null = null;
    service.refreshUser().subscribe(user => { result = user; });

    const req = httpMock.expectOne(`${environment.apiBackend}/api/auth/me`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockUser);

    expect(result).toEqual(mockUser);
    expect(service.getUserId()).toBe('456');
    expect(service.getUserRole()).toBe('admin');
  });

  it('should handle login error', () => {
    let errorResponse: any;

    service.login('bad@test.com', 'wrong').subscribe({
      error: err => { errorResponse = err; }
    });

    const req = httpMock.expectOne(`${environment.apiBackend}/api/auth/login`);
    req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(errorResponse).toBeDefined();
    expect(service.getUserId()).toBeNull();
  });
});
