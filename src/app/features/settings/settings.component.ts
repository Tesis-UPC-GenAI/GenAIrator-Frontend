import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="container settings-container">
        <div class="settings-header">
          <h1 class="text-3xl font-bold text-gradient">Configuración</h1>
          <p class="text-secondary mt-md">
            Gestiona tus preferencias y configuración de la plataforma
          </p>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">GitHub Personal Access Token</h2>
          </div>
          <div class="card-body">
            <div class="info-box">
              <svg class="info-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
              <div class="info-text">
                <strong>¿Qué es un PAT?</strong>
                <p>El Personal Access Token te permite subir repositorios generados directamente a tu cuenta de GitHub.</p>
              </div>
            </div>

            <div class="form-group">
              <label for="pat" class="form-label">
                <span class="label-text">GitHub PAT</span>
                <span class="label-badge">Opcional</span>
              </label>
              <div class="input-wrapper">
                <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <input
                  id="pat"
                  [(ngModel)]="pat"
                  type="password"
                  class="form-input input-with-icon"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
              </div>
              <small class="form-help">
                Tu token se almacena de forma segura.
                <a href="https://github.com/settings/tokens" target="_blank" rel="noopener" class="link-primary">
                  Crear un nuevo token
                </a>
              </small>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary" (click)="save()">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Guardar Token
            </button>
            <button class="btn btn-secondary" (click)="clear()">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Borrar Token
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 700px;
      margin: 0 auto;
    }

    .settings-header {
      margin-bottom: var(--spacing-3xl);
      text-align: center;
    }

    .info-box {
      display: flex;
      gap: var(--spacing-md);
      padding: var(--spacing-lg);
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(6, 182, 212, 0.03) 100%);
      border: 2px solid rgba(6, 182, 212, 0.2);
      border-radius: var(--radius-lg);
      margin-bottom: var(--spacing-xl);
      align-items: flex-start;
    }

    .info-icon {
      width: 24px;
      height: 24px;
      color: var(--color-info);
      flex-shrink: 0;
      margin-top: 2px;
    }

    .info-text {
      flex: 1;
      color: var(--text-primary);
    }

    .info-text strong {
      display: block;
      font-weight: 700;
      margin-bottom: var(--spacing-xs);
      color: var(--color-info);
    }

    .info-text p {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.6;
    }

    .form-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-sm);
    }

    .label-text {
      font-size: var(--font-size-base);
      font-weight: 700;
      color: var(--text-primary);
    }

    .label-badge {
      font-size: var(--font-size-xs);
      font-weight: 600;
      padding: var(--spacing-xs) var(--spacing-sm);
      background: linear-gradient(135deg, var(--color-secondary) 0%, #475569 100%);
      color: white;
      border-radius: var(--radius-full);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: var(--spacing-lg);
      width: 20px;
      height: 20px;
      color: var(--text-tertiary);
      pointer-events: none;
      z-index: 1;
    }

    .input-with-icon {
      padding-left: calc(var(--spacing-lg) + 32px);
      font-family: 'Courier New', monospace;
      font-size: var(--font-size-sm);
      letter-spacing: 0.5px;
    }

    .form-help {
      display: block;
      margin-top: var(--spacing-sm);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .btn-icon {
      width: 18px;
      height: 18px;
      margin-right: var(--spacing-xs);
    }

    .card-footer {
      margin-top: 0;
      display: flex;
      gap: var(--spacing-md);
      flex-wrap: wrap;
    }

    .card-footer .btn {
      flex: 1;
      min-width: 160px;
      justify-content: center;
    }

    @media (max-width: 640px) {
      .card-footer {
        flex-direction: column;
      }

      .card-footer .btn {
        width: 100%;
      }

      .info-box {
        flex-direction: column;
        text-align: center;
      }

      .info-icon {
        margin: 0 auto;
      }
    }
  `],
})
export class SettingsComponent {
  pat: string | null = null;

  constructor(private userService: UserService, private toastr: ToastrService) {}

  save() {
    this.userService.savePat(this.pat).subscribe({
      next: () => {
        this.toastr.success('PAT guardado correctamente');
        this.userService.getMe().subscribe({ next: () => {}, error: () => {} });
      },
      error: () => this.toastr.error('Error guardando el PAT'),
    });
  }

  clear() {
    this.pat = null;
    this.userService.savePat(null).subscribe({
      next: () => {
        this.toastr.success('PAT eliminado');
        this.userService.getMe().subscribe({ next: () => {}, error: () => {} });
      },
      error: () => this.toastr.error('Error eliminando el PAT'),
    });
  }
}
