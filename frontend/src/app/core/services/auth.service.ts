import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';

import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    console.log('AuthService inicializado');
  }

  // ----------------------------------------------------
  // 🔐 REGISTRO DE USUARIO
  // ----------------------------------------------------
  register(email: string, password: string, extraData?: any): Observable<User> {
    return from(
      (async () => {
        // Normalizar correo
        const normalizedEmail = email.trim().toLowerCase();

        // Validar dominio
        if (!normalizedEmail.endsWith('@inacapmail.cl')) {
          throw new Error('Solo se permiten correos @inacapmail.cl');
        }

        // Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          this.auth,
          normalizedEmail,
          password
        );

        const user = userCredential.user;

        // Actualizar displayName si hay nombre/apellido
        if (extraData?.nombre && extraData?.apellido) {
          await updateProfile(user, {
            displayName: `${extraData.nombre} ${extraData.apellido}`,
          });
        }

        // Guardar datos del usuario en Firestore
        const userDocRef = doc(this.firestore, `usuarios/${user.uid}`);

        await setDoc(userDocRef, {
          uid: user.uid,
          nombre: extraData?.nombre || '',
          apellido: extraData?.apellido || '',
          email: normalizedEmail,
          carrera: extraData?.carrera || '',
          semestre: extraData?.semestre || '',
          telefono: extraData?.telefono || '',
          bio: extraData?.bio || '',
          avatar: extraData?.avatar || '',
          habilidades: extraData?.habilidades || [],
          role: 'estudiante', // 🔥 rol por defecto
          is_active: true,
          date_joined: new Date().toISOString(),
        });

        return user;
      })()
    );
  }

  // ----------------------------------------------------
  // 🔓 LOGIN
  // ----------------------------------------------------
  login(email: string, password: string): Observable<User> {
    return from(
      (async () => {
        const normalizedEmail = email.trim().toLowerCase();

        // Validar dominio antes del login
        if (!normalizedEmail.endsWith('@inacapmail.cl')) {
          throw new Error('Solo se permiten correos @inacapmail.cl');
        }

        const userCredential = await signInWithEmailAndPassword(
          this.auth,
          normalizedEmail,
          password
        );

        return userCredential.user;
      })()
    );
  }

  // ----------------------------------------------------
  // 🚪 LOGOUT
  // ----------------------------------------------------
  logout(): Promise<void> {
    return signOut(this.auth);
  }

  // ----------------------------------------------------
  // 👤 OBTENER DATOS COMPLETOS DEL USUARIO (INCLUYE ROL)
  // ----------------------------------------------------
  async getCurrentUserData(): Promise<any | null> {
    const current = this.auth.currentUser;

    if (!current) {
      return null;
    }

    const userDocRef = doc(this.firestore, `usuarios/${current.uid}`);
    const snapshot = await getDoc(userDocRef);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data();
  }

  // ----------------------------------------------------
  // 🔄 OBSERVAR CAMBIOS DE AUTENTICACIÓN
  // ----------------------------------------------------
  onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }
}
