import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-import-design-system',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="how-it-works-page">
      <div class="container">
        <div class="header-section">
          <div class="process-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            Proceso de generación
          </div>
          <h1>¿Cómo funciona?</h1>
          <p>Así transformamos tu design system en una aplicación fullstack funcional.</p>
          <div class="title-underline"></div>
        </div>

        <div class="main-card">
          <div class="steps-container">
            <!-- STEP 1 -->
            <div class="step-card">
              <div class="step-number-circle">1</div>
              <div class="step-image-container">
                <img src="/assets/images/how-it-works/step1.png" alt="Importa tu design system">
              </div>
              <h3>Importa tu design system</h3>
              <p>
                Sube tokens, componentes y reglas visuales desde Figma, Sketch o archivos exportados. 
                Esta información se convierte en la base del proyecto generado.
              </p>
            </div>

            <div class="step-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>

            <!-- STEP 2 -->
            <div class="step-card">
              <div class="step-number-circle">2</div>
              <div class="step-image-container">
                <img src="/assets/images/how-it-works/step2.png" alt="Define lógica y framework">
              </div>
              <h3>Define lógica y framework</h3>
              <p>
                Describe el comportamiento de tu aplicación. El frontend de salida estándar es 
                Angular con TypeScript y Tailwind. También configuramos el backend .NET.
              </p>
            </div>

            <div class="step-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>

            <!-- STEP 3 -->
            <div class="step-card">
              <div class="step-number-circle">3</div>
              <div class="step-image-container">
                <img src="/assets/images/how-it-works/step3.png" alt="Generación fullstack">
              </div>
              <h3>Generación fullstack</h3>
              <p>
                <strong>GenAIrator</strong> construye la interfaz, servicios, APIs y estructura backend para 
                entregarte un proyecto funcional y listo para continuar desarrollando.
              </p>
            </div>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-row">
            <div class="summary-item">
              <div class="summary-icon blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                <div class="check-badge">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>
              <span>Design system importado</span>
            </div>

            <div class="summary-item">
              <div class="summary-icon purple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                <div class="check-badge">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>
              <span>Frontend configurado</span>
            </div>

            <div class="summary-item">
              <div class="summary-icon green">
                <div class="net-text">.NET</div>
                <div class="check-badge">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>
              <span>Backend .NET generado</span>
            </div>

            <div class="summary-item">
              <div class="summary-icon blue-light">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                <div class="check-badge">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>
              <span>Proyecto listo para editar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .how-it-works-page {
      padding: 40px 0;
      background-color: #f8fafc;
      min-height: calc(100vh - 70px);
    }

    .header-section {
      text-align: left;
      margin-bottom: 40px;
    }

    .process-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: #eff6ff;
      color: #2563eb;
      border-radius: 99px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .header-section h1 {
      font-size: 36px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 8px;
    }

    .header-section p {
      color: #64748b;
      font-size: 18px;
    }

    .title-underline {
      width: 120px;
      height: 4px;
      background: linear-gradient(90deg, #3b82f6 0%, rgba(59, 130, 246, 0.1) 100%);
      border-radius: 2px;
      margin-top: 24px;
    }

    .main-card {
      background: white;
      border-radius: 24px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
      padding: 48px;
    }

    .steps-container {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 24px;
      margin-bottom: 48px;
    }

    .step-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .step-number-circle {
      width: 32px;
      height: 32px;
      background: #3b82f6;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 24px;
      box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
    }

    .step-image-container {
      width: 100%;
      max-width: 200px;
      height: 160px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }

    .step-image-container img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .step-card h3 {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 12px;
    }

    .step-card p {
      font-size: 14px;
      color: #64748b;
      line-height: 1.6;
    }

    .step-arrow {
      color: #cbd5e1;
      display: flex;
      align-items: center;
      margin-top: 124px;
    }

    .summary-divider {
      height: 1px;
      background: #f1f5f9;
      margin-bottom: 32px;
    }

    .summary-row {
      display: flex;
      justify-content: space-around;
      gap: 24px;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      text-align: center;
    }

    .summary-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .summary-icon.blue { background: #eff6ff; color: #3b82f6; }
    .summary-icon.purple { background: #f5f3ff; color: #8b5cf6; }
    .summary-icon.green { background: #f0fdf4; color: #22c55e; }
    .summary-icon.blue-light { background: #f0f9ff; color: #0ea5e9; }

    .net-text {
      font-size: 12px;
      font-weight: 800;
    }

    .check-badge {
      position: absolute;
      bottom: -4px;
      right: -4px;
      width: 18px;
      height: 18px;
      background: #22c55e;
      color: white;
      border-radius: 50%;
      border: 2px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .summary-item span {
      font-size: 13px;
      font-weight: 600;
      color: #475569;
    }

    @media (max-width: 1024px) {
      .main-card { padding: 32px; }
      .steps-container { gap: 16px; }
      .step-image-container { height: 120px; }
      .step-arrow { margin-top: 104px; }
      .step-card h3 { font-size: 16px; }
      .summary-row { gap: 12px; }
    }

    @media (max-width: 767px) {
      .main-card { padding: 24px; }
      .header-section h1 { font-size: 28px; }
      .header-section p { font-size: 16px; }
      .steps-container {
        flex-direction: column;
        gap: 32px;
      }
      .step-arrow,
      .step-image-container,
      .summary-divider,
      .summary-row {
        display: none;
      }
      .step-number-circle {
        margin-bottom: 12px;
      }
    }
  `]
})
export class ImportDesignSystemComponent {}
