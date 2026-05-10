import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GenerationService } from '../../core/services/generation.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmService } from '../../core/services/confirm.service';

@Component({
  selector: 'app-generate',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  styleUrls: ['./generate.component.css'],
  template: `
    <div class="generate-page">
      <div class="generate-container">
        <div class="generate-header">
          <h1>Generar Código</h1>
          <p>Configura y genera código optimizado para tu proyecto</p>
        </div>

        <form [formGroup]="generationForm" (ngSubmit)="onGenerate()">
          <div class="generate-grid">
            <!-- Sidebar de configuración -->
            <div class="config-sidebar">
              <div class="sidebar-card">
                <div class="sidebar-header">
                  <svg class="sidebar-header-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <h2>Configuración</h2>
                </div>

                <!-- FRONTEND SECTION -->
                <div class="config-section">
                  <div class="section-label">
                    <svg class="section-icon-small" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                    FRONTEND
                  </div>

                  <div class="select-field">
                    <label>Framework</label>
                    <div class="custom-dropdown" (click)="toggleFrameworkOpen()">
                      <div class="dropdown-trigger">
                        <div class="trigger-content">
                          <div class="brand-icon" [innerHTML]="getBrandIcon(generationForm.get('framework')?.value)"></div>
                          {{ generationForm.get('framework')?.value }}
                        </div>
                        <svg class="chevron-icon" [class.rotated]="isFrameworkOpen" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </div>
                      <div class="dropdown-menu" *ngIf="isFrameworkOpen">
                        <div *ngFor="let fw of frameworks" (click)="selectFramework(fw); $event.stopPropagation()" class="dropdown-option" [class.selected]="generationForm.get('framework')?.value === fw">
                          <div class="brand-icon" [innerHTML]="getBrandIcon(fw)"></div>
                          {{ fw }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="select-field">
                    <label>Lenguaje</label>
                    <div class="custom-dropdown" (click)="toggleLenguajeOpen()">
                      <div class="dropdown-trigger">
                        <div class="trigger-content">
                          <div class="brand-icon" [innerHTML]="getBrandIcon(generationForm.get('lenguaje')?.value)"></div>
                          {{ generationForm.get('lenguaje')?.value }}
                        </div>
                        <svg class="chevron-icon" [class.rotated]="isLenguajeOpen" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </div>
                      <div class="dropdown-menu" *ngIf="isLenguajeOpen">
                        <div *ngFor="let lng of lenguajes" (click)="selectLenguaje(lng); $event.stopPropagation()" class="dropdown-option" [class.selected]="generationForm.get('lenguaje')?.value === lng">
                          <div class="brand-icon" [innerHTML]="getBrandIcon(lng)"></div>
                          {{ lng }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="select-field">
                    <label>Estilo</label>
                    <div class="custom-dropdown" (click)="toggleEstiloOpen()">
                      <div class="dropdown-trigger">
                        <div class="trigger-content">
                          <div class="brand-icon" [innerHTML]="getBrandIcon(generationForm.get('estilo')?.value)"></div>
                          {{ generationForm.get('estilo')?.value }}
                        </div>
                        <svg class="chevron-icon" [class.rotated]="isEstiloOpen" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </div>
                      <div class="dropdown-menu" *ngIf="isEstiloOpen">
                        <div *ngFor="let est of estilos" (click)="selectEstilo(est); $event.stopPropagation()" class="dropdown-option" [class.selected]="generationForm.get('estilo')?.value === est">
                          <div class="brand-icon" [innerHTML]="getBrandIcon(est)"></div>
                          {{ est }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- BACKEND SECTION -->
                <div class="config-section">
                  <div class="section-label">
                    <svg class="section-icon-small" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                    </svg>
                    BACKEND
                  </div>

                  <div class="select-field">
                    <label>Tecnología</label>
                    <div class="tech-box">
                      <div class="tech-info">
                        <div class="brand-icon" [innerHTML]="getBrandIcon('.NET (C#)')"></div>
                        .NET (C#)
                      </div>
                      <span class="badge-standard">ESTÁNDAR</span>
                    </div>
                  </div>
                </div>

                <!-- ADDITIONAL OPTIONS -->
                <div class="config-section">
                  <div class="section-label">
                    <svg class="section-icon-small" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="4" y1="21" x2="4" y2="14"></line>
                      <line x1="4" y1="10" x2="4" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12" y2="3"></line>
                      <line x1="20" y1="21" x2="20" y2="16"></line>
                      <line x1="20" y1="12" x2="20" y2="3"></line>
                      <line x1="1" y1="14" x2="7" y2="14"></line>
                      <line x1="9" y1="8" x2="15" y2="8"></line>
                      <line x1="17" y1="16" x2="23" y2="16"></line>
                    </svg>
                    OPCIONES ADICIONALES
                  </div>

                  <div class="options-grid">
                    <label class="option-card" (click)="$event.stopPropagation()">
                      <input type="checkbox" formControlName="incluirTests">
                      <div class="option-info">
                        <span class="option-title">Incluir Tests</span>
                        <span class="option-desc">Genera pruebas unitarias automáticas</span>
                      </div>
                    </label>

                    <label class="option-card" (click)="$event.stopPropagation()">
                      <input type="checkbox" formControlName="incluirDoc">
                      <div class="option-info">
                        <span class="option-title">Incluir Documentación</span>
                        <span class="option-desc">Genera documentación del código</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Area Principal -->
            <div class="main-area">
              <div class="main-card">
                <div class="main-header">
                  <div class="main-header-title">
                    <svg class="header-icon-blue" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <h2>Vista previa del proyecto</h2>
                  </div>
                  <div class="header-badges">
                    <div class="capsule-badge">
                      <div class="brand-icon" [innerHTML]="getBrandIcon(generationForm.get('framework')?.value)"></div>
                      {{ generationForm.get('framework')?.value }}
                    </div>
                    <div class="capsule-badge">
                      <div class="brand-icon" [innerHTML]="getBrandIcon(generationForm.get('lenguaje')?.value)"></div>
                      {{ generationForm.get('lenguaje')?.value }}
                    </div>
                    <div class="capsule-badge">
                      <div class="brand-icon" [innerHTML]="getBrandIcon(generationForm.get('estilo')?.value)"></div>
                      {{ generationForm.get('estilo')?.value }}
                    </div>
                    <div class="capsule-badge">
                      <div class="brand-icon" [innerHTML]="getBrandIcon('.NET (C#)')"></div>
                      .NET (C#)
                    </div>
                  </div>
                </div>

                <div class="content-section">
                  <div class="content-label-row">
                    <span class="content-label">Código Frontend</span>
                    <span class="badge-blue">ARCHIVOS ZIP</span>
                  </div>
                  
                  <input type="file" id="fileInput" accept=".zip" multiple (change)="onFileSelected($event)" style="display: none;">
                  <label for="fileInput" class="upload-area">
                    <svg class="upload-icon-large" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <div class="upload-title">Arrastra archivos o haz clic para seleccionar</div>
                    <div class="upload-desc">Sube uno o varios archivos .zip con tu proyecto frontend</div>
                  </label>

                  <div *ngIf="frontendZipFiles.length > 0" class="files-preview">
                    <div class="file-row" *ngFor="let f of frontendZipFiles">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                      {{ f.name }}
                    </div>
                  </div>
                </div>

                <div class="content-section">
                  <div class="content-label-row">
                    <span class="content-label">Descripción del Proyecto <span class="required-star">*</span></span>
                  </div>
                  <div class="textarea-container">
                    <textarea class="custom-textarea" formControlName="projectDescription" rows="10" placeholder="Describe tu proyecto en detalle. Puedes usar formato Gherkin para historias de usuario..."></textarea>
                    <div class="hint-row">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                      Formato Gherkin soportado para especificaciones detalladas
                    </div>
                  </div>
                </div>

                <div class="actions-footer">
                  <button type="button" routerLink="/dashboard" class="btn-outline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    Cancelar
                  </button>
                  <button type="submit" class="btn-generate">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                    Generar Código
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class GenerateComponent implements OnInit {
  generationForm: FormGroup;
  frontendZipFiles: File[] = [];

  frameworks = ['Angular', 'React', 'Vue'];
  lenguajes = ['TypeScript', 'JavaScript'];
  estilos = ['Tailwind', 'CSS Modules', 'Styled Components'];

  isFrameworkOpen = false;
  isLenguajeOpen = false;
  isEstiloOpen = false;

  constructor(
    private fb: FormBuilder,
    private generationService: GenerationService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private confirmService: ConfirmService
  ) {
    this.generationForm = this.fb.group({
      framework: ['Angular'],
      lenguaje: ['TypeScript'],
      estilo: ['Tailwind'],
      incluirTests: [false],
      incluirDoc: [false],
      projectDescription: [
        '',
        Validators.required,
      ],
    });
  }

  getBrandIcon(name: string | undefined): SafeHtml {
    if (!name) return '';
    let iconUrl = '';
    switch (name) {
      case 'Angular':
        iconUrl = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg';
        break;
      case 'React':
        iconUrl = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg';
        break;
      case 'Vue':
        iconUrl = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg';
        break;
      case 'TypeScript':
        iconUrl = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg';
        break;
      case 'JavaScript':
        iconUrl = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg';
        break;
      case 'Tailwind':
        iconUrl = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg';
        break;
      case 'CSS Modules':
        iconUrl = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg';
        break;
      case 'Styled Components':
        iconUrl = 'https://styled-components.com/logo.png';
        break;
      case '.NET (C#)':
        iconUrl = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg';
        break;
      default:
        iconUrl = '';
    }
    return this.sanitizer.bypassSecurityTrustHtml(
      `<img src="${iconUrl}" alt="${name}" style="width: 20px; height: 20px; object-fit: contain;">`
    );
  }

  toggleFrameworkOpen(): void {
    this.isFrameworkOpen = !this.isFrameworkOpen;
    this.isLenguajeOpen = false;
    this.isEstiloOpen = false;
  }

  selectFramework(fw: string): void {
    this.generationForm.get('framework')?.setValue(fw);
    this.isFrameworkOpen = false;
  }

  toggleLenguajeOpen(): void {
    this.isLenguajeOpen = !this.isLenguajeOpen;
    this.isFrameworkOpen = false;
    this.isEstiloOpen = false;
  }

  selectLenguaje(lng: string): void {
    this.generationForm.get('lenguaje')?.setValue(lng);
    this.isLenguajeOpen = false;
  }

  toggleEstiloOpen(): void {
    this.isEstiloOpen = !this.isEstiloOpen;
    this.isFrameworkOpen = false;
    this.isLenguajeOpen = false;
  }

  selectEstilo(est: string): void {
    this.generationForm.get('estilo')?.setValue(est);
    this.isEstiloOpen = false;
  }

  async onGenerate(): Promise<void> {
    if (this.generationForm.invalid) {
      await this.confirmService.confirm({
        title: 'Faltan detalles',
        message: 'Por favor, describe tu proyecto en el campo de descripción antes de generar el código.',
        confirmText: 'Entendido',
        type: 'warning',
        showCancel: false
      });
      return;
    }

    const form = new FormData();
    form.append('framework', this.generationForm.get('framework')?.value || '');
    form.append('lenguaje', this.generationForm.get('lenguaje')?.value || '');
    form.append('estilo', this.generationForm.get('estilo')?.value || '');
    form.append('incluirTests', this.generationForm.get('incluirTests')?.value ? 'true' : 'false');
    form.append('incluirDoc', this.generationForm.get('incluirDoc')?.value ? 'true' : 'false');
    form.append('projectDescription', this.generationForm.get('projectDescription')?.value || '');
    for (let i = 0; i < this.frontendZipFiles.length; i++) {
      const f = this.frontendZipFiles[i];
      form.append('frontendZips', f, f.name);
    }

    this.generationService.startGenerationForm(form).subscribe({
      next: (res) => {
        this.toastr.success('Generación iniciada correctamente');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error iniciando generación', err);
        this.toastr.error('Error al iniciar la generación');
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files.item(i);
        if (!file) continue;
        if (file.name.toLowerCase().endsWith('.zip')) {
          this.frontendZipFiles.push(file);
        } else {
          this.toastr.warning('Por favor sube solo archivos .zip');
          input.value = '';
          break;
        }
      }
    }
  }

  ngOnInit(): void {}
}

