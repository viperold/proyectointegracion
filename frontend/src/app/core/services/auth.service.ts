import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {}

  // 🔹 1. Registrar usuario (Auth + Firestore)
  register(email: string, password: string, extraData?: any): Observable<User> {
  return from(
    (async () => {
      // 🔐 Normalizar y validar dominio
      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail.endsWith('@inacapmail.cl')) {
        // Lanzamos error: esto llegará al .subscribe(error) del componente
        throw new Error('Solo se permiten correos @inacapmail.cl');
      }

      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        normalizedEmail,
        password
      );
      const user = userCredential.user;

      // Actualizar displayName si viene nombre + apellido
      if (extraData?.nombre && extraData?.apellido) {
        await updateProfile(user, {
          displayName: `${extraData.nombre} ${extraData.apellido}`,
        });
      }

      // Guardar/actualizar en Firestore
      const userDocRef = doc(this.firestore, `usuarios/${user.uid}`);
      await setDoc(userDocRef, {
        uid: user.uid,
        nombre: extraData?.nombre || '',
        apellido: extraData?.apellido || '',
        email: normalizedEmail,
        carrera: extraData?.carrera || '',
        semestre: extraData?.semestre || 1,
        telefono: extraData?.telefono || '',
        bio: extraData?.bio || '',
        avatar: extraData?.avatar || '',
        habilidades: extraData?.habilidades || [],
        is_active: true,
        date_joined: new Date().toISOString(),
      });

      return user;
    })()
  );
}

  // 🔹 2. Iniciar sesión
  login(email: string, password: string): Observable<User> {
  return from(
    (async () => {
      const normalizedEmail = email.trim().toLowerCase();

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

  // 🔹 3. Cerrar sesión
  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  // 🔹 4. Obtener el usuario autenticado actual (una vez)
  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  // 🔹 5. Obtener flujo reactivo del usuario (para Observables)
  getCurrentUser$(): Observable<User | null> {
    return new Observable((subscriber) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        subscriber.next(user);
      });
      return { unsubscribe };
    });
  }

  // 🔹 6. Saber si hay un usuario autenticado
  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  // 🔹 7. Token de autenticación (opcional para backend)
  async getToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    return user ? await user.getIdToken() : null;
  }

  // 🔹 8. Actualizar datos del perfil (Firestore)
  updateProfile(data: any): Observable<void> {
    return from(
      (async () => {
        const user = this.auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        const userDocRef = doc(this.firestore, `usuarios/${user.uid}`);
        const existing = await getDoc(userDocRef);

        if (existing.exists()) {
          await setDoc(userDocRef, { ...existing.data(), ...data }, { merge: true });
        } else {
          await setDoc(userDocRef, { uid: user.uid, ...data });
        }
      })()
    );
  }
}