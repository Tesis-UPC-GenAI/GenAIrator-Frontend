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
          <!-- Error view when generation failed -->
          <app-card
            class="text-center mb-lg"
            *ngIf="request && (request.estado || request.status) === 'Failed'"
          >
            <div class="error-icon mb-lg"></div>
            <h2 class="text-2xl font-bold mb-md">Error al generar código</h2>
            <p class="text-secondary mb-md error-message">
              {{ request.errorMessage || 'Ocurrió un error inesperado durante la generación.' }}
            </p>
            <div class="flex gap-md justify-center">
              <button class="btn btn-danger" (click)="onDelete()">Eliminar Proyecto</button>
              <a routerLink="/dashboard" class="btn btn-secondary">Volver al Dashboard</a>
            </div>
          </app-card>

          <!-- Normal success/content view -->
          <app-card
            class="text-center"
            *ngIf="request && (request.estado || request.status) !== 'Failed'"
          >
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
                <span class="stat-value">{{ request.totalTokens || 0 }}</span>
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

          <app-card
            class="mt-lg"
            *ngIf="request && (request.estado || request.status) !== 'Failed'"
          >
            <h2 class="text-lg font-semibold mb-md">Contenido generado</h2>
            <ul class="text-sm text-secondary" style="list-style: none; padding: 0;">
              <li class="mb-sm">{{ request.framework }} - {{ request.lenguaje || 'N/A' }}</li>
              <li class="mb-sm">Estilos: {{ request.estilo || 'N/A' }}</li>
              <li class="mb-sm">Incluir tests: {{ request.incluirTests ? 'Sí' : 'No' }}</li>
              <li class="mb-sm">Incluir doc: {{ request.incluirDoc ? 'Sí' : 'No' }}</li>
              <li class="mb-sm">Tokens de Prompt: {{ request.promptTokens || 0 }}</li>
              <li class="mb-sm">Tokens de Salida: {{ request.completionTokens || 0 }}</li>
            </ul>
          </app-card>
          <app-card
            class="mt-md"
            *ngIf="request && (request.estado || request.status) !== 'Failed'"
          >
            <h2 class="text-lg font-semibold mb-md">Validación externa</h2>
            <ul class="text-sm text-secondary" style="list-style: none; padding: 0;">
              <li class="mb-sm">Sonar Bugs: {{ request.sonarBugs ?? 'N/A' }}</li>
              <li class="mb-sm">
                Sonar Vulnerabilities: {{ request.sonarVulnerabilities ?? 'N/A' }}
              </li>
              <li class="mb-sm">Sonar Code Smells: {{ request.sonarCodeSmells ?? 'N/A' }}</li>
              <li class="mb-sm">
                Lighthouse Performance: {{ request.lighthousePerformanceScore ?? 'N/A' }}
              </li>
              <li class="mb-sm">
                Lighthouse Accessibility: {{ request.lighthouseAccessibilityScore ?? 'N/A' }}
              </li>
            </ul>
          </app-card>
          <app-card
            class="mt-md"
            *ngIf="
              request &&
              (request.estado || request.status) !== 'Failed' &&
              request.generationLogs?.length
            "
          >
            <h2 class="text-lg font-semibold mb-md">Registro de generación</h2>
            <ul class="text-sm text-secondary" style="list-style: none; padding: 0;">
              <li *ngFor="let log of request.generationLogs" class="mb-sm">
                <strong>{{ log.timestamp | date : 'short' }}</strong>
                <span class="ml-sm text-muted">[{{ log.logLevel || 'Info' }}]</span>
                <div>{{ log.message }}</div>
              </li>
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
    this.generationService.getStatus(id).subscribe({
      next: (r) => {
        if (r) {
          this.request = r;
          this.canDownload = (r.estado || r.status || '').toLowerCase() === 'completed';
          // Populate displayed metrics from the request if available
          this.componentsCount = r.componentesGenerados ?? 0;
          this.linesOfCode = r.lineasDeCodigo ?? 0;
        } else {
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
