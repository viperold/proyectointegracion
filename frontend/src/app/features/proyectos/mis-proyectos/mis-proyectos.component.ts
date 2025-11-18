// Componente de mis proyectos (corregido y funcional con Firebase Auth)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { Proyecto } from '../../../core/models/models';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-mis-proyectos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>Mis Proyectos</h1>
      <div class="filtros-bar">
        <input type="text" [(ngModel)]="busqueda" (input)="filtrarProyectos()" placeholder="Buscar por nombre..." class="busqueda-input" />
        <select [(ngModel)]="estadoFiltro" (change)="filtrarProyectos()" class="estado-select">
          <option value="">Todos</option>
          <option value="ACTIVO">Activo</option>
          <option value="EN_PROGRESO">En progreso</option>
          <option value="COMPLETADO">Completado</option>
          <option value="CANCELADO">Cancelado</option>
          <option value="BORRADOR">Borrador</option>
        </select>
      </div>

      <div *ngIf="loading" class="loading">Cargando proyectos...</div>
      <div *ngIf="!loading && proyectosFiltrados.length === 0" class="empty">No tienes proyectos creados.</div>

      <div *ngIf="!loading && proyectosFiltrados.length > 0">
        <ul class="proyectos-list">
          <li *ngFor="let proyecto of proyectosFiltrados" class="proyecto-item">
            <div class="proyecto-header">
              <h3>{{ proyecto.titulo }}</h3>
              <span class="estado-tag" [ngClass]="proyecto.estado.toLowerCase()">{{ proyecto.estado }}</span>
            </div>
            <p>{{ proyecto.descripcion }}</p>
            <div class="proyecto-actions">
              <button class="btn-detalle" (click)="verDetalle(proyecto.id)">Ver Detalle</button>
              <button class="btn-editar" *ngIf="esCreadorSync(proyecto)" (click)="editarProyecto(proyecto.id)">Editar</button>
              <button class="btn-eliminar" *ngIf="esCreadorSync(proyecto)" (click)="confirmarEliminar(proyecto.id)">Eliminar</button>
              <button class="btn-colaboradores" (click)="verColaboradores(proyecto.id)">Colaboradores</button>
              <button class="btn-comentario" (click)="agregarComentario(proyecto.id)">Comentar</button>
              <button class="btn-avances" (click)="verAvances(proyecto.id)">Ver Avances</button>
            </div>
          </li>
        </ul>
      </div>

      <div *ngIf="error" class="error">Error: {{ error }}</div>
    </div>
  `,
  styles: [`
    .container { padding: 2rem; max-width: 900px; margin: auto; }
    .filtros-bar { display: flex; gap: 1rem; margin-bottom: 2rem; }
    .busqueda-input { flex: 2; padding: 0.6rem 1rem; border-radius: 6px; border: 1px solid #ddd; font-size: 1.1rem; }
    .estado-select { flex: 1; padding: 0.6rem 1rem; border-radius: 6px; border: 1px solid #ddd; font-size: 1.1rem; }
    .loading { color: #991b1b; font-weight: bold; }
    .empty { color: #991b1b; margin-top: 2rem; }
    .proyectos-list { list-style: none; padding: 0; }
    .proyecto-item { background: #fff; border-radius: 10px; box-shadow: 0 2px 8px #0001; margin-bottom: 2rem; padding: 2rem; }
    .proyecto-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.7rem; }
    .estado-tag { font-weight: 700; padding: 0.3rem 1rem; border-radius: 20px; font-size: 1rem; letter-spacing: 1px; }
    .estado-tag.activo { background: #e6fff0; color: #1ca97c; border: 1px solid #1ca97c; }
    .estado-tag.en_progreso { background: #eaf3ff; color: #1c5fa9; border: 1px solid #1c5fa9; }
    .estado-tag.completado { background: #f3ffe6; color: #7ca91c; border: 1px solid #7ca91c; }
    .estado-tag.cancelado { background: #ffe6e6; color: #e41c1c; border: 1px solid #e41c1c; }
    .estado-tag.borrador { background: #f6f7f9; color: #888; border: 1px solid #ccc; }
    .proyecto-actions { display: flex; gap: 0.7rem; margin-top: 1.2rem; flex-wrap: wrap; }
    .proyecto-actions button { padding: 0.5rem 1.2rem; border-radius: 6px; border: none; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s, color 0.2s; }
    .btn-detalle { background: #e41c1c; color: #fff; }
    .btn-detalle:hover { background: #b31212; }
    .btn-editar { background: #1c5fa9; color: #fff; }
    .btn-editar:hover { background: #14407a; }
    .btn-eliminar { background: #eee; color: #e41c1c; border: 1px solid #e41c1c; }
    .btn-eliminar:hover { background: #e41c1c22; color: #b31212; }
    .btn-colaboradores { background: #1ca97c; color: #fff; }
    .btn-colaboradores:hover { background: #157a5c; }
    .btn-comentario { background: #f6b700; color: #fff; }
    .btn-comentario:hover { background: #b38a00; }
    .btn-avances { background: #7ca91c; color: #fff; }
    .btn-avances:hover { background: #4e6a0c; }
    .error { color: #e41c1c; margin-top: 1rem; }
  `]
})
export class MisProyectosComponent implements OnInit {
  proyectos: Proyecto[] = [];
  proyectosFiltrados: Proyecto[] = [];
  busqueda: string = '';
  estadoFiltro: string = '';
  loading = true;
  error: string | null = null;
  currentUserUid: string | null = null;

  constructor(
    private proyectoService: ProyectoService,
    private authService: AuthService, // ✅ nombre corregido
    private router: Router
  ) {}

  async ngOnInit() {
    console.log('🔍 Verificando autenticación...');
    const user = await this.authService.getCurrentUser();
    this.currentUserUid = user?.uid ?? null;

    console.log('Usuario actual UID:', this.currentUserUid);

    this.proyectoService.getMisProyectos().subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.proyectos = response;
        } else if (response && Array.isArray(response.results)) {
          this.proyectos = response.results;
        } else {
          this.proyectos = [];
          this.error = 'No se pudo cargar la lista de proyectos.';
        }
        this.filtrarProyectos();
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar proyectos:', err);
        this.loading = false;
        this.proyectos = [];
        this.error = 'Error al cargar proyectos.';
      }
    });
  }

  filtrarProyectos() {
    this.proyectosFiltrados = this.proyectos.filter(p => {
      const coincideBusqueda = this.busqueda.trim() === '' || p.titulo.toLowerCase().includes(this.busqueda.trim().toLowerCase());
      const coincideEstado = this.estadoFiltro === '' || p.estado === this.estadoFiltro;
      return coincideBusqueda && coincideEstado;
    });
  }

  /** ✅ Método asíncrono original */
  async esCreador(proyecto: Proyecto): Promise<boolean> {
    const usuario = await this.authService.getCurrentUser();
    return Boolean(
      proyecto.creador &&
      usuario &&
      String(usuario.uid) === String(proyecto.creador.id)
    );
  }

  /** ✅ Versión síncrona para usar en el template */
  esCreadorSync(proyecto: Proyecto): boolean {
    return Boolean(
      proyecto.creador &&
      this.currentUserUid &&
      String(this.currentUserUid) === String(proyecto.creador.id)
    );
  }

  private verificarAutenticacion(): boolean {
    if (!this.authService.isAuthenticated()) {
      alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  verDetalle(id: number) {
    this.router.navigate(['/proyectos', id]);
  }

  editarProyecto(id: number) {
    if (!this.verificarAutenticacion()) return;
    this.router.navigate(['/proyectos', id, 'editar']);
  }

  confirmarEliminar(id: number) {
    if (!this.verificarAutenticacion()) return;

    if (confirm('¿Seguro que deseas eliminar este proyecto?')) {
      this.proyectoService.deleteProyecto(id).subscribe({
        next: () => {
          this.proyectos = this.proyectos.filter(p => p.id !== id);
          this.filtrarProyectos();
          alert('✅ Proyecto eliminado exitosamente');
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('❌ Error al eliminar el proyecto. Verifica que tengas permisos.');
        }
      });
    }
  }

  verColaboradores(id: number) {
    this.router.navigate(['/proyectos', id]);
  }

  agregarComentario(id: number) {
    this.router.navigate(['/proyectos', id]);
  }

  verAvances(id: number) {
    this.router.navigate(['/proyectos', id]);
  }
}
