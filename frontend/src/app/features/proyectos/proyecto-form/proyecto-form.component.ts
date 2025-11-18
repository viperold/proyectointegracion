// Componente de formulario de proyecto
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Proyecto, Disciplina, Habilidad } from '../../../core/models/models';

@Component({
  selector: 'app-proyecto-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="proyecto-form-container">
      <div class="container">
        <div class="form-header">
          <div class="breadcrumb">
            <a routerLink="/proyectos">Proyectos</a>
            <span>/</span>
            @if (proyectoId) {
              <a [routerLink]="['/proyectos', proyectoId]">Detalle</a>
              <span>/</span>
            }
            <span>{{ proyectoId ? 'Editar' : 'Crear' }} Proyecto</span>
          </div>
          <h1>{{ proyectoId ? 'Editar' : 'Nuevo' }} Proyecto</h1>
          <p class="subtitle">{{ proyectoId ? 'Actualiza la información' : 'Completa los datos' }} de tu proyecto colaborativo</p>
        </div>

        @if (loading) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Cargando...</p>
          </div>
        }

        @if (error && !loading) {
          <div class="alert alert-error">
            <p>❌ {{ error }}</p>
          </div>
        }

        @if (!loading) {
          <form [formGroup]="proyectoForm" (ngSubmit)="onSubmit()" class="proyecto-form">
            <div class="form-grid">
              <!-- Columna principal -->
              <div class="main-column">
                <!-- Información básica -->
                <div class="form-section">
                  <h2>📋 Información Básica</h2>

                  <div class="form-group">
                    <label class="form-label required">Título del Proyecto</label>
                    <input 
                      type="text" 
                      formControlName="titulo"
                      placeholder="Ej: Sistema de Gestión de Biblioteca Digital"
                      class="form-control"
                      [class.error]="isFieldInvalid('titulo')"
                    />
                    @if (isFieldInvalid('titulo')) {
                      <span class="error-text">El título es obligatorio (mínimo 10 caracteres)</span>
                    }
                  </div>

                  <div class="form-group">
                    <label class="form-label required">Descripción</label>
                    <textarea 
                      formControlName="descripcion"
                      rows="4"
                      placeholder="Describe detalladamente tu proyecto, sus características principales y qué problema busca resolver..."
                      class="form-control"
                      [class.error]="isFieldInvalid('descripcion')"
                    ></textarea>
                    <div class="char-count">
                      {{ proyectoForm.get('descripcion')?.value?.length || 0 }} / 1000 caracteres
                    </div>
                    @if (isFieldInvalid('descripcion')) {
                      <span class="error-text">La descripción es obligatoria (mínimo 50 caracteres)</span>
                    }
                  </div>

                  <div class="form-group">
                    <label class="form-label required">Objetivo del Proyecto</label>
                    <textarea 
                      formControlName="objetivo"
                      rows="3"
                      placeholder="¿Cuál es el objetivo principal que se busca alcanzar con este proyecto?"
                      class="form-control"
                      [class.error]="isFieldInvalid('objetivo')"
                    ></textarea>
                    @if (isFieldInvalid('objetivo')) {
                      <span class="error-text">El objetivo es obligatorio (mínimo 30 caracteres)</span>
                    }
                  </div>
                </div>

                <!-- Imagen del proyecto -->
                <div class="form-section">
                  <h2>🖼️ Imagen del Proyecto</h2>
                  
                  <div class="image-upload-section">
                    @if (imagenPreview) {
                      <div class="image-preview">
                        <img [src]="imagenPreview" alt="Preview" />
                        <button type="button" (click)="removeImage()" class="btn-remove-image">
                          ✕ Quitar imagen
                        </button>
                      </div>
                    } @else {
                      <div class="image-placeholder">
                        <span class="placeholder-icon">📁</span>
                        <p>Sin imagen</p>
                      </div>
                    }

                    <div class="file-input-wrapper">
                      <input 
                        type="file" 
                        #fileInput
                        (change)="onFileSelected($event)"
                        accept="image/*"
                        class="file-input"
                        id="imagen"
                      />
                      <label for="imagen" class="btn btn-outline btn-block">
                        📤 {{ imagenPreview ? 'Cambiar' : 'Seleccionar' }} Imagen
                      </label>
                      <p class="helper-text">Formatos: JPG, PNG, GIF (Max 5MB)</p>
                    </div>
                  </div>
                </div>

                <!-- Requisitos -->
                <div class="form-section">
                  <h2>💼 Requisitos del Proyecto</h2>

                  <div class="form-group">
                    <label class="form-label">Disciplinas Requeridas</label>
                    <div class="checkbox-grid">
                      @if (disciplinas && disciplinas.length > 0) {
                        @for (disciplina of disciplinas; track disciplina.id) {
                          <label class="checkbox-label">
                            <input 
                              type="checkbox"
                              [value]="disciplina.id"
                              (change)="onDisciplinaChange($event, disciplina.id)"
                              [checked]="selectedDisciplinas.includes(disciplina.id)"
                            />
                            <span>{{ disciplina.nombre }}</span>
                          </label>
                        }
                      } @else {
                        <p class="helper-text">Cargando disciplinas...</p>
                      }
                    </div>
                    <p class="helper-text">Selecciona las áreas de conocimiento necesarias</p>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Habilidades Requeridas</label>
                    <div class="checkbox-grid">
                      @if (habilidades && habilidades.length > 0) {
                        @for (habilidad of habilidades; track habilidad.id) {
                          <label class="checkbox-label">
                            <input 
                              type="checkbox"
                              [value]="habilidad.id"
                              (change)="onHabilidadChange($event, habilidad.id)"
                              [checked]="selectedHabilidades.includes(habilidad.id)"
                            />
                            <span>{{ habilidad.nombre }}</span>
                          </label>
                        }
                      } @else {
                        <p class="helper-text">Cargando habilidades...</p>
                      }
                    </div>
                    <p class="helper-text">Selecciona las habilidades técnicas necesarias</p>
                  </div>
                </div>
              </div>

              <!-- Columna lateral -->
              <div class="sidebar-column">
                <!-- Estado y colaboradores -->
                <div class="form-section">
                  <h2>⚙️ Configuración</h2>

                  <div class="form-group">
                    <label class="form-label required">Estado del Proyecto</label>
                    <select 
                      formControlName="estado"
                      class="form-control"
                      [class.error]="isFieldInvalid('estado')"
                    >
                      <option value="BORRADOR">📝 Borrador</option>
                      <option value="ACTIVO">✅ Activo</option>
                      <option value="EN_PROGRESO">⚡ En Progreso</option>
                      <option value="COMPLETADO">🎉 Completado</option>
                      <option value="CANCELADO">❌ Cancelado</option>
                    </select>
                    <p class="helper-text">Los proyectos en "Borrador" no son visibles públicamente</p>
                  </div>

                  <div class="form-group">
                    <label class="form-label required">Colaboradores Necesarios</label>
                    <input 
                      type="number" 
                      formControlName="colaboradores_necesarios"
                      min="1"
                      max="20"
                      class="form-control"
                      [class.error]="isFieldInvalid('colaboradores_necesarios')"
                    />
                    @if (isFieldInvalid('colaboradores_necesarios')) {
                      <span class="error-text">Debe ser entre 1 y 20 colaboradores</span>
                    }
                  </div>
                </div>

                <!-- Fechas -->
                <div class="form-section">
                  <h2>📅 Fechas</h2>

                  <div class="form-group">
                    <label class="form-label">Fecha de Inicio</label>
                    <input 
                      type="date" 
                      formControlName="fecha_inicio"
                      class="form-control"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Fecha de Finalización</label>
                    <input 
                      type="date" 
                      formControlName="fecha_fin"
                      class="form-control"
                    />
                  </div>

                  <p class="helper-text">Las fechas son opcionales pero ayudan a organizar el proyecto</p>
                </div>

                <!-- Resumen -->
                <div class="form-section summary-section">
                  <h3>📊 Resumen</h3>
                  <div class="summary-item">
                    <span class="summary-label">Disciplinas:</span>
                    <span class="summary-value">{{ selectedDisciplinas.length }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Habilidades:</span>
                    <span class="summary-value">{{ selectedHabilidades.length }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Colaboradores:</span>
                    <span class="summary-value">{{ proyectoForm.get('colaboradores_necesarios')?.value || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary btn-lg"
                [disabled]="proyectoForm.invalid || submitting"
              >
                @if (submitting) {
                  <span>Guardando...</span>
                } @else {
                  <span>{{ proyectoId ? '💾 Guardar Cambios' : '✨ Crear Proyecto' }}</span>
                }
              </button>
              <a [routerLink]="proyectoId ? ['/proyectos', proyectoId] : ['/proyectos']" class="btn btn-outline btn-lg">
                Cancelar
              </a>
            </div>

            @if (submitError) {
              <div class="alert alert-error">
                <p>{{ submitError }}</p>
              </div>
            }
          </form>
        }
      </div>
    </div>
  `,
  styles: [`
    .proyecto-form-container {
      padding: 2rem 0;
      min-height: calc(100vh - 70px);
    }

    .form-header {
      margin-bottom: 2rem;
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
      color: var(--dark-color);
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: var(--text-light);
      font-size: 1.1rem;
    }

    .proyecto-form {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
      margin-bottom: 2rem;
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

    .form-section {
      padding: 1.5rem;
      background: var(--gray-100);
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }

    .form-section h2 {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
      color: var(--dark-color);
    }

    .form-section h3 {
      font-size: 1.1rem;
      margin-bottom: 1rem;
      color: var(--dark-color);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group:last-child {
      margin-bottom: 0;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--dark-color);
      font-size: 0.95rem;
    }

    .form-label.required::after {
      content: ' *';
      color: var(--danger-color);
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      font-size: 1rem;
      font-family: inherit;
      transition: all 0.3s ease;
      background: white;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(226, 35, 26, 0.1);
    }

    .form-control.error {
      border-color: var(--danger-color);
    }

    .form-control.error:focus {
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }

    textarea.form-control {
      resize: vertical;
      min-height: 80px;
    }

    select.form-control {
      cursor: pointer;
    }

    .error-text {
      display: block;
      color: var(--danger-color);
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }

    .helper-text {
      font-size: 0.85rem;
      color: var(--text-light);
      margin-top: 0.5rem;
      margin-bottom: 0;
    }

    .char-count {
      text-align: right;
      font-size: 0.85rem;
      color: var(--text-light);
      margin-top: 0.25rem;
    }

    /* Image upload */
    .image-upload-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .image-preview {
      position: relative;
      width: 100%;
      height: 300px;
      border-radius: 8px;
      overflow: hidden;
      background: var(--gray-200);
    }

    .image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .btn-remove-image {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.5rem 1rem;
      background: rgba(220, 38, 38, 0.9);
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .btn-remove-image:hover {
      background: var(--danger-color);
    }

    .image-placeholder {
      width: 100%;
      height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--gray-200);
      border: 2px dashed var(--border-color);
      border-radius: 8px;
      color: var(--text-light);
    }

    .placeholder-icon {
      font-size: 4rem;
      margin-bottom: 0.5rem;
      opacity: 0.5;
    }

    .file-input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .file-input {
      display: none;
    }

    /* Checkboxes */
    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: white;
      border: 2px solid var(--border-color);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .checkbox-label:hover {
      border-color: var(--primary-color);
      background: var(--gray-100);
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: var(--primary-color);
    }

    .checkbox-label input[type="checkbox"]:checked + span {
      font-weight: 600;
      color: var(--primary-color);
    }

    /* Summary */
    .summary-section {
      background: var(--primary-light);
      border-color: var(--primary-color);
    }

    .summary-section h3 {
      color: var(--primary-color);
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem;
      background: white;
      border-radius: 6px;
      margin-bottom: 0.5rem;
    }

    .summary-item:last-child {
      margin-bottom: 0;
    }

    .summary-label {
      font-weight: 500;
      color: var(--text-color);
    }

    .summary-value {
      font-weight: 700;
      color: var(--primary-color);
      font-size: 1.1rem;
    }

    /* Form actions */
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      padding-top: 2rem;
      border-top: 2px solid var(--border-color);
    }

    .btn-lg {
      padding: 1rem 2rem;
      font-size: 1.1rem;
      min-width: 200px;
    }

    /* Loading & Error states */
    .loading-state {
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

    .alert {
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .alert-error {
      background-color: #fee2e2;
      color: #991b1b;
      border: 2px solid #fca5a5;
    }

    @media (max-width: 1024px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .sidebar-column {
        order: -1;
      }
    }

    @media (max-width: 768px) {
      .proyecto-form {
        padding: 1.5rem;
      }

      .checkbox-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .btn-lg {
        width: 100%;
      }
    }
  `]
})
export class ProyectoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private proyectoService = inject(ProyectoService);
  private usuarioService = inject(UsuarioService);

  proyectoForm!: FormGroup;
  proyectoId: number | null = null;
  
  disciplinas: Disciplina[] = [];
  habilidades: Habilidad[] = [];
  
  selectedDisciplinas: number[] = [];
  selectedHabilidades: number[] = [];
  
  imagenPreview: string | null = null;
  selectedFile: File | null = null;
  
  loading = false;
  submitting = false;
  error: string | null = null;
  submitError: string | null = null;

  ngOnInit() {
    this.initForm();
    this.loadCatalogs();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.proyectoId = +params['id'];
        this.loadProyecto();
      }
    });
  }

  initForm() {
    const today = new Date().toISOString().split('T')[0];
    
    this.proyectoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      descripcion: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(1000)]],
      objetivo: ['', [Validators.required, Validators.minLength(30), Validators.maxLength(500)]],
      estado: ['BORRADOR', Validators.required],
      colaboradores_necesarios: [3, [Validators.required, Validators.min(1), Validators.max(20)]],
      fecha_inicio: [today],
      fecha_fin: ['']
    });
  }

  loadCatalogs() {
    this.usuarioService.getDisciplinas().subscribe({
      next: (disciplinas) => {
        this.disciplinas = Array.isArray(disciplinas) ? disciplinas : [];
      },
      error: (err) => {
        console.error('Error al cargar disciplinas:', err);
        this.disciplinas = [];
      }
    });

    this.usuarioService.getHabilidades().subscribe({
      next: (habilidades) => {
        this.habilidades = Array.isArray(habilidades) ? habilidades : [];
      },
      error: (err) => {
        console.error('Error al cargar habilidades:', err);
        this.habilidades = [];
      }
    });
  }

  loadProyecto() {
    if (!this.proyectoId) return;

    this.loading = true;
    this.error = null;

    this.proyectoService.getProyecto(this.proyectoId).subscribe({
      next: (proyecto) => {
        this.proyectoForm.patchValue({
          titulo: proyecto.titulo,
          descripcion: proyecto.descripcion,
          objetivo: proyecto.objetivo,
          estado: proyecto.estado,
          colaboradores_necesarios: proyecto.colaboradores_necesarios,
          fecha_inicio: proyecto.fecha_inicio || '',
          fecha_fin: proyecto.fecha_fin || ''
        });

        this.selectedDisciplinas = proyecto.disciplinas_requeridas?.map(d => d.id) || [];
        this.selectedHabilidades = proyecto.habilidades_requeridas?.map(h => h.id) || [];

        if (proyecto.imagen) {
          this.imagenPreview = proyecto.imagen;
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar proyecto:', err);
        this.error = 'No se pudo cargar el proyecto. Puede que no exista o no tengas permisos.';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar tamaño (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        alert('Solo se permiten archivos de imagen');
        return;
      }

      this.selectedFile = file;

      // Preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imagenPreview = null;
    this.selectedFile = null;
  }

  onDisciplinaChange(event: any, disciplinaId: number) {
    if (event.target.checked) {
      this.selectedDisciplinas.push(disciplinaId);
    } else {
      this.selectedDisciplinas = this.selectedDisciplinas.filter(id => id !== disciplinaId);
    }
  }

  onHabilidadChange(event: any, habilidadId: number) {
    if (event.target.checked) {
      this.selectedHabilidades.push(habilidadId);
    } else {
      this.selectedHabilidades = this.selectedHabilidades.filter(id => id !== habilidadId);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.proyectoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.proyectoForm.invalid) {
      Object.keys(this.proyectoForm.controls).forEach(key => {
        this.proyectoForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    this.submitError = null;

    const formData = new FormData();

    // Agregar campos del formulario
    Object.keys(this.proyectoForm.value).forEach(key => {
      const value = this.proyectoForm.value[key];
      if (value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    // Agregar disciplinas y habilidades como múltiples valores (DRF espera esto)
    this.selectedDisciplinas.forEach(id => {
      formData.append('disciplinas_ids', id.toString());
    });
    this.selectedHabilidades.forEach(id => {
      formData.append('habilidades_ids', id.toString());
    });

    // Agregar imagen si hay una nueva
    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }

    const request = this.proyectoId
      ? this.proyectoService.updateProyecto(this.proyectoId, formData)
      : this.proyectoService.createProyecto(formData);

    request.subscribe({
      next: (proyecto) => {
        this.submitting = false;
        alert(this.proyectoId ? '¡Proyecto actualizado exitosamente!' : '¡Proyecto creado exitosamente!');
        this.router.navigate(['/proyectos', proyecto.id]);
      },
      error: (err) => {
        console.error('Error al guardar proyecto:', err);
        this.submitError = err.error?.detail || 'No se pudo guardar el proyecto. Verifica los datos e intenta de nuevo.';
        this.submitting = false;
      }
    });
  }
}
