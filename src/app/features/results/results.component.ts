import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { GenerationService } from '../../core/services/generation.service';
import { GenerationRequest } from '../../core/models/generation-request.model';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent],
  template: `
    <div class="page-container">
      <div class="container">
        <div style="max-width: 800px; margin: 0 auto;">
          <app-card class="text-center" *ngIf="request">
            <div class="success-icon mb-lg"></div>
            <h1 class="text-3xl font-bold mb-md">Código generado exitosamente!</h1>
            <p class="text-secondary mb-xl">
              Tu código ha sido generado y está listo para usar en tu proyecto.
            </p>

            <div class="grid grid-cols-1 grid-cols-md-3 gap-md mb-xl">
              <div class="stat-item">
                <span class="stat-value">{{ request.componentesGenerados || 0 }}</span>
                <span class="stat-label">Componentes</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ request.lineasDeCodigo || 0 }}</span>
                <span class="stat-label">Líneas de código</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ tokensApplied }}</span>
                <span class="stat-label">Tokens aplicados</span>
              </div>
            </div>

            <div
              class="flex gap-md justify-center flex-col"
              style="max-width: 400px; margin: 0 auto;"
            >
              <button class="btn btn-primary" [disabled]="!canDownload" (click)="onDownload()">
                Descargar Código
              </button>
              <button class="btn btn-danger" (click)="onDelete()">Eliminar Proyecto</button>
              <a routerLink="/dashboard" class="btn btn-secondary">Volver al Dashboard</a>
            </div>
          </app-card>

          <app-card class="mt-lg" *ngIf="request">
            <h2 class="text-lg font-semibold mb-md">Contenido generado</h2>
            <ul class="text-sm text-secondary" style="list-style: none; padding: 0;">
              <li class="mb-sm">{{ request.framework }} - {{ request.lenguaje || 'N/A' }}</li>
              <li class="mb-sm">Estilos: {{ request.estilo || 'N/A' }}</li>
              <li class="mb-sm">Incluir tests: {{ request.incluirTests ? 'Sí' : 'No' }}</li>
              <li class="mb-sm">Incluir doc: {{ request.incluirDoc ? 'Sí' : 'No' }}</li>
            </ul>
          </app-card>
        </div>
      </div>
    </div>
  `,
})
export class ResultsComponent implements OnInit {
  request?: GenerationRequest;
  canDownload = false;

  // Placeholder stats (could be improved to parse real info)
  componentsCount = 0;
  linesOfCode = 0;
  tokensApplied = 0;

  constructor(
    private route: ActivatedRoute,
    private generationService: GenerationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      // no id - go back
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadRequest(id);
  }

  loadRequest(id: number) {
    this.generationService.getAllRequests().subscribe({
      next: (list) => {
        const r = list.find((x) => x.generationRequestId === id || x.id === id);
        if (r) {
          this.request = r;
          this.canDownload = (r.estado || r.status || '').toLowerCase() === 'completed';
          // Populate displayed metrics from the request if available
          this.componentsCount = r.componentesGenerados ?? 0;
          this.linesOfCode = r.lineasDeCodigo ?? 0;
        } else {
          // not found - redirect
          this.router.navigate(['/projects']);
        }
      },
      error: () => this.router.navigate(['/dashboard']),
    });
  }

  onDownload() {
    if (!this.request) return;
    const id = this.request.generationRequestId || (this.request as any).id;
    this.generationService.downloadProject(Number(id)).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `project_${id}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('Error al descargar el proyecto'),
    });
  }

  onDelete() {
    if (!this.request) return;
    if (!confirm('¿Eliminar este proyecto generado? Esta acción no se puede deshacer.')) return;

    const id = this.request.generationRequestId || (this.request as any).id;
    this.generationService.deleteProject(Number(id)).subscribe({
      next: () => this.router.navigate(['/projects']),
      error: () => alert('No se pudo eliminar el proyecto'),
    });
  }
}
