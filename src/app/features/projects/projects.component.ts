import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { GenerationService } from '../../core/services/generation.service';
import { Observable } from 'rxjs';
import { GenerationRequest } from '../../core/models/generation-request.model';

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

        <ng-container *ngIf="proyectos$ | async as proyectos">
          <div *ngIf="proyectos.length === 0" class="empty-state">
            <div class="empty-state-icon">📦</div>
            <h2 class="empty-state-title">No tienes proyectos todavía</h2>
            <p class="empty-state-description">
              Comienza creando tu primer proyecto o importando un design system.
            </p>
            <div class="flex gap-md justify-center">
              <a routerLink="/import-design-system" class="btn btn-primary">
                Importar Design System
              </a>
              <a routerLink="/generate" class="btn btn-secondary"> Nuevo Proyecto </a>
            </div>
          </div>

          <div *ngIf="proyectos.length > 0" class="grid grid-cols-1 grid-cols-md-2 grid-cols-lg-3">
            <app-card *ngFor="let p of proyectos" class="card-interactive">
              <div class="flex justify-between items-center mb-md">
                <h3 class="text-lg font-semibold">{{ p.framework }} - {{ p.id }}</h3>
                <span
                  class="badge"
                  [ngClass]="{
                    'badge-warning':
                      p.status === 'Pending' ||
                      p.status === 'Processing' ||
                      p.estado === 'Pending' || p.estado === 'Processing',
                    'badge-success': p.status === 'Completed' || p.estado === 'Completed',
                    'badge-danger': p.status === 'Failed' || p.estado === 'Failed'
                  }"
                  >{{ p.status || p.estado }}</span
                >
              </div>
              <p class="text-secondary mb-lg text-sm">
                Generado: {{ p.fechaCreacion | date : 'short' }}
              </p>
              <div class="flex gap-sm">
                <a
                  class="btn btn-primary"
                  [routerLink]="['/results', p.generationRequestId || p.id]"
                  >Ver</a
                >
                <button
                  class="btn btn-secondary"
                  (click)="onDownload(p.id || p.generationRequestId)"
                  [disabled]="p.status !== 'Completed'"
                >
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
      /* Estilos específicos si se necesitan */
    `,
  ],
})
export class ProjectsComponent implements OnInit {
  proyectos$!: Observable<GenerationRequest[]>;

  constructor(private generationService: GenerationService) {}

  ngOnInit(): void {
    this.proyectos$ = this.generationService.getAllRequests();
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
