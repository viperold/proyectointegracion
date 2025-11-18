// Componente Navbar
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="container">
        <div class="navbar-content">
          <a routerLink="/" class="logo">
            <div class="logo-container">
              <div class="logo-icon">I</div>
              <div class="logo-text">
                <span class="logo-inacap">INACAP</span>
                <span class="logo-campus">Valdivia</span>
              </div>
            </div>
          </a>
          
          <div class="nav-links">
            <a routerLink="/proyectos" routerLinkActive="active" class="nav-link">Proyectos</a>
            
            @if (authService.isAuthenticated()) {
              <a routerLink="/mis-proyectos" routerLinkActive="active" class="nav-link">Mis Proyectos</a>
              <a routerLink="/proyectos/nuevo" routerLinkActive="active" class="btn btn-primary btn-sm">
                + Nuevo Proyecto
              </a>
              <a routerLink="/perfil" routerLinkActive="active" class="nav-link">Perfil</a>
              <button (click)="logout()" class="btn btn-outline btn-sm">Cerrar Sesión</button>
            } @else {
              <a routerLink="/login" routerLinkActive="active" class="nav-link">Iniciar Sesión</a>
              <a routerLink="/registro" routerLinkActive="active" class="btn btn-primary btn-sm">Registrarse</a>
            }
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: var(--primary-color);
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      z-index: 1000;
      height: 70px;
    }

    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 70px;
    }

    .logo {
      text-decoration: none;
      transition: opacity 0.3s ease;
    }

    .logo:hover {
      opacity: 0.9;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-icon {
      width: 45px;
      height: 45px;
      background: white;
      color: var(--primary-color);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.75rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .logo-text {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .logo-inacap {
      color: white;
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .logo-campus {
      color: rgba(255,255,255,0.9);
      font-size: 0.85rem;
      font-weight: 500;
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .nav-link {
      color: white;
      font-weight: 500;
      padding: 0.5rem 0;
      position: relative;
      transition: opacity 0.3s ease;
    }

    .nav-link:hover {
      opacity: 0.85;
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: white;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      border-radius: 6px;
      font-weight: 600;
    }

    .btn-outline {
      background: transparent;
      color: white;
      border: 2px solid white;
    }

    .btn-outline:hover {
      background: white;
      color: var(--primary-color);
    }

    @media (max-width: 768px) {
      .nav-links {
        gap: 0.75rem;
      }

      .logo-inacap {
        font-size: 1.25rem;
      }

      .logo-campus {
        font-size: 0.75rem;
      }

      .nav-link {
        font-size: 0.875rem;
      }
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
