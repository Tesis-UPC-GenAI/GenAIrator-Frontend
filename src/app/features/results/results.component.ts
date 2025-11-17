import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { GenerationService } from '../../core/services/generation.service';
import { GenerationRequest } from '../../core/models/generation-request.model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { Observable } from 'rxjs';

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
            <div *ngIf="request && request.gitHubRepoUrl" style="margin-top:12px;">
              <a [href]="request.gitHubRepoUrl" target="_blank" class="btn btn-link"
                >Ver repositorio en GitHub</a
              >
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
              <button
                *ngIf="request && (request.estado || request.status) === 'Completed'"
                class="btn btn-outline-primary"
                (click)="onPushToGitHub()"
                [disabled]="!(currentUser$ | async)?.gitHubPatExists || isPushing"
                [title]="
                  !(currentUser$ | async)?.gitHubPatExists
                    ? 'Por favor, añade tu Token PAT en Configuración para subir a GitHub'
                    : null
                "
              >
                {{
                  isPushing
                    ? 'Subiendo...'
                    : request.gitHubRepoUrl
                    ? 'Volver a Subir a GitHub'
                    : 'Subir a GitHub'
                }}
              </button>
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
  currentUser$?: Observable<User | null>;
  isPushing = false;
  private pollTimer: number | null = null;

  // Placeholder stats (could be improved to parse real info)
  componentsCount = 0;
  linesOfCode = 0;
  tokensApplied = 0;

  constructor(
    private route: ActivatedRoute,
    private generationService: GenerationService,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      // no id - go back
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadRequest(id);

    // subscribe to reactive current user observable so template updates automatically
    this.currentUser$ = this.userService.currentUser$;
    // trigger an initial fetch to populate the subject if needed
    this.userService.getMe().subscribe({ next: () => {}, error: () => {} });
  }

  ngOnDestroy(): void {
    this.stopPolling();
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
          // If still processing, start polling for status updates
          const status = (r.estado || r.status || '').toLowerCase();
          if (status !== 'completed' && status !== 'failed') {
            this.startPolling(id);
          } else {
            this.stopPolling();
          }
        } else {
          this.router.navigate(['/projects']);
        }
      },
      error: () => this.router.navigate(['/dashboard']),
    });
  }

  private refreshStatus(id: number) {
    this.generationService.getStatus(id).subscribe({
      next: (r) => {
        if (r) {
          this.request = r;
          this.canDownload = (r.estado || r.status || '').toLowerCase() === 'completed';
          if (
            (r.estado || r.status || '').toLowerCase() === 'completed' ||
            (r.estado || r.status || '').toLowerCase() === 'failed'
          ) {
            this.stopPolling();
          }
        }
      },
      error: () => {
        // ignore polling errors for now
      },
    });
  }

  private startPolling(id: number) {
    if (this.pollTimer) return;
    this.pollTimer = window.setInterval(() => this.refreshStatus(id), 3000);
  }

  private stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  onPushToGitHub() {
    if (!this.request) return;
    const id = this.request.generationRequestId || (this.request as any).id;
    const confirmMessage = this.request.gitHubRepoUrl
      ? 'El repositorio ya existe en GitHub. Esto reemplazará el repo existente. ¿Continuar?'
      : '¿Subir este proyecto a GitHub usando tu PAT guardado?';

    if (!confirm(confirmMessage)) return;

    // Notify user upload is starting
    this.toastr.info('Subiendo a GitHub, por favor espera...');
    this.isPushing = true;

    this.generationService.pushToGitHub(Number(id)).subscribe({
      next: (res) => {
        this.isPushing = false;
        this.toastr.success('¡Repositorio subido correctamente!');
        // refresh request data to show repo URL
        this.loadRequest(Number(id));
      },
      error: (err) => {
        this.isPushing = false;
        const msg = err && err.error ? err.error : 'Error al subir a GitHub';
        this.toastr.error(msg);
      },
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
