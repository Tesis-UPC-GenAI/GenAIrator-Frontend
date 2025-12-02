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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <h2 class="config-title">Configuración</h2>
                </div>

                <!-- Frontend Section -->
                <div class="config-section">
                  <div class="section-header">
                    <svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
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
                        <svg class="select-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" [class.rotated]="isFrameworkOpen">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
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
                        <svg class="select-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" [class.rotated]="isLenguajeOpen">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
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
                        <svg class="select-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" [class.rotated]="isEstiloOpen">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
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
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
                    </svg>
                    <h3 class="section-title">Backend</h3>
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Tecnología</span>
                      <span class="label-badge">Estándar</span>
                    </label>
                    <div class="input-disabled">
                      <svg class="input-disabled-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>.NET (C#)</span>
                    </div>
                  </div>
                </div>

                <!-- Options Section -->
                <div class="config-section">
                  <div class="section-header">
                    <svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
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
                      <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <div class="upload-text">
                        <p class="upload-title">Arrastra archivos o haz clic para seleccionar</p>
                        <p class="upload-subtitle">Sube uno o varios archivos .zip con tu proyecto frontend</p>
                      </div>
                    </label>

                    <div *ngIf="frontendZipFiles.length > 0" class="files-list">
                      <div class="files-header">
                        <svg class="files-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span class="files-count">{{ frontendZipFiles.length }} archivo(s) seleccionado(s)</span>
                      </div>
                      <div class="file-item" *ngFor="let f of frontendZipFiles">
                        <svg class="file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
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
                      <svg class="textarea-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span class="textarea-hint">Formato Gherkin soportado para especificaciones detalladas</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="actions-bar">
                  <a routerLink="/dashboard" class="btn btn-secondary">
                    <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Cancelar
                  </a>
                  <button type="submit" class="btn btn-primary">
                    <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
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
  styles: [
    `
      .generate-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--spacing-xl);
      }

      @media (min-width: 1024px) {
        .generate-grid {
          grid-template-columns: 380px 1fr;
        }
      }

      /* Config Sidebar */
      .config-sidebar {
        position: sticky;
        top: calc(var(--spacing-xl) + 70px);
        align-self: start;
      }

      .config-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-xl);
        padding-bottom: var(--spacing-lg);
        border-bottom: 2px solid var(--border-color);
      }

      .config-icon {
        width: 32px;
        height: 32px;
        color: var(--color-primary);
        flex-shrink: 0;
      }

      .config-title {
        font-size: var(--font-size-xl);
        font-weight: 700;
        margin: 0;
        background: var(--color-primary-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .config-section {
        margin-bottom: var(--spacing-xl);
        padding-bottom: var(--spacing-xl);
        border-bottom: 1px solid var(--border-color);
      }

      .config-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }

      .section-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-lg);
      }

      .section-icon {
        width: 20px;
        height: 20px;
        color: var(--color-primary);
      }

      .section-title {
        font-size: var(--font-size-base);
        font-weight: 700;
        margin: 0;
        color: var(--text-primary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      /* Form Elements */
      .form-group {
        margin-bottom: var(--spacing-lg);
      }

      .form-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-sm);
      }

      .label-text {
        font-size: var(--font-size-sm);
        font-weight: 600;
        color: var(--text-primary);
      }

      .label-required {
        color: var(--color-error);
        font-weight: 700;
        margin-left: var(--spacing-xs);
      }

      .label-badge {
        font-size: var(--font-size-xs);
        padding: var(--spacing-xs) var(--spacing-sm);
        background: linear-gradient(135deg, var(--color-secondary) 0%, #475569 100%);
        color: white;
        border-radius: var(--radius-full);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 600;
      }

      .label-badge-info {
        font-size: var(--font-size-xs);
        padding: var(--spacing-xs) var(--spacing-sm);
        background: linear-gradient(135deg, var(--color-info) 0%, #0891b2 100%);
        color: white;
        border-radius: var(--radius-full);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 600;
      }

      /* Custom Select */
      .select-wrapper {
        position: relative;
      }

      .custom-select {
        position: relative;
      }

      .custom-select-trigger {
        width: 100%;
        padding: var(--spacing-md) var(--spacing-lg);
        padding-right: calc(var(--spacing-lg) + 32px);
        font-size: var(--font-size-base);
        color: var(--text-primary);
        background-color: var(--bg-primary);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-lg);
        cursor: pointer;
        transition: all var(--transition-slow);
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
      }

      .custom-select-trigger:hover {
        border-color: var(--color-primary);
        background-color: var(--color-primary-light);
      }

      .custom-select-trigger .select-icon {
        position: absolute;
        right: var(--spacing-md);
        width: 20px;
        height: 20px;
        color: var(--text-tertiary);
        transition: all var(--transition-base);
      }

      .custom-select-trigger .select-icon.rotated {
        transform: rotate(180deg);
        color: var(--color-primary);
      }

      .custom-select-menu {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        margin: 0;
        padding: 0;
        list-style: none;
        background: var(--bg-primary);
        border-radius: var(--radius-lg);
        border: 2px solid var(--border-color);
        box-shadow: var(--shadow-lg);
        z-index: 100;
        max-height: 240px;
        overflow-y: auto;
        animation: slideDown 0.2s ease-out;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .custom-select-option {
        padding: 12px 16px;
        font-size: var(--font-size-base);
        font-weight: 500;
        color: var(--text-primary);
        cursor: pointer;
        transition: all var(--transition-fast);
        border-bottom: 1px solid var(--border-color);
      }

      .custom-select-option:last-child {
        border-bottom: none;
      }

      .custom-select-option:hover {
        background: var(--color-primary-light);
        color: var(--color-primary-dark);
      }

      .custom-select-option.is-selected {
        background: linear-gradient(135deg, var(--color-primary) 0%, #8b5cf6 100%);
        color: white;
        font-weight: 600;
      }

      .custom-select-option.is-selected:hover {
        background: linear-gradient(135deg, var(--color-primary-hover) 0%, #7c3aed 100%);
      }

      .form-select {
        width: 100%;
        padding: var(--spacing-md) var(--spacing-lg);
        padding-right: calc(var(--spacing-lg) + 24px);
        font-size: var(--font-size-base);
        color: var(--text-primary);
        background-color: var(--bg-primary);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-lg);
        cursor: pointer;
        transition: all var(--transition-slow);
        appearance: auto;
        -webkit-appearance: auto;
        -moz-appearance: auto;
        font-weight: 500;
        background-image: none;
      }

      .form-select option {
        padding: 12px 16px;
        font-size: var(--font-size-base);
        font-weight: 500;
        color: var(--text-primary);
        background-color: white;
        line-height: 1.5;
      }

      .form-select option:checked {
        background-color: var(--color-primary);
        color: white;
        font-weight: 600;
      }

      .form-select:hover {
        border-color: var(--color-primary);
        background-color: var(--color-primary-light);
      }

      .form-select:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 4px var(--color-primary-light), var(--shadow-md);
        transform: translateY(-2px);
      }

      /* Disabled Input */
      .input-disabled {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-md) var(--spacing-lg);
        background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
        border: 2px dashed var(--border-color);
        border-radius: var(--radius-lg);
        font-weight: 600;
        color: var(--text-secondary);
      }

      .input-disabled-icon {
        width: 20px;
        height: 20px;
        color: var(--color-success);
      }

      /* Custom Checkbox */
      .checkbox-label {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-md);
        padding: var(--spacing-lg);
        background: var(--bg-secondary);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-lg);
        cursor: pointer;
        transition: all var(--transition-slow);
        margin-bottom: var(--spacing-md);
      }

      .checkbox-label:hover {
        background: var(--bg-primary);
        border-color: var(--color-primary);
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
      }

      .checkbox-input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }

      .checkbox-custom {
        width: 24px;
        height: 24px;
        border: 2px solid var(--border-color);
        border-radius: var(--radius-md);
        background: var(--bg-primary);
        transition: all var(--transition-slow);
        position: relative;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .checkbox-custom::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        width: 12px;
        height: 12px;
        background: var(--color-primary-gradient);
        border-radius: var(--radius-sm);
        transition: transform var(--transition-slow);
      }

      .checkbox-input:checked + .checkbox-custom {
        border-color: var(--color-primary);
        background: var(--color-primary-light);
      }

      .checkbox-input:checked + .checkbox-custom::after {
        transform: translate(-50%, -50%) scale(1);
      }

      .checkbox-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
      }

      .checkbox-title {
        font-weight: 700;
        color: var(--text-primary);
        font-size: var(--font-size-base);
      }

      .checkbox-description {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        line-height: 1.4;
      }

      /* Preview Section */
      .preview-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-2xl);
        padding-bottom: var(--spacing-lg);
        border-bottom: 2px solid var(--border-color);
      }

      .preview-icon {
        width: 32px;
        height: 32px;
        color: var(--color-primary);
      }

      .preview-title {
        font-size: var(--font-size-xl);
        font-weight: 700;
        margin: 0;
        background: var(--color-primary-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      /* File Upload */
      .upload-section {
        margin-bottom: var(--spacing-2xl);
      }

      .file-upload-wrapper {
        margin-top: var(--spacing-md);
      }

      .file-input-hidden {
        display: none;
      }

      .file-upload-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-3xl);
        border: 3px dashed var(--border-color);
        border-radius: var(--radius-xl);
        background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
        cursor: pointer;
        transition: all var(--transition-slow);
        gap: var(--spacing-lg);
      }

      .file-upload-area:hover {
        border-color: var(--color-primary);
        background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--bg-primary) 100%);
        box-shadow: var(--shadow-lg);
        transform: translateY(-4px);
      }

      .upload-icon {
        width: 64px;
        height: 64px;
        color: var(--color-primary);
        transition: all var(--transition-slow);
      }

      .file-upload-area:hover .upload-icon {
        transform: scale(1.1);
      }

      .upload-text {
        text-align: center;
      }

      .upload-title {
        font-size: var(--font-size-lg);
        font-weight: 700;
        color: var(--text-primary);
        margin: 0 0 var(--spacing-xs) 0;
      }

      .upload-subtitle {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        margin: 0;
      }

      .files-list {
        margin-top: var(--spacing-lg);
        padding: var(--spacing-lg);
        background: var(--bg-secondary);
        border-radius: var(--radius-lg);
        border: 1px solid var(--border-color);
      }

      .files-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-md);
        padding-bottom: var(--spacing-md);
        border-bottom: 1px solid var(--border-color);
      }

      .files-icon {
        width: 20px;
        height: 20px;
        color: var(--color-primary);
      }

      .files-count {
        font-weight: 700;
        color: var(--text-primary);
        font-size: var(--font-size-sm);
      }

      .file-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm) var(--spacing-md);
        background: var(--bg-primary);
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-xs);
        transition: all var(--transition-base);
      }

      .file-item:hover {
        background: var(--color-primary-light);
        transform: translateX(4px);
      }

      .file-icon {
        width: 18px;
        height: 18px;
        color: var(--color-primary);
      }

      .file-name {
        font-size: var(--font-size-sm);
        font-weight: 600;
        color: var(--text-primary);
        font-family: 'Courier New', monospace;
      }

      /* Textarea */
      .description-section {
        margin-bottom: var(--spacing-xl);
      }

      .textarea-wrapper {
        margin-top: var(--spacing-md);
      }

      .form-textarea {
        width: 100%;
        padding: var(--spacing-lg);
        font-size: var(--font-size-base);
        line-height: 1.6;
        color: var(--text-primary);
        background-color: var(--bg-primary);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-lg);
        resize: vertical;
        min-height: 200px;
        font-family: var(--font-family);
        transition: all var(--transition-slow);
      }

      .form-textarea:hover {
        border-color: var(--color-secondary);
      }

      .form-textarea:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 4px var(--color-primary-light), var(--shadow-md);
        transform: translateY(-2px);
      }

      .textarea-footer {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin-top: var(--spacing-sm);
        padding: var(--spacing-md);
        background: linear-gradient(135deg, var(--color-info) 0.05, rgba(6, 182, 212, 0.02) 100%);
        border-radius: var(--radius-md);
      }

      .textarea-icon {
        width: 18px;
        height: 18px;
        color: var(--color-info);
        flex-shrink: 0;
      }

      .textarea-hint {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        font-weight: 500;
      }

      /* Actions Bar */
      .actions-bar {
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-md);
        margin-top: var(--spacing-2xl);
        margin-bottom: var(--spacing-2xl);
        padding-top: var(--spacing-xl);
        border-top: 2px solid var(--border-color);
      }

      .btn-icon {
        width: 18px;
        height: 18px;
      }

      @media (max-width: 640px) {
        .actions-bar {
          flex-direction: column-reverse;
        }

        .actions-bar .btn {
          width: 100%;
          justify-content: center;
        }

        .config-sidebar {
          position: static;
        }

        .file-upload-area {
          padding: var(--spacing-xl);
        }

        .upload-icon {
          width: 48px;
          height: 48px;
        }
      }
    `,
  ],
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
