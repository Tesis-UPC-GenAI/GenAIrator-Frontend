import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-processing',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <div class="page-container">
      <div class="container">
        <div style="max-width: 600px; margin: 0 auto;">
          <app-card class="text-center">
            <div class="spinner mb-xl"></div>
            <h1 class="text-2xl font-bold mb-md">Generando tu código...</h1>
            <p class="text-secondary mb-xl">
              Nuestro sistema está procesando tus diseños y generando código optimizado.
              Este proceso puede tomar algunos minutos.
            </p>

            <div class="progress-container mb-xl">
              <div class="progress-bar"></div>
            </div>

            <div class="processing-steps">
              <div class="step completed">
                <span class="step-icon">✓</span>
                <span class="step-text">Analizando design system</span>
              </div>
              <div class="step completed">
                <span class="step-icon">✓</span>
                <span class="step-text">Extrayendo tokens</span>
              </div>
              <div class="step active">
                <span class="step-icon">⚡</span>
                <span class="step-text">Generando componentes</span>
              </div>
              <div class="step">
                <span class="step-icon">○</span>
                <span class="step-text">Optimizando código</span>
              </div>
              <div class="step">
                <span class="step-icon">○</span>
                <span class="step-text">Creando documentación</span>
              </div>
            </div>
          </app-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .spinner {
      width: 64px;
      height: 64px;
      border: 5px solid var(--border-color);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .progress-container {
      width: 100%;
      height: 8px;
      background: var(--bg-tertiary);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      width: 60%;
      background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
      animation: progress 2s ease-in-out infinite;
    }

    @keyframes progress {
      0% { width: 40%; }
      50% { width: 70%; }
      100% { width: 40%; }
    }

    .processing-steps {
      text-align: left;
    }

    .step {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-sm) 0;
      color: var(--text-tertiary);
    }

    .step.completed {
      color: var(--color-success);
    }

    .step.active {
      color: var(--color-primary);
      font-weight: 600;
    }

    .step-icon {
      font-size: var(--font-size-lg);
    }

    .step-text {
      font-size: var(--font-size-sm);
    }
  `]
})
export class ProcessingComponent {}
