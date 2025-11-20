import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProyectoChatComponent } from '../proyecto-chat/proyecto-chat.component';

import {
  Firestore,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  collectionData,
  query,
  where
} from '@angular/fire/firestore';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-proyecto-detail',
  standalone: true,
  imports: [
    CommonModule,
    ProyectoChatComponent  // <-- AÑADIR AQUÍ
  ],
  templateUrl: './proyecto-detail.component.html'
})

export class ProyectoDetailComponent implements OnInit {

  // ----------------------------------------------
  // 🔗 INYECCIONES
  // ----------------------------------------------
  public router = inject(Router);   // <--- PÚBLICO para usar en el HTML
  private route = inject(ActivatedRoute);
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  // ----------------------------------------------
  // 📌 VARIABLES DEL COMPONENTE
  // ----------------------------------------------
  proyectoId: string | null = null;
  proyectoData: any = null;

  userData: any = null;                // Datos del usuario logueado
  participantesData: any[] = [];       // Lista de participantes con nombres reales
  yaPostulado: boolean = false;        // Saber si el usuario ya postuló

  isLoading = true;
  errorMessage = '';

  // ----------------------------------------------
  // 🚀 INICIO
  // ----------------------------------------------
  async ngOnInit() {
    this.isLoading = true;

    // Obtener ID del proyecto desde la URL
    this.proyectoId = this.route.snapshot.paramMap.get('id');
    if (!this.proyectoId) {
      this.errorMessage = 'ID de proyecto no válido.';
      this.isLoading = false;
      return;
    }

    // 1️⃣ Obtener datos del usuario
    this.userData = await this.authService.getCurrentUserData();

    // 2️⃣ Cargar datos del proyecto
    await this.cargarProyecto();

    // 3️⃣ Cargar los participantes (si existen)
    if (this.proyectoData?.participantes?.length > 0) {
      await this.cargarParticipantes();
    }

    // 4️⃣ Revisar si el usuario ya postuló
    if (this.userData) {
      this.yaPostulado = this.proyectoData?.participantes?.includes(this.userData.uid);
    }

    this.isLoading = false;
  }

  // ----------------------------------------------
  // 🔍 CARGAR PROYECTO
  // ----------------------------------------------
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
      this.errorMessage = 'Error al cargar el proyecto.';
    }
  }

  // ----------------------------------------------
  // 👥 CARGAR PARTICIPANTES CON NOMBRES
  // ----------------------------------------------
  async cargarParticipantes() {
    try {
      const uids = this.proyectoData.participantes;

      const usersRef = collection(this.firestore, 'usuarios');
      const q = query(usersRef, where('uid', 'in', uids));

      const users = await collectionData(q, { idField: 'uid' }).toPromise();

      this.participantesData = users || [];
    } catch (error) {
      console.error('Error al cargar participantes:', error);
    }
  }

  // ----------------------------------------------
  // 🟩 POSTULAR (solo estudiante)
  // ----------------------------------------------
  async postular() {

    // ❌ Invitado
    if (!this.userData) {
      alert('Debes iniciar sesión para postular.');
      this.router.navigate(['/login']);
      return;
    }

    // ❌ Profesor/Admin
    if (this.userData.role !== 'estudiante') {
      alert('Solo los estudiantes pueden postular a proyectos.');
      return;
    }

    // ✔ Estudiante
    try {
      const proyectoRef = doc(this.firestore, `proyectos/${this.proyectoId}`);
      const userId = this.userData.uid;

      await updateDoc(proyectoRef, {
        participantes: arrayUnion(userId)
      });

      alert('Postulación enviada correctamente.');
      this.yaPostulado = true;

      if (!this.proyectoData.participantes) {
        this.proyectoData.participantes = [];
      }

      this.proyectoData.participantes.push(userId);
      await this.cargarParticipantes();

    } catch (error) {
      console.error('Error al postular:', error);
      alert('Error al postular. Intenta nuevamente.');
    }
  }

  // ----------------------------------------------
  // 🔻 RETIRAR POSTULACIÓN
  // ----------------------------------------------
  async retirarPostulacion() {
    try {
      const proyectoRef = doc(this.firestore, `proyectos/${this.proyectoId}`);
      const userId = this.userData.uid;

      const nuevaLista = this.proyectoData.participantes.filter(
        (id: string) => id !== userId
      );

      await updateDoc(proyectoRef, {
        participantes: nuevaLista
      });

      alert('Has retirado tu postulación.');

      this.yaPostulado = false;
      this.proyectoData.participantes = nuevaLista;

      await this.cargarParticipantes();

    } catch (error) {
      console.error('Error al retirar postulación:', error);
      alert('No se pudo retirar la postulación.');
    }
  }
}
