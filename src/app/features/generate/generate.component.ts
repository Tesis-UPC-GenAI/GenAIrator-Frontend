import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DesignSystemService } from '../../core/services/design-system.service';
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
                <label class="form-label">Design System</label>
                <select class="form-input" formControlName="designSystemId">
                  <option [ngValue]="null">-- Selecciona un design system --</option>
                  <option *ngFor="let ds of designSystems$ | async" [value]="ds.dsId">{{ ds.nombre }}</option>
                </select>
              </div>

              <div class="mt-sm text-secondary">
                <small>Selecciona uno de tus design systems subidos para usar en la generación.</small>
              </div>
            </app-card>

            <div class="flex gap-md mt-lg justify-end">
              <a routerLink="/dashboard" class="btn btn-secondary"> Cancelar </a>
              <button class="btn btn-primary" (click)="onGenerate()">Generar Código</button>
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
  designSystems$!: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private designSystemService: DesignSystemService
  ) {
    this.generationForm = this.fb.group({
      framework: ['Angular'],
      lenguaje: ['TypeScript'],
      estilo: ['Tailwind'],
      incluirTests: [false],
      incluirDoc: [false],
      designSystemId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.designSystems$ = this.designSystemService.getDesignSystems();
  }

  onGenerate(): void {
    // Por ahora sólo registramos los valores; más adelante podemos enviar al backend
    console.log('Generación solicitada:', this.generationForm.value);
  }
}
