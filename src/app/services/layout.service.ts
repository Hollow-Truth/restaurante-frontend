import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  // Usamos 'Signals' de Angular (o BehaviorSubject) para reactividad instantánea
  title = signal<string>('Dashboard'); 
  
  // Estado del Sidebar Móvil
  sidebarVisible = signal<boolean>(false);

  setTitle(newTitle: string) {
    this.title.set(newTitle);
  }

  toggleSidebar() {
    this.sidebarVisible.update(v => !v);
  }
}