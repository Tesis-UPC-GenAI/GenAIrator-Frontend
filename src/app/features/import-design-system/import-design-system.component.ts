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
          <h1>¿Cómo funciona?</h1>
          <p class="text-secondary mt-sm">
            Flujo de generación: diseño → descripción → proyecto fullstack
          </p>
        </div>

        <app-card class="mt-lg">
          <div class="steps-grid">
            <div class="step-item">
              <div class="step-number">1</div>
              <h3 class="font-semibold mb-sm">Diseña y Sube</h3>
              <p class="text-sm text-secondary">
                Diseña tu interfaz en Figma o tu herramienta preferida y sube el código frontend
                como un archivo ZIP. El generador usará los archivos subidos como fuente canónica.
              </p>
            </div>

            <div class="step-item">
              <div class="step-number">2</div>
              <h3 class="font-semibold mb-sm">Describe y Configura</h3>
              <p class="text-sm text-secondary">
                Describe la lógica de negocio en el campo de texto. Puedes subir tu frontend o usar
                nuestras plantillas para que la IA genere o hidrate componentes.
              </p>
            </div>

            <div class="step-item">
              <div class="step-number">3</div>
              <h3 class="font-semibold mb-sm">Generación Fullstack</h3>
              <p class="text-sm text-secondary">
                Nuestra IA fusiona el diseño visual con la lógica backend (.NET) y genera tu
                proyecto completo.
              </p>
            </div>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: [
    `
      .steps-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--spacing-xl);
        margin-top: var(--spacing-lg);
      }

      .step-item {
        text-align: center;
        padding: var(--spacing-xl);
        border-radius: var(--radius-lg);
        background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
        border: 2px solid var(--border-color);
        transition: all var(--transition-slow);
      }

      .step-item:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
        border-color: var(--color-primary-light);
      }

      .step-number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 64px;
        height: 64px;
        margin-bottom: var(--spacing-md);
        font-size: var(--font-size-3xl);
        font-weight: 700;
        background: var(--color-primary-gradient);
        color: white;
        border-radius: var(--radius-full);
        box-shadow: var(--shadow-colored);
      }

      @media (min-width: 640px) {
        .steps-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (min-width: 1024px) {
        .steps-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
    `,
  ],
})
export class ImportDesignSystemComponent {
}
