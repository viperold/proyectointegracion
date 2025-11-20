// Componente de Registro
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Disciplina } from '../../../core/models/models';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card card">
        <h2>Registro</h2>
        <p class="subtitle">Crea tu cuenta en la red de colaboración estudiantil</p>

        @if (errorMessage) {
          <div class="alert alert-error">{{ errorMessage }}</div>
        }

        @if (successMessage) {
          <div class="alert alert-success">{{ successMessage }}</div>
        }

        <form (ngSubmit)="onSubmit()" #registroForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Nombre *</label>
              <input
                type="text"
                class="form-control"
                [(ngModel)]="formData.nombre"
                name="nombre"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Apellido *</label>
              <input
                type="text"
                class="form-control"
                [(ngModel)]="formData.apellido"
                name="apellido"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Correo Electrónico *</label>
            <input
              type="email"
              class="form-control"
              [(ngModel)]="formData.email"
              name="email"
              required
              email
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Contraseña *</label>
              <input
                type="password"
                class="form-control"
                [(ngModel)]="formData.password"
                name="password"
                required
                minlength="8"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Confirmar Contraseña *</label>
              <input
                type="password"
                class="form-control"
                [(ngModel)]="formData.password2"
                name="password2"
                required
                minlength="8"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Carrera *</label>
            <input
              type="text"
              class="form-control"
              [(ngModel)]="formData.carrera"
              name="carrera"
              required
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Disciplina</label>
              <select
                class="form-control"
                [(ngModel)]="formData.disciplina"
                name="disciplina"
              >
                <option [value]="undefined">Seleccionar</option>
                @for (disciplina of disciplinas; track disciplina.id) {
                  <option [value]="disciplina.id">{{ disciplina.nombre }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Semestre *</label>
              <input
                type="number"
                class="form-control"
                [(ngModel)]="formData.semestre"
                name="semestre"
                required
                min="1"
                max="12"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Teléfono</label>
            <input
              type="tel"
              class="form-control"
              [(ngModel)]="formData.telefono"
              name="telefono"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-block"
            [disabled]="!registroForm.valid || isLoading"
          >
            {{ isLoading ? 'Registrando...' : 'Registrarse' }}
          </button>
        </form>

        <p class="text-center mt-3">
          ¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión aquí</a>
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
      max-width: 600px;
      width: 100%;
    }

    .subtitle {
      color: var(--text-light);
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
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

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegistroComponent implements OnInit {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  formData = {
    email: '',
    password: '',
    password2: '',
    nombre: '',
    apellido: '',
    telefono: '',
    carrera: '',
    disciplina: undefined as number | undefined,
    semestre: 1,
    bio: ''
  };

  disciplinas: Disciplina[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit() {
    this.usuarioService.getDisciplinas().subscribe({
      next: (disciplinas) => this.disciplinas = disciplinas,
      error: (error) => console.error('Error al cargar disciplinas:', error)
    });
  }

  onSubmit() {
  // Reset de mensajes
  this.errorMessage = '';
  this.successMessage = '';

  // 1. Validación de contraseñas
  if (this.formData.password !== this.formData.password2) {
    this.errorMessage = 'Las contraseñas no coinciden';
    return;
  }

  // 2. Normalizar y validar el correo
  const normalizedEmail = this.formData.email.trim().toLowerCase();

  if (!normalizedEmail.endsWith('@inacapmail.cl')) {
    this.errorMessage = 'Solo se permiten correos @inacapmail.cl';
    return;
  }

  this.isLoading = true;

  // 3. Llamar al servicio de autenticación
  this.authService
    .register(normalizedEmail, this.formData.password, {
      nombre: this.formData.nombre,
      apellido: this.formData.apellido,
      carrera: this.formData.carrera,
      semestre: this.formData.semestre,
      telefono: this.formData.telefono,
      bio: this.formData.bio,
      avatar: '',
      habilidades: [],
      email: normalizedEmail,
    })
    .subscribe({
      next: (user) => {
        console.log('Usuario registrado', user);
        this.isLoading = false;
        this.successMessage = 'Registro exitoso. ¡Bienvenido!';
      },
      error: (error) => {
        this.isLoading = false;

        if (error?.message?.includes('Solo se permiten correos')) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage =
            'Ocurrió un error durante el registro. Revisa los datos e inténtalo nuevamente.';
        }

        console.error('Error registro:', error);
      }
    });
}
}
