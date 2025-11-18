// Componente de perfil (actualizado y corregido completamente)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/models/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="perfil-bg">
      <div class="perfil-container" *ngIf="user$ | async as user">
        <h1 class="perfil-title">Mi Perfil</h1>
        <div class="perfil-card">
          <div class="avatar-wrapper">
            <img *ngIf="user.avatar" [src]="user.avatar" alt="Avatar" class="avatar" />
            <div *ngIf="!user.avatar" class="avatar-placeholder">
              <span>{{ (user.nombre || 'U')[0] }}{{ (user.apellido || 'S')[0] }}</span>
            </div>
          </div>
          <div *ngIf="!editMode" class="perfil-info">
            <div class="perfil-row"><span class="label">Nombre:</span> <span>{{ user.nombre }} {{ user.apellido }}</span></div>
            <div class="perfil-row"><span class="label">Email:</span> <span>{{ user.email }}</span></div>
            <div class="perfil-row"><span class="label">Carrera:</span> <span>{{ user.carrera }}</span></div>
            <div class="perfil-row"><span class="label">Semestre:</span> <span>{{ user.semestre }}</span></div>
            <div class="perfil-row"><span class="label">Teléfono:</span> <span>{{ user.telefono || '-' }}</span></div>
            <div class="perfil-row"><span class="label">Bio:</span> <span>{{ user.bio || '-' }}</span></div>
            <button class="btn-edit" (click)="editMode = true">Editar</button>
          </div>
          <form *ngIf="editMode" (ngSubmit)="guardarCambios()" class="perfil-form">
            <div class="perfil-row"><label>Nombre: <input [(ngModel)]="form.nombre" name="nombre" /></label></div>
            <div class="perfil-row"><label>Apellido: <input [(ngModel)]="form.apellido" name="apellido" /></label></div>
            <div class="perfil-row"><label>Carrera: <input [(ngModel)]="form.carrera" name="carrera" /></label></div>
            <div class="perfil-row">
              <label>Semestre:
                <input type="number" [(ngModel)]="form.semestre" name="semestre" [class.input-error]="!semestreValido()" min="1" max="10" />
              </label>
              <span *ngIf="!semestreValido()" class="error-msg">El semestre debe estar entre 1 y 10</span>
            </div>
            <div class="perfil-row">
              <label>Teléfono:
                <input [(ngModel)]="form.telefono" name="telefono" [class.input-error]="!telefonoValido()" placeholder="+569XXXXXXXX" />
              </label>
              <span *ngIf="!telefonoValido() && form.telefono" class="error-msg">Debe ser un número chileno (+569XXXXXXXX)</span>
            </div>
            <div class="perfil-row"><label>Bio: <textarea [(ngModel)]="form.bio" name="bio"></textarea></label></div>
            <div class="perfil-row">
              <label>Avatar:
                <input type="file" (change)="onAvatarChange($event)" accept="image/*" />
              </label>
              <span *ngIf="avatarPreview" class="avatar-preview">
                <img [src]="avatarPreview" alt="Preview" style="width:60px;height:60px;border-radius:50%;margin-left:10px;object-fit:cover;" />
              </span>
            </div>
            <div class="perfil-form-actions">
              <button class="btn-save" type="submit">Guardar</button>
              <button class="btn-cancel" type="button" (click)="cancelarEdicion()">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
      <div *ngIf="!(user$ | async)" class="perfil-loading">
        <p>Cargando perfil...</p>
      </div>
    </div>
  `,
  styles: [`
    .perfil-bg {
      min-height: 100vh;
      background: #f6f7f9;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 40px;
    }
    .perfil-container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    .perfil-title {
      text-align: left;
      font-size: 2.5rem;
      font-weight: 700;
      color: #222;
      margin-bottom: 2rem;
      letter-spacing: 1px;
    }
    .perfil-card {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 24px #0001;
      padding: 2.5rem 3rem 2rem 3rem;
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 2.5rem;
      align-items: flex-start;
      min-width: 600px;
    }
    .avatar-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      height: 220px;
    }
    .avatar {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      object-fit: cover;
      border: 6px solid #e41c1c;
      background: #fff;
      box-shadow: 0 4px 24px #0002;
      transition: box-shadow 0.2s;
    }
    .avatar-placeholder {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background: #e41c1c;
      color: #fff;
      font-size: 4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      box-shadow: 0 4px 24px #0002;
      transition: box-shadow 0.2s;
    }
    .perfil-info {
      width: 100%;
      font-size: 1.15rem;
      color: #222;
      margin-top: 0.5rem;
    }
    .perfil-row {
      display: flex;
      align-items: center;
      margin-bottom: 1.2rem;
      gap: 0.5rem;
    }
    .label {
      font-weight: 600;
      color: #e41c1c;
      min-width: 110px;
      display: inline-block;
    }
    .perfil-form {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      margin-top: 0.5rem;
    }
    .perfil-form input,
    .perfil-form textarea {
      width: 100%;
      padding: 0.7rem;
      border-radius: 6px;
      border: 1.5px solid #ddd;
      font-size: 1.1rem;
      margin-top: 0.2rem;
      background: #f6f7f9;
      transition: border 0.2s;
    }
    .perfil-form input:focus,
    .perfil-form textarea:focus {
      border: 2px solid #e41c1c;
      outline: none;
    }
    .perfil-form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1rem;
    }
    .btn-edit, .btn-save, .btn-cancel {
      padding: 0.7rem 1.5rem;
      border-radius: 6px;
      border: none;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-edit {
      background: #e41c1c;
      color: #fff;
      margin-top: 1rem;
    }
    .btn-edit:hover {
      background: #b31212;
    }
    .btn-save {
      background: #e41c1c;
      color: #fff;
    }
    .btn-save:hover {
      background: #b31212;
    }
    .btn-cancel {
      background: #eee;
      color: #e41c1c;
      border: 1px solid #e41c1c;
    }
    .input-error {
      border: 2px solid #e41c1c !important;
      background: #fff0f0;
    }
    .error-msg {
      color: #e41c1c;
      font-size: 0.95rem;
      margin-left: 10px;
      font-weight: 500;
    }
    .avatar-preview img {
      border: 2px solid #e41c1c;
      box-shadow: 0 2px 8px #e41c1c44;
    }
    .perfil-loading {
      text-align: center;
      color: #888;
      font-size: 1.2rem;
      margin-top: 3rem;
    }
    @media (max-width: 900px) {
      .perfil-card {
        grid-template-columns: 1fr;
        min-width: 0;
        padding: 1.2rem 0.5rem;
      }
      .avatar-wrapper {
        height: 120px;
      }
      .avatar, .avatar-placeholder {
        width: 100px;
        height: 100px;
        font-size: 2rem;
      }
    }
  `]
})
export class PerfilComponent {
  user$: Observable<Usuario | null>;
  editMode = false;
  form: Partial<Usuario> = {};
  avatarPreview: string | undefined = undefined;

  constructor(private auth: AuthService) {
    this.user$ = this.auth.getCurrentUser$().pipe(
      map(fbUser => {
        if (!fbUser) return null;

        const displayName = fbUser.displayName ?? '';
        const [nombre, ...resto] = displayName.split(' ').filter(Boolean);
        const apellido = resto.join(' ');

        const usuarioAdaptado: Usuario = {
          id: 0,
          nombre: nombre || '',
          apellido: apellido || '',
          email: fbUser.email ?? '',
          carrera: '',
          semestre: 1,
          telefono: '',
          bio: '',
          avatar: fbUser.photoURL ?? '',
          habilidades: [], // nuevo campo
          date_joined: new Date().toISOString(),
          is_active: true
        };

        return usuarioAdaptado;
      })
    );
  }

  iniciarEdicion(user: Usuario) {
    this.form = { ...user };
    this.editMode = true;
  }

  semestreValido(): boolean {
    return typeof this.form.semestre === 'number' && this.form.semestre >= 1 && this.form.semestre <= 10;
  }

  telefonoValido(): boolean {
    if (!this.form.telefono) return true;
    return /^\+569\d{8}$/.test(this.form.telefono);
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview = e.target.result as string;
        this.form.avatar = this.avatarPreview;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarCambios() {
    if (!this.semestreValido()) {
      alert('El semestre debe ser mayor a 0');
      return;
    }
    if (!this.telefonoValido()) {
      alert('El teléfono debe ser chileno (+569XXXXXXXX)');
      return;
    }

    this.auth.updateProfile({
      displayName: `${this.form.nombre ?? ''} ${this.form.apellido ?? ''}`,
      photoURL: this.form.avatar
    }).subscribe({
      next: () => {
        this.editMode = false;
        this.avatarPreview = undefined;
      },
      error: () => {
        alert('Error al guardar cambios');
      }
    });
  }

  cancelarEdicion() {
    this.user$.subscribe(user => {
      if (user) {
        this.form = { ...user };
      }
    }).unsubscribe();
    this.editMode = false;
  }
}
