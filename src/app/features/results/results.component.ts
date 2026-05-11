import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { GenerationService } from '../../core/services/generation.service';
import { GenerationRequest } from '../../core/models/generation-request.model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { Observable } from 'rxjs';
import { ConfirmService } from '../../core/services/confirm.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})

export class ResultsComponent implements OnInit, OnDestroy {
  request?: GenerationRequest;
  canDownload = false;
  currentUser$?: Observable<User | null>;
  isPushing = false;
  private pollTimer: number | null = null;

  componentsCount = 0;
  linesOfCode = 0;
  tokensApplied = 0;

  get mainTitle(): string {
    const status = (this.request?.estado || this.request?.status || '').toLowerCase();
    if (status === 'completed') return 'Código generado exitosamente';
    if (status === 'processing') return 'Generando tu proyecto...';
    if (status === 'failed') return 'Error en la generación';
    return 'Detalles del proyecto';
  }

  get subtitle(): string {
    const status = (this.request?.estado || this.request?.status || '').toLowerCase();
    if (status === 'completed') return 'Tu proyecto ha sido generado, validado y está listo para descargar o continuar editando.';
    if (status === 'processing') return 'Estamos trabajando en la creación de tu código. Por favor, espera un momento.';
    if (status === 'failed') return 'Hubo un problema al procesar tu solicitud. Revisa los logs para más detalles.';
    return '';
  }

  constructor(
    private route: ActivatedRoute,
    private generationService: GenerationService,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadRequest(id);

    this.currentUser$ = this.userService.currentUser$;
    this.userService.getMe().subscribe({ next: () => {}, error: () => {} });
  }

  copyLog() {
    if (!this.request || !this.request.generationLogs) return;
    const logText = this.request.generationLogs
      .map(l => `${l.timestamp} [${l.logLevel || 'Info'}] ${l.message}`)
      .join('\n');
    
    navigator.clipboard.writeText(logText).then(() => {
      this.toastr.success('Log copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar log: ', err);
      this.toastr.error('No se pudo copiar el log');
    });
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
          this.componentsCount = r.componentesGenerados ?? 0;
          this.linesOfCode = r.lineasDeCodigo ?? 0;
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

  async onPushToGitHub() {
    if (!this.request) return;
    const id = this.request.generationRequestId || (this.request as any).id;
    
    const confirmed = await this.confirmService.confirm({
      title: 'Subir a GitHub',
      message: this.request.gitHubRepoUrl
        ? 'El repositorio ya existe en GitHub. Esto reemplazará el repo existente. ¿Continuar?'
        : '¿Subir este proyecto a GitHub usando tu PAT guardado?',
      confirmText: 'Subir Proyecto',
      type: 'info'
    });

    if (!confirmed) return;

    this.toastr.info('Subiendo a GitHub, por favor espera...');
    this.isPushing = true;

    this.generationService.pushToGitHub(Number(id)).subscribe({
      next: (res) => {
        this.isPushing = false;
        this.toastr.success('¡Repositorio subido correctamente!');
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
      error: () => this.toastr.error('Error al descargar el proyecto'),
    });
  }

  async onDelete() {
    if (!this.request) return;
    
    const confirmed = await this.confirmService.confirm({
      title: 'Eliminar Proyecto',
      message: '¿Estás seguro de que deseas eliminar este proyecto generado? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar definitivamente',
      type: 'danger'
    });

    if (!confirmed) return;

    const id = this.request.generationRequestId || (this.request as any).id;
    this.generationService.deleteProject(Number(id)).subscribe({
      next: () => {
        this.toastr.success('Proyecto eliminado correctamente');
        this.router.navigate(['/projects']);
      },
      error: () => this.toastr.error('No se pudo eliminar el proyecto'),
    });
  }
}
