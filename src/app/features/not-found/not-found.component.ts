import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1 class="error-title">Página no encontrada</h1>
        <p class="error-message">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div class="flex gap-md justify-center mt-xl">
          <a routerLink="/" class="btn btn-primary">
            🏠 Volver al inicio
          </a>
          <a routerLink="/dashboard" class="btn btn-secondary">
            📊 Ir al Dashboard
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      min-height: calc(100vh - 200px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-xl);
      background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
    }

    .not-found-content {
      text-align: center;
      max-width: 600px;
    }

    .error-code {
      font-size: 8rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: var(--spacing-md);
      line-height: 1;
    }

    .error-title {
      font-size: var(--font-size-3xl);
      font-weight: 700;
      margin-bottom: var(--spacing-md);
      color: var(--text-primary);
    }

    .error-message {
      font-size: var(--font-size-lg);
      color: var(--text-secondary);
      margin-bottom: var(--spacing-xl);
    }
  `]
})
export class NotFoundComponent {}
