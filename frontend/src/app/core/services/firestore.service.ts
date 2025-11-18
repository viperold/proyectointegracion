import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Project {
  id?: string;
  title: string;
  description: string;
  ownerUid?: string;
  createdAt: number;
}

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private collectionName = 'projects';

  constructor(private fs: Firestore) {}

  listProjects(): Observable<Project[]> {
    const ref = collection(this.fs, this.collectionName);
    // collectionData agrega automáticamente el 'id' si se lo pedimos
    return collectionData(ref, { idField: 'id' }) as Observable<Project[]>;
  }

  async addProject(p: Omit<Project,'id'>) {
    const ref = collection(this.fs, this.collectionName);
    await addDoc(ref, p);
  }

  async updateProject(id: string, partial: Partial<Project>) {
    const ref = doc(this.fs, `${this.collectionName}/${id}`);
    await updateDoc(ref, partial as any);
  }

  async deleteProject(id: string) {
    const ref = doc(this.fs, `${this.collectionName}/${id}`);
    await deleteDoc(ref);
  }
}