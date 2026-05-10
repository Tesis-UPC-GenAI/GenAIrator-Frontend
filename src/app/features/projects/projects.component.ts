import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { GenerationService } from '../../core/services/generation.service';
import { Observable } from 'rxjs';
import { GenerationRequest } from '../../core/models/generation-request.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent],
  template: `
    <div class="page-container">
      <div class="container">
        <div class="dashboard-header">
          <h1>Mis Proyectos</h1>
          <p class="text-secondary mt-sm">Gestiona todos tus proyectos de generación de código</p>
        </div>

        <div *ngIf="loading" class="loading-container">
          <div class="spinner"></div>
          <p class="text-secondary mt-md">Cargando proyectos...</p>
        </div>

        <div *ngIf="error" class="alert alert-error">
          {{ error }}
        </div>

        <ng-container *ngIf="!loading && !error">
          <div *ngIf="proyectos.length === 0" class="empty-state">
            <div class="empty-state-icon">📦</div>
            <h2 class="empty-state-title">Aún no has creado ningún proyecto</h2>
            <p class="empty-state-description">
              Comienza tu viaje generando código automáticamente desde tus diseños.<br>
              Importa un design system o crea un nuevo proyecto para empezar.
            </p>
            <div class="empty-state-actions">
              <a routerLink="/import-design-system" class="btn btn-primary">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                Importar Design System
              </a>
              <a routerLink="/generate" class="btn btn-secondary">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Nuevo Proyecto
              </a>
            </div>
          </div>

          <div *ngIf="proyectos.length > 0" class="projects-grid">
            <app-card *ngFor="let p of proyectos" class="project-card">
              <div class="project-card-header">
                <div class="project-info">
                  <div class="project-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="project-title">{{ p.framework }}</h3>
                    <p class="project-id">ID: {{ p.id }}</p>
                  </div>
                </div>
                <span
                  class="badge"
                  [ngClass]="{
                    'badge-warning':
                      p.status === 'Pending' ||
                      p.status === 'Processing' ||
                      p.estado === 'Pending' ||
                      p.estado === 'Processing',
                    'badge-success': p.status === 'Completed' || p.estado === 'Completed',
                    'badge-danger': p.status === 'Failed' || p.estado === 'Failed'
                  }"
                  >{{ p.status || p.estado }}</span
                >
              </div>

              <div class="project-meta">
                <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span class="meta-text">{{ p.fechaCreacion | date : 'medium' }}</span>
              </div>

              <div class="project-actions">
                <a
                  class="btn btn-primary btn-sm"
                  [routerLink]="['/results', p.generationRequestId || p.id]"
                >
                  <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  Ver Detalles
                </a>
                <button
                  class="btn btn-secondary btn-sm"
                  (click)="onDownload(p.id || p.generationRequestId)"
                  [disabled]="p.status !== 'Completed'"
                  [title]="p.status !== 'Completed' ? 'El proyecto debe estar completado' : 'Descargar proyecto'"
                >
                  <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Descargar
                </button>
              </div>
            </app-card>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-3xl);
      }

      .empty-state-actions {
        display: flex;
        gap: var(--spacing-md);
        justify-content: center;
        flex-wrap: wrap;
      }

      .btn-icon {
        width: 18px;
        height: 18px;
      }

      .btn-sm {
        padding: var(--spacing-xs) var(--spacing-md);
        font-size: var(--font-size-sm);
      }

      .projects-grid {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: var(--spacing-xl);
      }

      @media (min-width: 768px) {
        .projects-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (min-width: 1024px) {
        .projects-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      .project-card {
        position: relative;
        transition: all var(--transition-slow);
      }

      .project-card:hover {
        transform: translateY(-6px);
      }

      .project-card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--spacing-lg);
        gap: var(--spacing-md);
      }

      .project-info {
        display: flex;
        gap: var(--spacing-md);
        align-items: center;
        flex: 1;
      }

      .project-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-primary-gradient);
        border-radius: var(--radius-lg);
        flex-shrink: 0;
        box-shadow: var(--shadow-colored);
      }

      .project-icon svg {
        width: 24px;
        height: 24px;
        color: white;
      }

      .project-title {
        font-size: var(--font-size-lg);
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
        line-height: 1.2;
      }

      .project-id {
        font-size: var(--font-size-xs);
        color: var(--text-tertiary);
        margin: var(--spacing-xs) 0 0 0;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .project-meta {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-md);
        background: var(--bg-secondary);
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-lg);
      }

      .meta-icon {
        width: 16px;
        height: 16px;
        color: var(--text-tertiary);
        flex-shrink: 0;
      }

      .meta-text {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        font-weight: 500;
      }

      .project-actions {
        display: flex;
        gap: var(--spacing-sm);
        margin-top: auto;
        padding-top: var(--spacing-md);
        border-top: 1px solid var(--border-color);
      }

      .project-actions .btn {
        flex: 1;
        justify-content: center;
      }

      @media (max-width: 640px) {
        .project-actions {
          flex-direction: column;
        }

        .empty-state-actions {
          flex-direction: column;
          width: 100%;
          max-width: 300px;
          margin: 0 auto;
        }

        .empty-state-actions .btn {
          width: 100%;
        }
      }
    `,
  ],
})
export class ProjectsComponent implements OnInit {
  proyectos: GenerationRequest[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private generationService: GenerationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.generationService.getAllRequests().subscribe({
      next: (proyectos) => {
        this.proyectos = proyectos;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando proyectos:', err);
        if (err.status === 401) {
          this.error = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
          this.toastr.error('Sesión expirada');
        } else {
          this.error = 'No se pudieron cargar los proyectos. Por favor, intenta nuevamente.';
          this.toastr.error('Error al cargar proyectos');
        }
        this.loading = false;
      },
    });
  }

  onDownload(id?: number | null) {
    if (!id) return;
    this.generationService.downloadProject(id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `project_${id}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error downloading project', err);
        alert('Error al descargar el proyecto. Revisa la consola para más detalles.');
      },
    });
  }
}
