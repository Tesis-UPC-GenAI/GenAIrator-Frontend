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
          <div class="grid grid-cols-1 grid-cols-lg-3" style="grid-template-columns: 1fr 2fr;">
            <!-- Sidebar de configuración -->
            <div>
              <app-card>
                <h2 class="text-lg font-semibold mb-lg">⚙️ Configuración</h2>

                <h3 class="text-md font-semibold mb-md pt-md" style="border-top: 1px solid #eee;">
                  Frontend
                </h3>

                <div class="mb-lg">
                  <label class="form-label">Framework</label>
                  <select class="form-input" formControlName="framework">
                    <option>React</option>
                    <option>Angular</option>
                    <option>Vue</option>
                  </select>
                </div>

                <div class="mb-lg">
                  <label class="form-label">Lenguaje</label>
                  <select class="form-input" formControlName="lenguaje">
                    <option>TypeScript</option>
                    <option>JavaScript</option>
                  </select>
                </div>

                <div class="mb-lg">
                  <label class="form-label">Estilo</label>
                  <select class="form-input" formControlName="estilo">
                    <option>CSS Modules</option>
                    <option>Styled Components</option>
                    <option>Tailwind</option>
                  </select>
                </div>

                <h3 class="text-md font-semibold mb-md pt-md" style="border-top: 1px solid #eee;">
                  Backend
                </h3>

                <div class="mb-lg">
                  <label class="form-label">Tecnología (Estándar)</label>
                  <input class="form-input" type="text" value=".NET (C#)" disabled />
                </div>

                <div class="mb-lg">
                  <label class="form-label">
                    <input
                      type="checkbox"
                      formControlName="incluirTests"
                      style="margin-right: 8px;"
                    />
                    Incluir tests
                  </label>
                </div>

                <div class="mb-lg">
                  <label class="form-label">
                    <input
                      type="checkbox"
                      formControlName="incluirDoc"
                      style="margin-right: 8px;"
                    />
                    Incluir documentación
                  </label>
                </div>
              </app-card>
            </div>

            <!-- Área principal -->
            <div>
              <app-card>
                <h2 class="text-xl font-semibold mb-md">📋 Vista Previa</h2>

                <div class="mb-md">
                  <label class="form-label"
                    >Subir Código Frontend (ZIP) — puedes subir varios</label
                  >
                  <div>
                    <input type="file" accept=".zip" multiple (change)="onFileSelected($event)" />
                    <small class="text-secondary"
                      >Sube uno o varios .zip que contengan tu proyecto frontend (HTML/TS/CSS). Los
                      archivos se combinarán sin sobrescribir los existentes.</small
                    >
                    <div *ngIf="frontendZipFiles.length > 0" style="margin-top:8px">
                      <strong>Archivos seleccionados:</strong>
                      <ul>
                        <li *ngFor="let f of frontendZipFiles">{{ f.name }}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="mb-md">
                  <label class="form-label">Descripción / Historias de Usuario</label>
                  <textarea
                    class="form-input"
                    formControlName="projectDescription"
                    rows="6"
                    placeholder="Ej: Quiero una app de Tareas. Scenario: Crear tarea... (Gherkin soportado)"
                  ></textarea>
                </div>

                <div class="mt-sm text-secondary">
                  <small
                    >Selecciona uno de tus design systems subidos para usar en la generación.</small
                  >
                </div>
              </app-card>

              <div class="flex gap-md mt-lg justify-end">
                <a routerLink="/dashboard" class="btn btn-secondary"> Cancelar </a>
                <button type="submit" class="btn btn-primary">Generar Código</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      /* Estilos específicos si se necesitan */
    `,
  ],
})
export class GenerateComponent implements OnInit {
  generationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private generationService: GenerationService,
    private router: Router
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

  frontendZipFiles: File[] = [];

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
