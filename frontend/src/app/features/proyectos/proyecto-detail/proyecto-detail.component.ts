import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
  Firestore,
  doc,
  getDoc,
  updateDoc,
  arrayUnion
} from '@angular/fire/firestore';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-proyecto-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyecto-detail.component.html'
})
export class ProyectoDetailComponent implements OnInit {

  // 🔄 INYECCIONES (Router ahora es público)
  public router = inject(Router);
  private route = inject(ActivatedRoute);
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  proyectoId: string | null = null;
  proyectoData: any = null;

  userData: any = null;   // Datos del usuario logueado + rol
  isLoading = true;
  errorMessage = '';

  // --------------------------------------------------------
  // 🟦 INICIO DEL COMPONENTE
  // --------------------------------------------------------
  async ngOnInit() {
    this.isLoading = true;

    // Obtener ID del proyecto
    this.proyectoId = this.route.snapshot.paramMap.get('id');

    if (!this.proyectoId) {
      this.errorMessage = 'ID de proyecto no válido.';
      this.isLoading = false;
      return;
    }

    // 1️⃣ Obtener datos del usuario autenticado
    this.userData = await this.authService.getCurrentUserData();

    // 2️⃣ Obtener datos del proyecto
    await this.cargarProyecto();

    this.isLoading = false;
  }

  // --------------------------------------------------------
  // 📄 Cargar proyecto desde Firestore
  // --------------------------------------------------------
  async cargarProyecto() {
    try {
      const proyectoRef = doc(this.firestore, `proyectos/${this.proyectoId}`);
      const snapshot = await getDoc(proyectoRef);

      if (!snapshot.exists()) {
        this.errorMessage = 'El proyecto no existe.';
        return;
      }

      this.proyectoData = snapshot.data();
    } catch (error) {
      console.error('Error al cargar proyecto:', error);
      this.errorMessage = 'No se pudo cargar el proyecto.';
    }
  }

  // --------------------------------------------------------
  // 🟢 POSTULAR (solo ESTUDIANTES)
  // --------------------------------------------------------
  async postular() {

    // ❌ INVITADO
    if (!this.userData) {
      alert('Debes iniciar sesión para postular a un proyecto.');
      this.router.navigate(['/login']);
      return;
    }

    // ❌ PROFESOR o ADMIN
    if (this.userData.role !== 'estudiante') {
      alert('Solo los estudiantes pueden postular a proyectos.');
      return;
    }

    // ✔ ESTUDIANTE → postulación válida
    try {
      const proyectoRef = doc(this.firestore, `proyectos/${this.proyectoId}`);
      const userId = this.userData.uid;

      await updateDoc(proyectoRef, {
        participantes: arrayUnion(userId)
      });

      alert('Te has postulado correctamente.');
    } catch (error) {
      console.error('Error al postular:', error);
      alert('Ocurrió un error al postular. Inténtalo nuevamente.');
    }
  }
}
