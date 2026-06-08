import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './password.html',
  styleUrls: ['./password.css'],
})
export class Password implements OnInit, OnDestroy {
  form!: FormGroup;
  token = '';
  loading = false;

  mostrarPassword = false;
  mostrarConfirm = false;

  contador = 15 * 60; // 15 minutos
  contadorTexto = '';
  private intervalId!: ReturnType<typeof setInterval>;

  private readonly API_URL = environment.apiBackend + '/api/password/reset';

  // indicadores de validación
  validLength = false;
  validUpper = false;
  validNumber = false;
  validSymbol = false;
  passwordsMatch = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!this.token) {
      Swal.fire({ icon: 'error', title: 'Enlace inválido' })
        .then(() => this.router.navigate(['/login']));
      return;
    }

    this.form = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    });

    // 🔹 Contador regresivo
    this.updateContador();
    this.intervalId = setInterval(() => this.updateContador(), 1000);

    // 🔹 Validación en tiempo real
    this.form.get('password')?.valueChanges.subscribe(val => this.validatePassword(val));
    this.form.get('confirmPassword')?.valueChanges.subscribe(() => this.checkPasswordsMatch());
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  updateContador() {
    if (this.contador <= 0) {
      clearInterval(this.intervalId);
      this.contadorTexto = 'El enlace ha expirado';
      this.form.disable();
      return;
    }
    const min = Math.floor(this.contador / 60);
    const seg = this.contador % 60;
    this.contadorTexto = `${min.toString().padStart(2,'0')}:${seg.toString().padStart(2,'0')}`;
    this.contador--;
  }

  validatePassword(val: string) {
    this.validLength = val.length >= 8;
    this.validUpper = /[A-Z]/.test(val);
    this.validNumber = /\d/.test(val);
    this.validSymbol = /[@$!%*?&]/.test(val);

    this.checkPasswordsMatch();
  }

  checkPasswordsMatch() {
    const pw = this.form.value.password;
    const cpw = this.form.value.confirmPassword;
    this.passwordsMatch = pw && cpw && pw === cpw;
  }

  togglePassword(field: 'password' | 'confirmPassword') {
    field === 'password' ? this.mostrarPassword = !this.mostrarPassword
                          : this.mostrarConfirm = !this.mostrarConfirm;
  }

  onSubmit(): void {
    if (this.form.invalid || !this.validLength || !this.validUpper || !this.validNumber || !this.validSymbol || !this.passwordsMatch) {
      Swal.fire({
        icon: 'warning',
        title: 'Contraseña inválida',
        text: 'Revisa que cumpla todos los requisitos y que ambas contraseñas coincidan.'
      });
      return;
    }

    this.loading = true;

    this.http.post(this.API_URL, { token: this.token, newPassword: this.form.value.password }, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Contraseña actualizada correctamente'
          }).then(() => this.router.navigate(['/login']));
          this.form.reset();
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          const esExpirado = err.status === 400 || err.status === 404;
          Swal.fire({
            icon: 'error',
            title: esExpirado ? 'Enlace expirado o inválido' : 'No se pudo cambiar la contraseña',
            text: esExpirado
              ? 'El enlace para restablecer tu contraseña ya no es válido. Solicita uno nuevo desde la página de recuperación.'
              : 'Ocurrió un problema al guardar tu nueva contraseña. Verifica tu conexión e intenta de nuevo.'
          });
          console.error('Error al resetear contraseña:', err);
        }
      });
  }
}