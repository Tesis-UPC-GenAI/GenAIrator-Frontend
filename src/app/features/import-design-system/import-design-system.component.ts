import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-import-design-system',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent],
  template: `
    <div class="page-container">
      <div class="container">
        <div class="dashboard-header">
          <h1>Importar Design System</h1>
          <p class="text-secondary mt-sm">
            Conecta tus herramientas de diseño favoritas
          </p>
        </div>

        <div class="grid grid-cols-1 grid-cols-md-2">
          <app-card class="feature-card card-interactive">
            <div class="feature-icon" style="background: linear-gradient(135deg, #F24E1E 0%, #FF7262 100%);">
              🎨
            </div>
            <h2 class="text-xl font-semibold mb-md">Figma</h2>
            <p class="text-secondary mb-lg">
              Importa componentes, estilos y tokens directamente desde Figma.
            </p>
            <button class="btn btn-primary" disabled>
              Conectar con Figma
            </button>
          </app-card>

          <app-card class="feature-card card-interactive">
            <div class="feature-icon" style="background: linear-gradient(135deg, #FDB300 0%, #FFCD29 100%);">
              💎
            </div>
            <h2 class="text-xl font-semibold mb-md">Sketch</h2>
            <p class="text-secondary mb-lg">
              Sincroniza tus diseños de Sketch con tu proyecto de código.
            </p>
            <button class="btn btn-primary" disabled>
              Conectar con Sketch
            </button>
          </app-card>

          <app-card class="feature-card card-interactive">
            <div class="feature-icon" style="background: linear-gradient(135deg, #6B7AFF 0%, #8B99FF 100%);">
              🖼️
            </div>
            <h2 class="text-xl font-semibold mb-md">Adobe XD</h2>
            <p class="text-secondary mb-lg">
              Extrae design tokens y componentes de Adobe XD.
            </p>
            <button class="btn btn-primary" disabled>
              Conectar con Adobe XD
            </button>
          </app-card>

          <app-card class="feature-card card-interactive">
            <div class="feature-icon" style="background: linear-gradient(135deg, #18B663 0%, #2DD277 100%);">
              📁
            </div>
            <h2 class="text-xl font-semibold mb-md">Subir Archivos</h2>
            <p class="text-secondary mb-lg">
              Sube archivos JSON o CSS con tus design tokens.
            </p>
            <button class="btn btn-primary" disabled>
              Seleccionar Archivos
            </button>
          </app-card>
        </div>

        <app-card class="mt-xl">
          <h2 class="text-xl font-semibold mb-md">📚 ¿Cómo funciona?</h2>
          <div class="grid grid-cols-1 grid-cols-md-3 gap-md mt-lg">
            <div class="text-center">
              <div class="text-3xl mb-md">1️⃣</div>
              <h3 class="font-semibold mb-sm">Conecta</h3>
              <p class="text-sm text-secondary">
                Conecta tu herramienta de diseño preferida
              </p>
            </div>
            <div class="text-center">
              <div class="text-3xl mb-md">2️⃣</div>
              <h3 class="font-semibold mb-sm">Importa</h3>
              <p class="text-sm text-secondary">
                Selecciona los componentes y tokens a importar
              </p>
            </div>
            <div class="text-center">
              <div class="text-3xl mb-md">3️⃣</div>
              <h3 class="font-semibold mb-sm">Genera</h3>
              <p class="text-sm text-secondary">
                Genera código optimizado automáticamente
              </p>
            </div>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: [`
    /* Estilos específicos si se necesitan */
  `]
})
export class ImportDesignSystemComponent {}
