import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  doc,
  getDoc
} from '@angular/fire/firestore';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-proyecto-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proyecto-chat.component.html'
})
export class ProyectoChatComponent implements OnInit {

  @Input() proyectoId!: string;

  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  mensajes: any[] = [];
  nuevoMensaje: string = '';
  userData: any = null;

  async ngOnInit() {
    this.userData = await this.authService.getCurrentUserData();
    this.cargarChat();
  }

  // 📥 Cargar mensajes en tiempo real
  cargarChat() {
    const ref = collection(this.firestore, `proyectos/${this.proyectoId}/chat`);
    const q = query(ref, orderBy('fecha', 'asc'));

    collectionData(q, { idField: 'id' }).subscribe((mensajes) => {
      this.mensajes = mensajes;
    });
  }

  // ➕ Enviar mensaje
  async enviarMensaje() {
    if (!this.nuevoMensaje.trim()) return;

    const ref = collection(this.firestore, `proyectos/${this.proyectoId}/chat`);

    await addDoc(ref, {
      mensaje: this.nuevoMensaje,
      enviadoPor: this.userData.uid,
      nombre: `${this.userData.nombre} ${this.userData.apellido}`,
      fecha: serverTimestamp()
    });

    this.nuevoMensaje = '';
  }
}
