// Componente de detalle de proyecto
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { AuthService } from '../../../core/services/auth.service';
import { Proyecto, Colaboracion, Comentario } from '../../../core/models/models';

@Component({
  selector: 'app-proyecto-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="proyecto-detail-container">
      <div class="container">
        <!-- Loading -->
        @if (loading) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Cargando proyecto...</p>
          </div>
        }

        <!-- Error -->
        @if (error && !loading) {
          <div class="error-state">
            <p class="error-message">❌ {{ error }}</p>
            <button (click)="loadProyecto()" class="btn btn-secondary">Reintentar</button>
            <a routerLink="/proyectos" class="btn btn-outline">Volver a la lista</a>
          </div>
        }

        <!-- Contenido del proyecto -->
        @if (proyecto && !loading && !error) {
          <div class="proyecto-detail">
            <!-- Cabecera con imagen -->
            <div class="proyecto-header">
              <div class="header-image">
                @if (proyecto.imagen) {
                  <img [src]="proyecto.imagen" [alt]="proyecto.titulo" />
                } @else {
                  <div class="placeholder-image">
                    <span class="icon-placeholder">📁</span>
                  </div>
                }
              </div>

              <div class="header-content">
                <div class="breadcrumb">
                  <a routerLink="/proyectos">Proyectos</a>
                  <span>/</span>
                  <span>{{ proyecto.titulo }}</span>
                </div>

                <h1>{{ proyecto.titulo }}</h1>

                <div class="proyecto-meta">
                  <span class="estado-badge" [class]="'badge-' + proyecto.estado.toLowerCase()">
                    {{ getEstadoLabel(proyecto.estado) }}
                  </span>

                  @if (proyecto.tiene_vacantes) {
                    <span class="vacante-badge">✓ Vacantes disponibles</span>
                  }

                  <span class="fecha">📅 {{ proyecto.created_at | date:'dd/MM/yyyy' }}</span>
                </div>

                <!-- Acciones -->
                <div class="proyecto-actions">
                  <!-- ✅ Mantengo la llamada del template a isOwner(),
                       pero ahora isOwner() devuelve un booleano basado en un estado precalculado -->
                  @if (isOwner()) {
                    <a [routerLink]="['/proyectos', proyecto.id, 'editar']" class="btn btn-primary">
                      ✏️ Editar Proyecto
                    </a>
                    <button (click)="deleteProyecto()" class="btn btn-danger">
                      🗑️ Eliminar
                    </button>
                  } @else if (authService.isAuthenticated() && proyecto.tiene_vacantes && !yaColabora) {
                    <button (click)="mostrarFormularioColaboracion()" class="btn btn-primary">
                      👥 Solicitar Colaborar
                    </button>
                  }
                </div>
              </div>
            </div>

            <!-- Información principal en columnas -->
            <div class="proyecto-body">
              <!-- Columna principal -->
              <div class="main-column">
                <!-- Descripción -->
                <section class="info-section">
                  <h2>📋 Descripción</h2>
                  <p class="descripcion">{{ proyecto.descripcion }}</p>
                </section>

                <!-- Objetivo -->
                <section class="info-section">
                  <h2>🎯 Objetivo</h2>
                  <p class="objetivo">{{ proyecto.objetivo }}</p>
                </section>

                <!-- Habilidades y disciplinas requeridas -->
                <section class="info-section">
                  <h2>💼 Requisitos</h2>
                  
                  @if (proyecto.disciplinas_requeridas && proyecto.disciplinas_requeridas.length > 0) {
                    <div class="requisitos-group">
                      <h4>Disciplinas:</h4>
                      <div class="tags-list">
                        @for (disciplina of proyecto.disciplinas_requeridas; track disciplina.id) {
                          <span class="tag tag-disciplina">{{ disciplina.nombre }}</span>
                        }
                      </div>
                    </div>
                  }

                  @if (proyecto.habilidades_requeridas && proyecto.habilidades_requeridas.length > 0) {
                    <div class="requisitos-group">
                      <h4>Habilidades:</h4>
                      <div class="tags-list">
                        @for (habilidad of proyecto.habilidades_requeridas; track habilidad.id) {
                          <span class="tag tag-habilidad">{{ habilidad.nombre }}</span>
                        }
                      </div>
                    </div>
                  }
                </section>

                <!-- Formulario de solicitud de colaboración -->
                @if (mostrandoFormularioColaboracion) {
                  <section class="info-section form-colaboracion">
                    <h2>📝 Solicitar Colaboración</h2>
                    <p>Explica por qué quieres colaborar en este proyecto:</p>
                    <textarea
                      [(ngModel)]="mensajeColaboracion"
                      rows="4"
                      placeholder="Cuéntale al creador sobre tu interés y experiencia relevante..."
                      class="form-control"
                    ></textarea>
                    <div class="form-actions">
                      <button 
                        (click)="enviarSolicitudColaboracion()" 
                        [disabled]="!mensajeColaboracion.trim() || enviandoSolicitud"
                        class="btn btn-primary"
                      >
                        @if (enviandoSolicitud) {
                          <span>Enviando...</span>
                        } @else {
                          <span>✉️ Enviar Solicitud</span>
                        }
                      </button>
                      <button (click)="cancelarFormularioColaboracion()" class="btn btn-outline">
                        Cancelar
                      </button>
                    </div>
                    @if (errorColaboracion) {
                      <p class="error-text">{{ errorColaboracion }}</p>
                    }
                  </section>
                }

                <!-- Comentarios -->
                <section class="info-section comentarios-section">
                  <h2>💬 Comentarios ({{ comentarios.length }})</h2>

                  @if (authService.isAuthenticated()) {
                    <div class="comentario-form">
                      <textarea
                        [(ngModel)]="nuevoComentario"
                        rows="3"
                        placeholder="Escribe un comentario..."
                        class="form-control"
                      ></textarea>
                      <button 
                        (click)="agregarComentario()" 
                        [disabled]="!nuevoComentario.trim() || enviandoComentario"
                        class="btn btn-primary btn-sm"
                      >
                        @if (enviandoComentario) {
                          <span>Enviando...</span>
                        } @else {
                          <span>Comentar</span>
                        }
                      </button>
                    </div>
                  }

                  @if (loadingComentarios) {
                    <div class="loading-small">
                      <div class="spinner-small"></div>
                      <span>Cargando comentarios...</span>
                    </div>
                  }

                  @if (comentarios.length > 0) {
                    <div class="comentarios-list">
                      @for (comentario of comentarios; track comentario.id) {
                        <div class="comentario-item">
                          <div class="comentario-header">
                            <div class="comentario-autor">
                              <div class="autor-avatar">
                                @if (comentario.usuario.avatar) {
                                  <img [src]="comentario.usuario.avatar" [alt]="comentario.usuario.nombre" />
                                } @else {
                                  <div class="avatar-placeholder">{{ comentario.usuario.nombre.charAt(0) }}</div>
                                }
                              </div>
                              <div>
                                <strong>{{ comentario.usuario.nombre }} {{ comentario.usuario.apellido }}</strong>
                                <span class="comentario-fecha">{{ comentario.created_at | date:'dd/MM/yyyy HH:mm' }}</span>
                              </div>
                            </div>
                            <!-- ✅ Mantengo el uso del método, pero ahora es SINCRÓNICO (usa un Set pre-calculado) -->
                            @if (puedeEliminarComentario(comentario)) {
                              <button (click)="eliminarComentario(comentario.id)" class="btn-icon">🗑️</button>
                            }
                          </div>
                          <p class="comentario-contenido">{{ comentario.contenido }}</p>
                        </div>
                      }
                    </div>
                  } @else if (!loadingComentarios) {
                    <p class="empty-text">Aún no hay comentarios. ¡Sé el primero en comentar!</p>
                  }
                </section>
              </div>

              <!-- Columna lateral -->
              <div class="sidebar-column">
                <!-- Creador -->
                <section class="sidebar-section">
                  <h3>👤 Creador</h3>
                  <div class="creador-card">
                    <div class="autor-avatar-large">
                      @if (proyecto.creador.avatar) {
                        <img [src]="proyecto.creador.avatar" [alt]="proyecto.creador.nombre" />
                      } @else {
                        <div class="avatar-placeholder">{{ proyecto.creador.nombre.charAt(0) }}</div>
                      }
                    </div>
                    <h4>{{ proyecto.creador.nombre }} {{ proyecto.creador.apellido }}</h4>
                    <p class="creador-carrera">{{ proyecto.creador.carrera }}</p>
                    @if (proyecto.creador.bio) {
                      <p class="creador-bio">{{ proyecto.creador.bio }}</p>
                    }
                    @if (proyecto.creador.disciplina) {
                      <span class="tag tag-disciplina">{{ proyecto.creador.disciplina.nombre }}</span>
                    }
                  </div>
                </section>

                <!-- Estadísticas -->
                <section class="sidebar-section">
                  <h3>📊 Estadísticas</h3>
                  <div class="stats-card">
                    <div class="stat-item">
                      <span class="stat-label">Colaboradores</span>
                      <span class="stat-value">{{ proyecto.colaboradores_actuales }}/{{ proyecto.colaboradores_necesarios }}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Comentarios</span>
                      <span class="stat-value">{{ proyecto.total_comentarios }}</span>
                    </div>
                    @if (proyecto.fecha_inicio) {
                      <div class="stat-item">
                        <span class="stat-label">Fecha Inicio</span>
                        <span class="stat-value">{{ proyecto.fecha_inicio | date:'dd/MM/yyyy' }}</span>
                      </div>
                    }
                    @if (proyecto.fecha_fin) {
                      <div class="stat-item">
                        <span class="stat-label">Fecha Fin</span>
                        <span class="stat-value">{{ proyecto.fecha_fin | date:'dd/MM/yyyy' }}</span>
                      </div>
                    }
                  </div>
                </section>

                <!-- Colaboradores actuales -->
                @if (colaboradores.length > 0) {
                  <section class="sidebar-section">
                    <h3>👥 Colaboradores ({{ colaboradores.length }})</h3>
                    <div class="colaboradores-list">
                      @for (colab of colaboradores; track colab.id) {
                        <div class="colaborador-item">
                          <div class="autor-avatar">
                            @if (colab.usuario.avatar) {
                              <img [src]="colab.usuario.avatar" [alt]="colab.usuario.nombre" />
                            } @else {
                              <div class="avatar-placeholder">{{ colab.usuario.nombre.charAt(0) }}</div>
                            }
                          </div>
                          <div class="colaborador-info">
                            <strong>{{ colab.usuario.nombre }} {{ colab.usuario.apellido }}</strong>
                            @if (colab.rol === 'LÍDER') {
                              <span class="tag tag-lider">Líder</span>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  </section>
                }

                <!-- Solicitudes pendientes (solo para el creador) -->
                <!-- ✅ Conservamos la condición tal cual, pero ahora isOwner() usa un flag precalculado -->
                @if (isOwner() && solicitudes.length > 0) {
                  <section class="sidebar-section">
                    <h3>📬 Solicitudes Pendientes ({{ solicitudes.length }})</h3>
                    <div class="solicitudes-list">
                      @for (solicitud of solicitudes; track solicitud.id) {
                        <div class="solicitud-item">
                          <div class="solicitud-header">
                            <div class="autor-avatar">
                              @if (solicitud.usuario.avatar) {
                                <img [src]="solicitud.usuario.avatar" [alt]="solicitud.usuario.nombre" />
                              } @else {
                                <div class="avatar-placeholder">{{ solicitud.usuario.nombre.charAt(0) }}</div>
                              }
                            </div>
                            <div>
                              <strong>{{ solicitud.usuario.nombre }} {{ solicitud.usuario.apellido }}</strong>
                              <span class="solicitud-fecha">{{ solicitud.created_at | date:'dd/MM/yyyy' }}</span>
                            </div>
                          </div>
                          <p class="solicitud-mensaje">{{ solicitud.mensaje }}</p>
                          <div class="solicitud-actions">
                            <button 
                              (click)="aceptarSolicitud(solicitud.id)" 
                              class="btn btn-success btn-sm"
                              [disabled]="procesandoSolicitud"
                            >
                              ✓ Aceptar
                            </button>
                            <button 
                              (click)="rechazarSolicitud(solicitud.id)" 
                              class="btn btn-danger btn-sm"
                              [disabled]="procesandoSolicitud"
                            >
                              ✗ Rechazar
                            </button>
                          </div>
                        </div>
                      }
                    </div>
                  </section>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .proyecto-detail-container {
      padding: 2rem 0;
      min-height: calc(100vh - 64px);
    }

    .loading-state, .error-state {
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

    .error-message {
      color: var(--danger-color);
      margin-bottom: 1rem;
      font-weight: 500;
    }

    /* Header */
    .proyecto-header {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .header-image {
      width: 100%;
      height: 400px;
      overflow: hidden;
      background: var(--light-color);
    }

    .header-image img {
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
      font-size: 6rem;
      opacity: 0.5;
    }

    .header-content {
      padding: 2rem;
    }

    .breadcrumb {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: var(--text-light);
    }

    .breadcrumb a {
      color: var(--primary-color);
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: var(--dark-color);
    }

    .proyecto-meta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .estado-badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
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

    .vacante-badge {
      padding: 0.5rem 1rem;
      background: var(--success-color);
      color: white;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .fecha {
      color: var(--text-light);
    }

    .proyecto-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    /* Body en dos columnas */
    .proyecto-body {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
    }

    .main-column {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .sidebar-column {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* Secciones */
    .info-section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .info-section h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: var(--dark-color);
    }

    .descripcion, .objetivo {
      line-height: 1.8;
      color: var(--text-color);
    }

    .requisitos-group {
      margin-bottom: 1rem;
    }

    .requisitos-group:last-child {
      margin-bottom: 0;
    }

    .requisitos-group h4 {
      font-size: 1rem;
      margin-bottom: 0.75rem;
      color: var(--text-color);
    }

    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .tag-disciplina {
      background: #dbeafe;
      color: #1e40af;
    }

    .tag-habilidad {
      background: #fef3c7;
      color: #92400e;
    }

    .tag-lider {
      background: var(--warning-color);
      color: white;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
    }

    /* Formulario de colaboración */
    .form-colaboracion {
      border: 2px solid var(--primary-color);
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      font-size: 1rem;
      font-family: inherit;
      resize: vertical;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .error-text {
      color: var(--danger-color);
      margin-top: 1rem;
      font-size: 0.9rem;
    }

    /* Comentarios */
    .comentarios-section h2 {
      margin-bottom: 1.5rem;
    }

    .comentario-form {
      margin-bottom: 1.5rem;
      display: flex;
      gap: 1rem;
      flex-direction: column;
    }

    .loading-small {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: var(--light-color);
      border-radius: 8px;
      color: var(--text-light);
    }

    .spinner-small {
      width: 20px;
      height: 20px;
      border: 3px solid var(--border-color);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .comentarios-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .comentario-item {
      padding: 1rem;
      background: var(--light-color);
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }

    .comentario-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }

    .comentario-autor {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .comentario-fecha {
      display: block;
      font-size: 0.8rem;
      color: var(--text-light);
    }

    .comentario-contenido {
      line-height: 1.6;
      color: var(--text-color);
      margin: 0;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0.25rem;
      opacity: 0.6;
      transition: opacity 0.3s ease;
    }

    .btn-icon:hover {
      opacity: 1;
    }

    .empty-text {
      text-align: center;
      color: var(--text-light);
      padding: 2rem;
      background: var(--light-color);
      border-radius: 8px;
    }

    /* Sidebar */
    .sidebar-section {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .sidebar-section h3 {
      font-size: 1.1rem;
      margin-bottom: 1rem;
      color: var(--dark-color);
    }

    .creador-card {
      text-align: center;
    }

    .autor-avatar, .autor-avatar-large {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
    }

    .autor-avatar-large {
      width: 80px;
      height: 80px;
      margin: 0 auto 1rem;
    }

    .autor-avatar img, .autor-avatar-large img {
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

    .creador-card h4 {
      margin: 0 0 0.25rem;
      font-size: 1.1rem;
    }

    .creador-carrera {
      color: var(--text-light);
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .creador-bio {
      font-size: 0.9rem;
      line-height: 1.5;
      color: var(--text-color);
      margin: 1rem 0;
    }

    .stats-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem;
      background: var(--light-color);
      border-radius: 8px;
    }

    .stat-label {
      color: var(--text-light);
      font-size: 0.9rem;
    }

    .stat-value {
      font-weight: 600;
      color: var(--dark-color);
    }

    .colaboradores-list, .solicitudes-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .colaborador-item {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      padding: 0.75rem;
      background: var(--light-color);
      border-radius: 8px;
    }

    .colaborador-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
    }

    .colaborador-info strong {
      font-size: 0.9rem;
    }

    .solicitud-item {
      padding: 1rem;
      background: var(--light-color);
      border-radius: 8px;
      border: 2px solid var(--warning-color);
    }

    .solicitud-header {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .solicitud-fecha {
      display: block;
      font-size: 0.8rem;
      color: var(--text-light);
    }

    .solicitud-mensaje {
      font-size: 0.9rem;
      line-height: 1.5;
      color: var(--text-color);
      margin-bottom: 1rem;
      padding: 0.75rem;
      background: white;
      border-radius: 6px;
    }

    .solicitud-actions {
      display: flex;
      gap: 0.5rem;
    }

    @media (max-width: 1024px) {
      .proyecto-body {
        grid-template-columns: 1fr;
      }

      .sidebar-column {
        order: 1;
      }

      .main-column {
        order: 2;
      }
    }

    @media (max-width: 768px) {
      .header-image {
        height: 250px;
      }

      h1 {
        font-size: 1.75rem;
      }

      .proyecto-actions {
        flex-direction: column;
      }

      .proyecto-actions .btn {
        width: 100%;
      }
    }
  `]
})
export class ProyectoDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  proyectoService = inject(ProyectoService);
  authService = inject(AuthService);

  proyecto: Proyecto | null = null;
  colaboradores: Colaboracion[] = [];
  solicitudes: Colaboracion[] = [];
  comentarios: Comentario[] = [];

  loading = false;
  loadingComentarios = false;
  error: string | null = null;

  // Formulario de colaboración
  mostrandoFormularioColaboracion = false;
  mensajeColaboracion = '';
  enviandoSolicitud = false;
  errorColaboracion: string | null = null;

  // Comentarios
  nuevoComentario = '';
  enviandoComentario = false;

  // Solicitudes
  procesandoSolicitud = false;

  yaColabora = false;

  // 🔹 NUEVO: Flag precalculado para no usar Promises en el template
  private isOwnerUser = false;

  // 🔹 NUEVO: Set con IDs de comentarios que el usuario puede eliminar (para template síncrono)
  private permiteEliminarComentarios = new Set<number>();

  async ngOnInit() {
    this.route.params.subscribe(async params => {
      const id = +params['id'];
      if (id) {
        await this.loadProyecto();
      }
    });
  }

  async loadProyecto() {
    const id = +this.route.snapshot.params['id'];
    this.loading = true;
    this.error = null;

    this.proyectoService.getProyecto(id).subscribe({
      next: async (proyecto) => {
        this.proyecto = proyecto;
        this.loading = false;

        // Cargar listas
        this.loadColaboradores();
        this.loadComentarios();

        // 🔹 Precalcular ownership (síncrono para el template)
        await this.computeIsOwner();

        // 🔹 Si es owner, cargar solicitudes
        if (this.isOwner()) {
          this.loadSolicitudes();
        }

        // 🔹 Precalcular si ya colabora
        await this.verificarSiColabora();

        // 🔹 Recalcular permisos de comentarios si ya hay comentarios
        await this.recomputeCommentPermissions();
      },
      error: (err) => {
        console.error('Error al cargar proyecto:', err);
        this.error = 'No se pudo cargar el proyecto. Puede que no exista o no tengas permisos.';
        this.loading = false;
      }
    });
  }

  loadColaboradores() {
    if (!this.proyecto) return;

    this.proyectoService.getColaboradores(this.proyecto.id).subscribe({
      next: async (colaboradores) => {
        this.colaboradores = colaboradores.filter(c => c.estado === 'ACEPTADA');
        // 🔹 Cada vez que cambian colaboradores, recalculamos si ya colabora
        await this.verificarSiColabora();
      },
      error: (err) => {
        console.error('Error al cargar colaboradores:', err);
      }
    });
  }

  loadSolicitudes() {
    if (!this.proyecto) return;

    this.proyectoService.getSolicitudes(this.proyecto.id).subscribe({
      next: (solicitudes) => {
        this.solicitudes = solicitudes.filter(s => s.estado === 'PENDIENTE');
      },
      error: (err) => {
        console.error('Error al cargar solicitudes:', err);
      }
    });
  }

  loadComentarios() {
    if (!this.proyecto) return;

    this.loadingComentarios = true;
    this.proyectoService.getComentarios(this.proyecto.id).subscribe({
      next: async (comentarios) => {
        this.comentarios = comentarios;
        this.loadingComentarios = false;
        // 🔹 Recalcular permisos de eliminación para cada comentario
        await this.recomputeCommentPermissions();
      },
      error: (err) => {
        console.error('Error al cargar comentarios:', err);
        this.loadingComentarios = false;
      }
    });
  }

  // 🔹 NUEVO: calcula si el usuario actual es el creador del proyecto (y guarda en flag)
  private async computeIsOwner() {
    if (!this.proyecto || !this.authService.isAuthenticated()) {
      this.isOwnerUser = false;
      return;
    }
    const currentUser = await this.authService.getCurrentUser();
    this.isOwnerUser = !!(currentUser && currentUser.uid === String(this.proyecto.creador.id));
  }

  // ✅ Dejado como método síncrono para el template (lee el flag precalculado)
  isOwner(): boolean {
    return this.isOwnerUser;
  }

  // 🔹 NUEVO: Precalcula si el usuario ya colabora (evita Promises en template)
  async verificarSiColabora() {
    if (!this.authService.isAuthenticated() || !this.proyecto) {
      this.yaColabora = false;
      return;
    }
    const currentUser = await this.authService.getCurrentUser();
    this.yaColabora = !!(currentUser && this.colaboradores.some(c => String(c.usuario.id) === currentUser.uid));
  }

  // 🔹 NUEVO: Precalcula permisos de eliminación de comentarios en un Set
  private async recomputeCommentPermissions() {
    this.permiteEliminarComentarios.clear();
    if (!this.authService.isAuthenticated()) return;
    const currentUser = await this.authService.getCurrentUser();
    if (!currentUser) return;

    const esOwner = this.isOwner();

    for (const c of this.comentarios) {
      const esAutor = String(c.usuario.id) === currentUser.uid;
      if (esAutor || esOwner) {
        this.permiteEliminarComentarios.add(c.id);
      }
    }
  }

  mostrarFormularioColaboracion() {
    this.mostrandoFormularioColaboracion = true;
    this.errorColaboracion = null;
  }

  cancelarFormularioColaboracion() {
    this.mostrandoFormularioColaboracion = false;
    this.mensajeColaboracion = '';
    this.errorColaboracion = null;
  }

  enviarSolicitudColaboracion() {
    if (!this.proyecto || !this.mensajeColaboracion.trim()) return;

    this.enviandoSolicitud = true;
    this.errorColaboracion = null;

    this.proyectoService.solicitarColaboracion(this.proyecto.id, this.mensajeColaboracion).subscribe({
      next: () => {
        this.enviandoSolicitud = false;
        this.mostrandoFormularioColaboracion = false;
        this.mensajeColaboracion = '';
        alert('¡Solicitud enviada! El creador del proyecto la revisará pronto.');
      },
      error: (err) => {
        console.error('Error al enviar solicitud:', err);
        this.errorColaboracion = err.error?.detail || 'No se pudo enviar la solicitud. Intenta de nuevo.';
        this.enviandoSolicitud = false;
      }
    });
  }

  aceptarSolicitud(solicitudId: number) {
    if (!confirm('¿Aceptar esta solicitud de colaboración?')) return;

    this.procesandoSolicitud = true;
    this.proyectoService.aceptarColaboracion(solicitudId).subscribe({
      next: () => {
        this.procesandoSolicitud = false;
        this.loadSolicitudes();
        this.loadColaboradores();
        if (this.proyecto) {
          this.proyecto.colaboradores_actuales++;
          this.proyecto.tiene_vacantes = this.proyecto.colaboradores_actuales < this.proyecto.colaboradores_necesarios;
        }
        alert('¡Solicitud aceptada!');
      },
      error: (err) => {
        console.error('Error al aceptar solicitud:', err);
        alert('No se pudo aceptar la solicitud. Intenta de nuevo.');
        this.procesandoSolicitud = false;
      }
    });
  }

  rechazarSolicitud(solicitudId: number) {
    if (!confirm('¿Rechazar esta solicitud de colaboración?')) return;

    this.procesandoSolicitud = true;
    this.proyectoService.rechazarColaboracion(solicitudId).subscribe({
      next: () => {
        this.procesandoSolicitud = false;
        this.loadSolicitudes();
        alert('Solicitud rechazada.');
      },
      error: (err) => {
        console.error('Error al rechazar solicitud:', err);
        alert('No se pudo rechazar la solicitud. Intenta de nuevo.');
        this.procesandoSolicitud = false;
      }
    });
  }

  agregarComentario() {
    if (!this.proyecto || !this.nuevoComentario.trim()) return;

    this.enviandoComentario = true;
    this.proyectoService.createComentario(this.proyecto.id, this.nuevoComentario).subscribe({
      next: async (comentario) => {
        this.comentarios.unshift(comentario);
        this.nuevoComentario = '';
        this.enviandoComentario = false;
        if (this.proyecto) {
          this.proyecto.total_comentarios++;
        }
        // 🔹 Recalcular permisos (el autor debería poder eliminar su nuevo comentario)
        await this.recomputeCommentPermissions();
      },
      error: (err) => {
        console.error('Error al agregar comentario:', err);
        alert('No se pudo agregar el comentario. Intenta de nuevo.');
        this.enviandoComentario = false;
      }
    });
  }

  // ✅ Ahora es SINCRÓNICO para poder usarse en el template sin errores
  puedeEliminarComentario(comentario: Comentario): boolean {
    return this.permiteEliminarComentarios.has(comentario.id);
  }

  eliminarComentario(comentarioId: number) {
    if (!confirm('¿Eliminar este comentario?')) return;

    this.proyectoService.deleteComentario(comentarioId).subscribe({
      next: async () => {
        this.comentarios = this.comentarios.filter(c => c.id !== comentarioId);
        if (this.proyecto) {
          this.proyecto.total_comentarios--;
        }
        // 🔹 Recalcular permisos por si cambió el set
        await this.recomputeCommentPermissions();
      },
      error: (err) => {
        console.error('Error al eliminar comentario:', err);
        alert('No se pudo eliminar el comentario. Intenta de nuevo.');
      }
    });
  }

  deleteProyecto() {
    if (!this.proyecto) return;

    if (!confirm('¿Estás seguro de eliminar este proyecto? Esta acción no se puede deshacer.')) return;

    this.proyectoService.deleteProyecto(this.proyecto.id).subscribe({
      next: () => {
        alert('Proyecto eliminado exitosamente.');
        this.router.navigate(['/proyectos']);
      },
      error: (err) => {
        console.error('Error al eliminar proyecto:', err);
        alert('No se pudo eliminar el proyecto. Intenta de nuevo.');
      }
    });
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
}
