import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface Usuario {
  uid: string;
  nombre: string;
  apellido: string;
  email: string;
  role: 'estudiante' | 'profesor' | 'administrador' | 'invitado' | string;
  carrera?: string;
  semestre?: number | string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
})
export class UsuariosComponent implements OnInit {
  private firestore = inject(Firestore);

  usuarios$: Observable<Usuario[]> | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.isLoading = true;
    const ref = collection(this.firestore, 'usuarios');

    this.usuarios$ = collectionData(ref, { idField: 'uid' }) as Observable<Usuario[]>;

    this.usuarios$.subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
        this.errorMessage = 'No se pudieron cargar los usuarios.';
        this.isLoading = false;
      },
    });
  }

  async actualizarRol(uid: string, nuevoRol: string) {
    try {
      const userRef = doc(this.firestore, `usuarios/${uid}`);
      await updateDoc(userRef, { role: nuevoRol });
      alert('Rol actualizado correctamente.');
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      alert('No se pudo actualizar el rol, inténtalo nuevamente.');
    }
  }
}
