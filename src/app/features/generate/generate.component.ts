import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
// Removed DesignSystemService and Observable imports as design-system selection was replaced by builderViews
import { GenerationService } from '../../core/services/generation.service';
import { Router } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-generate',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="container">
        <div class="dashboard-header">
          <h1>Generar Código</h1>
          <p class="text-secondary mt-sm">Configura y genera código optimizado para tu proyecto</p>
        </div>

        <form [formGroup]="generationForm" (ngSubmit)="onGenerate()">
          <div class="generate-grid">
            <!-- Sidebar de configuración -->
            <div class="config-sidebar">
              <app-card>
                <div class="config-header">
                  <svg class="config-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  <h2 class="config-title">Configuración</h2>
                </div>

                <!-- Frontend Section -->
                <div class="config-section">
                  <div class="section-header">
                    <svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <h3 class="section-title">Frontend</h3>
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Framework</span>
                      <span class="label-required">*</span>
                    </label>
                    <div class="select-wrapper custom-select" (click)="toggleFrameworkOpen()">
                      <div class="form-select custom-select-trigger">
                        {{ generationForm.get('framework')?.value || 'Selecciona framework' }}
                        <svg
                          class="select-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          [class.rotated]="isFrameworkOpen"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>

                      <ul *ngIf="isFrameworkOpen" class="custom-select-menu">
                        <li
                          *ngFor="let fw of frameworks"
                          (click)="selectFramework(fw); $event.stopPropagation()"
                          class="custom-select-option"
                          [class.is-selected]="generationForm.get('framework')?.value === fw"
                        >
                          {{ fw }}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Lenguaje</span>
                      <span class="label-required">*</span>
                    </label>
                    <div class="select-wrapper custom-select" (click)="toggleLenguajeOpen()">
                      <div class="form-select custom-select-trigger">
                        {{ generationForm.get('lenguaje')?.value || 'Selecciona lenguaje' }}
                        <svg
                          class="select-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          [class.rotated]="isLenguajeOpen"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>

                      <ul *ngIf="isLenguajeOpen" class="custom-select-menu">
                        <li
                          *ngFor="let lng of lenguajes"
                          (click)="selectLenguaje(lng); $event.stopPropagation()"
                          class="custom-select-option"
                          [class.is-selected]="generationForm.get('lenguaje')?.value === lng"
                        >
                          {{ lng }}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Estilo</span>
                      <span class="label-required">*</span>
                    </label>
                    <div class="select-wrapper custom-select" (click)="toggleEstiloOpen()">
                      <div class="form-select custom-select-trigger">
                        {{ generationForm.get('estilo')?.value || 'Selecciona estilo' }}
                        <svg
                          class="select-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          [class.rotated]="isEstiloOpen"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>

                      <ul *ngIf="isEstiloOpen" class="custom-select-menu">
                        <li
                          *ngFor="let est of estilos"
                          (click)="selectEstilo(est); $event.stopPropagation()"
                          class="custom-select-option"
                          [class.is-selected]="generationForm.get('estilo')?.value === est"
                        >
                          {{ est }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Backend Section -->
                <div class="config-section">
                  <div class="section-header">
                    <svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                      ></path>
                    </svg>
                    <h3 class="section-title">Backend</h3>
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Tecnología</span>
                      <span class="label-badge">Estándar</span>
                    </label>
                    <div class="input-disabled">
                      <svg
                        class="input-disabled-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span>.NET (C#)</span>
                    </div>
                  </div>
                </div>

                <!-- Options Section -->
                <div class="config-section">
                  <div class="section-header">
                    <svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      ></path>
                    </svg>
                    <h3 class="section-title">Opciones Adicionales</h3>
                  </div>

                  <label class="checkbox-label">
                    <input type="checkbox" formControlName="incluirTests" class="checkbox-input" />
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-text">
                      <span class="checkbox-title">Incluir Tests</span>
                      <span class="checkbox-description">Genera pruebas unitarias automáticas</span>
                    </span>
                  </label>

                  <label class="checkbox-label">
                    <input type="checkbox" formControlName="incluirDoc" class="checkbox-input" />
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-text">
                      <span class="checkbox-title">Incluir Documentación</span>
                      <span class="checkbox-description">Genera documentación del código</span>
                    </span>
                  </label>
                </div>
              </app-card>
            </div>

            <!-- Área principal -->
            <div class="main-area">
              <app-card>
                <div class="preview-header">
                  <svg class="preview-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                  <h2 class="preview-title">Vista Previa del Proyecto</h2>
                </div>

                <!-- File Upload Section -->
                <div class="upload-section">
                  <label class="form-label">
                    <span class="label-text">Código Frontend</span>
                    <span class="label-badge-info">Archivos ZIP</span>
                  </label>

                  <div class="file-upload-wrapper">
                    <input
                      type="file"
                      id="fileInput"
                      accept=".zip"
                      multiple
                      (change)="onFileSelected($event)"
                      class="file-input-hidden"
                    />
                    <label for="fileInput" class="file-upload-area">
                      <svg
                        class="upload-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <div class="upload-text">
                        <p class="upload-title">Arrastra archivos o haz clic para seleccionar</p>
                        <p class="upload-subtitle">
                          Sube uno o varios archivos .zip con tu proyecto frontend
                        </p>
                      </div>
                    </label>

                    <div *ngIf="frontendZipFiles.length > 0" class="files-list">
                      <div class="files-header">
                        <svg
                          class="files-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          ></path>
                        </svg>
                        <span class="files-count"
                          >{{ frontendZipFiles.length }} archivo(s) seleccionado(s)</span
                        >
                      </div>
                      <div class="file-item" *ngFor="let f of frontendZipFiles">
                        <svg
                          class="file-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          ></path>
                        </svg>
                        <span class="file-name">{{ f.name }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Description Section -->
                <div class="description-section">
                  <label class="form-label">
                    <span class="label-text">Descripción del Proyecto</span>
                    <span class="label-required">*</span>
                  </label>
                  <div class="textarea-wrapper">
                    <textarea
                      class="form-textarea"
                      formControlName="projectDescription"
                      rows="8"
                      placeholder="Describe tu proyecto en detalle. Puedes usar formato Gherkin para historias de usuario...&#10;&#10;Ejemplo:&#10;Feature: Gestión de Tareas&#10;  Scenario: Crear una nueva tarea&#10;    Given que estoy en la página principal&#10;    When hago clic en 'Nueva Tarea'&#10;    Then debo ver el formulario de creación"
                    ></textarea>
                    <div class="textarea-footer">
                      <svg
                        class="textarea-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span class="textarea-hint"
                        >Formato Gherkin soportado para especificaciones detalladas</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="actions-bar">
                  <a routerLink="/dashboard" class="btn btn-secondary">
                    <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                    Cancelar
                  </a>
                  <button type="submit" class="btn btn-primary">
                    <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                    Generar Código
                  </button>
                </div>
              </app-card>
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

  // Dropdown options
  frameworks = ['React', 'Angular', 'Vue'];
  lenguajes = ['TypeScript', 'JavaScript'];
  estilos = ['CSS Modules', 'Styled Components', 'Tailwind'];

  // Dropdown states
  isFrameworkOpen = false;
  isLenguajeOpen = false;
  isEstiloOpen = false;

  constructor(
    private fb: FormBuilder,
    private generationService: GenerationService,
    private router: Router,
  ) {
    this.generationForm = this.fb.group({
      framework: ['Angular'],
      lenguaje: ['TypeScript'],
      estilo: ['Tailwind'],
      incluirTests: [false],
      incluirDoc: [false],
      // Removed builderViews/commandString; file upload handled via onFileSelected
      projectDescription: ['', Validators.required],
    });
    this.frontendZipFiles = [];
  }

  // Custom dropdown methods
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

  onGenerate(): void {
    if (this.generationForm.invalid) {
      alert('Por favor completa el formulario antes de generar.');
      return;
    }

    // Build FormData to include the uploaded ZIP
    const form = new FormData();
    form.append('framework', this.generationForm.get('framework')?.value || '');
    form.append('lenguaje', this.generationForm.get('lenguaje')?.value || '');
    form.append('estilo', this.generationForm.get('estilo')?.value || '');
    form.append('incluirTests', this.generationForm.get('incluirTests')?.value ? 'true' : 'false');
    form.append('incluirDoc', this.generationForm.get('incluirDoc')?.value ? 'true' : 'false');
    form.append('projectDescription', this.generationForm.get('projectDescription')?.value || '');
    // Append all selected zip files using the field name expected by the backend
    for (let i = 0; i < this.frontendZipFiles.length; i++) {
      const f = this.frontendZipFiles[i];
      form.append('frontendZips', f, f.name);
    }

    this.generationService.startGenerationForm(form).subscribe({
      next: (res) => {
        alert('Generación iniciada');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error iniciando generación', err);
        alert('Error al iniciar la generación. Revisa la consola para más detalles.');
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.frontendZipFiles = [];
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files.item(i);
        if (!file) continue;
        if (file.name.toLowerCase().endsWith('.zip')) {
          this.frontendZipFiles.push(file);
        } else {
          alert('Por favor sube solo archivos .zip');
          input.value = '';
          this.frontendZipFiles = [];
          break;
        }
      }
    }
  }

  ngOnInit(): void {
    // Lifecycle hook required by OnInit. Initialization is already done
    // in the constructor (form and initial view), so no-op for now.
  }
}
