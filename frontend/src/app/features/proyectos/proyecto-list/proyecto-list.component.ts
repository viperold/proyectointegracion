// Componente de lista de proyectos
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { AuthService } from '../../../core/services/auth.service';
import { Proyecto } from '../../../core/models/models';

@Component({
  selector: 'app-proyecto-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="proyecto-list-container">
      <div class="container">
        <!-- Cabecera -->
        <div class="header-section">
          <div>
            <h1>Red de Colaboración Estudiantil</h1>
            <p class="subtitle">Descubre proyectos y colabora con otros estudiantes de INACAP Valdivia</p>
          </div>
          @if (authService.isAuthenticated()) {
            <a routerLink="/proyectos/nuevo" class="btn btn-primary">
              <span class="icon">+</span>
              Crear Proyecto
            </a>
          }
        </div>

        <!-- Filtros -->
        <div class="filters-section">
          <div class="search-box">
            <input 
              type="text" 
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
              placeholder="Buscar proyectos por título, descripción..."
              class="search-input"
            />
            <span class="search-icon">🔍</span>
          </div>

          <div class="filter-group">
            <select [(ngModel)]="estadoFilter" (change)="onFilterChange()" class="filter-select">
              <option value="">Todos los estados</option>
              <option value="BORRADOR">Borrador</option>
              <option value="ACTIVO">Activo</option>
              <option value="EN_PROGRESO">En Progreso</option>
              <option value="COMPLETADO">Completado</option>
            </select>

            <label class="checkbox-filter">
              <input 
                type="checkbox" 
                [(ngModel)]="soloVacantes"
                (change)="onFilterChange()"
              />
              Solo con vacantes
            </label>
          </div>
        </div>

        <!-- Estado de carga -->
        @if (loading) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Cargando proyectos...</p>
          </div>
        }

        <!-- Error -->
        @if (error && !loading) {
          <div class="error-state">
            <p class="error-message">❌ {{ error }}</p>
            <button (click)="loadProyectos()" class="btn btn-secondary">Reintentar</button>
          </div>
        }

        <!-- Lista de proyectos -->
        @if (!loading && !error) {
          @if (proyectos.length > 0) {
            <div class="proyectos-grid">
              @for (proyecto of proyectos; track proyecto.id) {
                <div class="proyecto-card">
                  <!-- Imagen -->
                  <div class="proyecto-image">
                    @if (proyecto.imagen) {
                      <img [src]="proyecto.imagen" [alt]="proyecto.titulo" />
                    } @else {
                      <div class="placeholder-image">
                        <span class="icon-placeholder">📁</span>
                      </div>
                    }
                    <div class="estado-badge" [class]="'badge-' + proyecto.estado.toLowerCase()">
                      {{ getEstadoLabel(proyecto.estado) }}
                    </div>
                  </div>

                  <!-- Contenido -->
                  <div class="proyecto-content">
                    <h3 class="proyecto-titulo">{{ proyecto.titulo }}</h3>
                    <p class="proyecto-descripcion">{{ proyecto.descripcion | slice:0:120 }}{{ proyecto.descripcion.length > 120 ? '...' : '' }}</p>

                    <!-- Información del creador -->
                    <div class="proyecto-autor">
                      <div class="autor-avatar">
                        @if (proyecto.creador.avatar) {
                          <img [src]="proyecto.creador.avatar" [alt]="proyecto.creador.nombre" />
                        } @else {
                          <div class="avatar-placeholder">{{ proyecto.creador.nombre.charAt(0) }}</div>
                        }
                      </div>
                      <div class="autor-info">
                        <span class="autor-nombre">{{ proyecto.creador.nombre }} {{ proyecto.creador.apellido }}</span>
                        <span class="autor-carrera">{{ proyecto.creador.carrera }}</span>
                      </div>
                    </div>

                    <!-- Habilidades -->
                    @if (proyecto.habilidades_requeridas && proyecto.habilidades_requeridas.length > 0) {
                      <div class="habilidades-list">
                        @for (habilidad of proyecto.habilidades_requeridas.slice(0, 3); track habilidad.id) {
                          <span class="habilidad-tag">{{ habilidad.nombre }}</span>
                        }
                        @if (proyecto.habilidades_requeridas.length > 3) {
                          <span class="habilidad-tag more">+{{ proyecto.habilidades_requeridas.length - 3 }}</span>
                        }
                      </div>
                    }

                    <!-- Estadísticas -->
                    <div class="proyecto-stats">
                      <div class="stat">
                        <span class="stat-icon">👥</span>
                        <span>{{ proyecto.colaboradores_actuales }}/{{ proyecto.colaboradores_necesarios }}</span>
                      </div>
                      <div class="stat">
                        <span class="stat-icon">💬</span>
                        <span>{{ proyecto.total_comentarios }}</span>
                      </div>
                      @if (proyecto.tiene_vacantes) {
                        <div class="stat vacante">
                          <span class="stat-icon">✓</span>
                          <span>Vacantes disponibles</span>
                        </div>
                      }
                    </div>

                    <!-- Botón de acción -->
                    <a [routerLink]="['/proyectos', proyecto.id]" class="btn btn-outline btn-block">
                      Ver Detalles
                    </a>
                  </div>
                </div>
              }
            </div>

            <!-- Información de resultados -->
            <div class="results-info">
              <p>Mostrando {{ proyectos.length }} proyecto(s)</p>
            </div>
          } @else {
            <div class="empty-state">
              <div class="empty-icon">📭</div>
              <h3>No se encontraron proyectos</h3>
              <p>Intenta ajustar los filtros de búsqueda</p>
              @if (authService.isAuthenticated()) {
                <a routerLink="/proyectos/nuevo" class="btn btn-primary">Crear el primer proyecto</a>
              }
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .proyecto-list-container {
      padding: 2rem 0;
      min-height: calc(100vh - 64px);
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .subtitle {
      color: var(--text-light);
      font-size: 1.1rem;
      margin-top: 0.5rem;
    }

    .filters-section {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .search-box {
      position: relative;
      margin-bottom: 1rem;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 3rem;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.25rem;
    }

    .filter-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .filter-select {
      padding: 0.5rem 1rem;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      font-size: 0.95rem;
      background: white;
      cursor: pointer;
    }

    .checkbox-filter {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.95rem;
    }

    .checkbox-filter input {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .proyectos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .proyecto-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .proyecto-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .proyecto-image {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
      background: var(--light-color);
    }

    .proyecto-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .placeholder-image {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .icon-placeholder {
      font-size: 4rem;
      opacity: 0.5;
    }

    .estado-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      background: rgba(255,255,255,0.95);
      color: var(--dark-color);
    }

    .badge-activo {
      background: var(--success-color);
      color: white;
    }

    .badge-en_progreso {
      background: var(--secondary-color);
      color: white;
    }

    .badge-completado {
      background: var(--text-light);
      color: white;
    }

    .badge-borrador {
      background: var(--warning-color);
      color: white;
    }

    .proyecto-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      flex: 1;
    }

    .proyecto-titulo {
      font-size: 1.25rem;
      margin: 0;
      color: var(--dark-color);
      line-height: 1.3;
    }

    .proyecto-descripcion {
      color: var(--text-light);
      font-size: 0.95rem;
      line-height: 1.5;
      margin: 0;
    }

    .proyecto-autor {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      padding: 0.75rem;
      background: var(--light-color);
      border-radius: 8px;
    }

    .autor-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
    }

    .autor-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary-color);
      color: white;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .autor-info {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .autor-nombre {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--dark-color);
    }

    .autor-carrera {
      font-size: 0.8rem;
      color: var(--text-light);
    }

    .habilidades-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .habilidad-tag {
      padding: 0.25rem 0.75rem;
      background: var(--light-color);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      font-size: 0.8rem;
      color: var(--text-color);
    }

    .habilidad-tag.more {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .proyecto-stats {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border-color);
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: var(--text-light);
    }

    .stat.vacante {
      color: var(--success-color);
      font-weight: 600;
    }

    .stat-icon {
      font-size: 1.1rem;
    }

    .btn-block {
      width: 100%;
      text-align: center;
      margin-top: auto;
    }

    .loading-state, .error-state, .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid var(--border-color);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .error-message {
      color: var(--danger-color);
      margin-bottom: 1rem;
      font-weight: 500;
    }

    .results-info {
      text-align: center;
      color: var(--text-light);
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .proyectos-grid {
        grid-template-columns: 1fr;
      }

      .header-section {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class ProyectoListComponent implements OnInit {
  proyectoService = inject(ProyectoService);
  authService = inject(AuthService);

  proyectos: Proyecto[] = [];
  loading = false;
  error: string | null = null;

  // Filtros
  searchQuery = '';
  estadoFilter = '';
  soloVacantes = false;

  ngOnInit() {
    this.loadProyectos();
  }

  loadProyectos() {
    this.loading = true;
    this.error = null;

    const filters: any = {};

    if (this.searchQuery.trim()) {
      filters.search = this.searchQuery.trim();
    }

    if (this.estadoFilter) {
      filters.estado = this.estadoFilter;
    }

    if (this.soloVacantes) {
      filters.tiene_vacantes = 'true';
    }

    this.proyectoService.getProyectos(filters).subscribe({
      next: (response) => {
        // El backend puede devolver paginación o un array directo
        this.proyectos = response.results || response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar proyectos:', err);
        this.error = 'No se pudieron cargar los proyectos. Por favor, intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  onSearch() {
    // Debounce simple - esperar 300ms después de que el usuario deje de escribir
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.loadProyectos();
    }, 300);
  }

  onFilterChange() {
    this.loadProyectos();
  }

  getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      'BORRADOR': 'Borrador',
      'ACTIVO': 'Activo',
      'EN_PROGRESO': 'En Progreso',
      'COMPLETADO': 'Completado',
      'CANCELADO': 'Cancelado'
    };
    return labels[estado] || estado;
  }

  private searchTimeout: any;
}
