import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent],
  template: `
    <div class="page-container">
      <div class="container">
        <div style="max-width: 800px; margin: 0 auto;">
          <app-card class="text-center">
            <div class="success-icon mb-lg"></div>
            <h1 class="text-3xl font-bold mb-md">
              Código generado exitosamente!
            </h1>
            <p class="text-secondary mb-xl">
              Tu código ha sido generado y está listo para usar en tu proyecto.
            </p>

            <div class="grid grid-cols-1 grid-cols-md-3 gap-md mb-xl">
              <div class="stat-item">
                <span class="stat-value">15</span>
                <span class="stat-label">Componentes</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">342</span>
                <span class="stat-label">Líneas de código</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">8</span>
                <span class="stat-label">Tokens aplicados</span>
              </div>
            </div>

            <div class="flex gap-md justify-center flex-col" style="max-width: 400px; margin: 0 auto;">
              <button class="btn btn-primary" disabled>
                 Descargar Código
              </button>
              <button class="btn btn-secondary" disabled>
                 Copiar al Portapapeles
              </button>
              <a routerLink="/dashboard" class="btn btn-secondary">
                 Volver al Dashboard
              </a>
            </div>
          </app-card>

          <app-card class="mt-lg">
            <h2 class="text-lg font-semibold mb-md"> Contenido generado</h2>
            <ul class="text-sm text-secondary" style="list-style: none; padding: 0;">
              <li class="mb-sm"> Componentes React/TypeScript</li>
              <li class="mb-sm"> Estilos CSS Modules</li>
              <li class="mb-sm"> Tests unitarios</li>
              <li class="mb-sm"> Documentación Storybook</li>
              <li class="mb-sm"> Design tokens (JSON)</li>
            </ul>
          </app-card>
        </div>
      </div>
    </div>
  `,
})
export class ResultsComponent {}
