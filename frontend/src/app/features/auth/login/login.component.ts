// Componente de Login
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card card">
        <h2>Iniciar Sesión</h2>
        <p class="subtitle">Accede a tu cuenta de INACAP Valdivia</p>

        @if (errorMessage) {
          <div class="alert alert-error">{{ errorMessage }}</div>
        }

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label class="form-label">Correo Electrónico</label>
            <input
              type="email"
              class="form-control"
              [(ngModel)]="credentials.email"
              name="email"
              required
              email
              placeholder="tu.correo@inacapmail.cl"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <input
              type="password"
              class="form-control"
              [(ngModel)]="credentials.password"
              name="password"
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-block"
            [disabled]="!loginForm.valid || isLoading"
          >
            {{ isLoading ? 'Ingresando...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <p class="text-center mt-3">
          ¿No tienes cuenta? <a routerLink="/registro">Regístrate aquí</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      padding: 2rem 1rem;
    }

    .auth-card {
      max-width: 400px;
      width: 100%;
    }

    .subtitle {
      color: var(--text-light);
      margin-bottom: 1.5rem;
    }

    .btn-block {
      width: 100%;
      margin-top: 1rem;
    }

    .text-center {
      text-align: center;
    }

    .mt-3 {
      margin-top: 1.5rem;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = {
    email: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';

  onSubmit() {
  this.isLoading = true;
  this.errorMessage = '';

  this.authService
    .login(this.credentials.email, this.credentials.password)
    .subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/proyectos']);
      },
      error: (error) => {
        this.isLoading = false;

        if (error?.message?.includes('Solo se permiten correos')) {
          this.errorMessage = error.message; // Mensaje específico dominio
        } else {
          this.errorMessage =
            'Credenciales inválidas. Por favor, revisa tu correo y contraseña e intenta de nuevo.';
        }

        console.error('Error de login:', error);
      },
    });
}
}
