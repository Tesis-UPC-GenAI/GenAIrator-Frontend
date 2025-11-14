import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
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

        <div class="grid grid-cols-1 grid-cols-lg-3" style="grid-template-columns: 1fr 2fr;">
          <!-- Sidebar de configuración -->
          <div>
            <app-card>
              <h2 class="text-lg font-semibold mb-lg">⚙️ Configuración</h2>

              <form [formGroup]="generationForm" (ngSubmit)="onGenerate()">
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
              </form>
            </app-card>
          </div>

          <!-- Área principal -->
          <div>
            <app-card>
              <h2 class="text-xl font-semibold mb-md">📋 Vista Previa</h2>
              <div class="empty-state">
                <div class="empty-state-icon">🔧</div>
                <h3 class="empty-state-title">Configura tu generación</h3>
                <p class="empty-state-description">
                  Selecciona un design system importado y configura las opciones de generación.
                </p>
              </div>
            </app-card>

            <div class="flex gap-md mt-lg justify-end">
              <a routerLink="/dashboard" class="btn btn-secondary"> Cancelar </a>
              <button class="btn btn-primary" (click)="onGenerate()">Generar Código</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Estilos específicos si se necesitan */
    `,
  ],
})
export class GenerateComponent {
  generationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.generationForm = this.fb.group({
      framework: ['Angular'],
      lenguaje: ['TypeScript'],
      estilo: ['Tailwind'],
      incluirTests: [false],
      incluirDoc: [false],
    });
  }

  onGenerate(): void {
    // Por ahora sólo registramos los valores; más adelante podemos enviar al backend
    console.log('Generación solicitada:', this.generationForm.value);
  }
}
