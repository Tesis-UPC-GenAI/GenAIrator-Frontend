import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GenerationService } from '../../core/services/generation.service';
import { Observable } from 'rxjs';
import { GenerationRequest } from '../../core/models/generation-request.model';
import { User } from '../../core/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { ConfirmService } from '../../core/services/confirm.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="projects-page">
      <div class="container">
        <div class="page-header">
          <div class="header-content">
            <h1 class="main-title">Mis Proyectos</h1>
            <p class="subtitle">Gestiona tus proyectos de generación de código y accede a sus resultados.</p>
          </div>
        </div>

        <div class="toolbar">
          <div class="search-container">
            <div class="search-box">
              <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Buscar proyectos..." (input)="onSearch($event)">
            </div>
          </div>

          <div class="filter-tabs">
            <button class="tab-btn" [class.active]="currentFilter === 'all'" (click)="setFilter('all')">Todos</button>
            <button class="tab-btn" [class.active]="currentFilter === 'Completed'" (click)="setFilter('Completed')">Completados</button>
            <button class="tab-btn" [class.active]="currentFilter === 'Processing'" (click)="setFilter('Processing')">En proceso</button>
          </div>

          <a routerLink="/generate" class="btn btn-new-project">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nuevo proyecto
          </a>
        </div>

        <div class="stats-overview">
          <div class="overview-card">
            <div class="overview-icon-box blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <div class="overview-data">
              <span class="ov-label">Total de proyectos</span>
              <span class="ov-value">{{ proyectos.length }}</span>
              <span class="ov-sub">En todos los estados</span>
            </div>
          </div>

          <div class="overview-card">
            <div class="overview-icon-box green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div class="overview-data">
              <span class="ov-label">Completados</span>
              <span class="ov-value">{{ getCountByStatus('Completed') }}</span>
              <span class="ov-sub">{{ getPercentage('Completed') }}% del total</span>
            </div>
          </div>

          <div class="overview-card">
            <div class="overview-icon-box orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div class="overview-data">
              <span class="ov-label">En proceso</span>
              <span class="ov-value">{{ getCountByStatus('Processing') }}</span>
              <span class="ov-sub">{{ getPercentage('Processing') }}% del total</span>
            </div>
          </div>

          <div class="overview-card">
            <div class="overview-icon-box purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            </div>
            <div class="overview-data">
              <span class="ov-label">Líneas de código generadas</span>
              <span class="ov-value">{{ getTotalLines() | number }}</span>
              <span class="ov-sub">Total en todos los proyectos</span>
            </div>
          </div>
        </div>

        <div *ngIf="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando tus proyectos...</p>
        </div>

        <div *ngIf="!loading && filteredProjects.length === 0" class="empty-state">
           <div class="empty-icon">📂</div>
           <h3>No se encontraron proyectos</h3>
           <p>Intenta cambiar los filtros o crea uno nuevo para empezar.</p>
        </div>

        <div class="projects-grid" *ngIf="!loading && filteredProjects.length > 0">
          <div class="project-card" *ngFor="let p of filteredProjects">
            <div class="card-top">
              <div class="tech-icon-box">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                   <polyline points="16 18 22 12 16 6"></polyline>
                   <polyline points="8 6 2 12 8 18"></polyline>
                 </svg>
              </div>
              <div class="card-title-group">
                <h3 class="p-name">{{ p.projectName || p.framework }}</h3>
                <span class="p-info">ID: {{ p.id || p.generationRequestId }} • {{ p.framework }} • {{ p.lenguaje || 'TypeScript' }}</span>
              </div>
              <div class="status-badge-container">
                <div class="status-badge" [ngClass]="(p.status || p.estado)?.toLowerCase() || ''">
                  {{ getStatusLabel(p.status || p.estado) }}
                </div>
              </div>
            </div>

            <div class="card-meta">
              <div class="date-container">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{{ p.fechaCreacion | date:'MMM d, y, h:mm:ss a' }}</span>
              </div>
            </div>

            <div class="card-metrics">
              <div class="metric-item">
                <div class="m-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <div class="m-val">
                  <span class="num">{{ p.componentesGenerados || 0 }}</span>
                  <span class="lab">Componentes</span>
                </div>
              </div>
              
              <div class="metric-divider"></div>

              <div class="metric-item">
                <div class="m-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                </div>
                <div class="m-val">
                  <span class="num">{{ p.lineasDeCodigo || 0 }}</span>
                  <span class="lab">Líneas de código</span>
                </div>
              </div>

              <div class="metric-divider"></div>

              <div class="metric-item">
                <div class="m-icon">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                </div>
                <div class="m-val">
                  <span class="num">{{ (p.totalTokens || 0) | number }}</span>
                  <span class="lab">Tokens</span>
                </div>
              </div>
            </div>

            <div class="card-footer-divider"></div>

            <div class="card-actions">
              <a [routerLink]="['/results', p.id || p.generationRequestId]" class="btn-main-action">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Ver detalles
              </a>
              <button class="btn-sub-action" (click)="onDownload(p.id || p.generationRequestId)" [disabled]="(p.status || p.estado) !== 'Completed'">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Descargar
              </button>
              <button class="btn-icon-action" 
                      [disabled]="(p.status || p.estado) !== 'Completed' || isPushingToGitHub || !(currentUser$ | async)?.gitHubPatExists"
                      [class.spinning]="pushingGenerationId === (p.id || p.generationRequestId)"
                      (click)="onPushToGitHub(p); $event.stopPropagation()"
                      [title]="!(currentUser$ | async)?.gitHubPatExists ? 'Configura tu GitHub PAT en Configuración para publicar proyectos.' : (isPushingToGitHub ? 'Subida en curso' : (p.gitHubRepoUrl ? 'Actualizar en GitHub' : 'Subir a GitHub'))">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </button>
              <div class="actions-menu-container">
                <button class="btn-icon-action" (click)="toggleCardMenu(p, $event)" title="Más opciones">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                </button>
                <div class="card-menu-dropdown" *ngIf="activeMenuProjectId === (p.id || p.generationRequestId)" (click)="$event.stopPropagation()">
                  <button (click)="onDeleteProject(p)" class="menu-item danger">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    Eliminar proyecto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .projects-page {
        background-color: #fcfcfd;
        min-height: 100vh;
        padding: 40px 0 60px 0;
      }

      .page-header { margin-bottom: 40px; }
      .main-title {
        font-size: 44px;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 12px;
        letter-spacing: -0.04em;
      }
      .subtitle {
        font-size: 16px;
        color: #64748b;
        font-weight: 500;
      }

      .toolbar {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 40px;
      }
      .search-container { flex: 1; }
      .search-box {
        position: relative;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        display: flex;
        align-items: center;
        padding: 0 16px;
        height: 52px;
        transition: all 0.2s;
      }
      .search-box:focus-within {
        border-color: #2563eb;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
      }
      .search-icon { color: #94a3b8; margin-right: 12px; }
      .search-box input {
        border: none;
        outline: none;
        background: transparent;
        font-size: 15px;
        font-weight: 500;
        width: 100%;
        color: #0f172a;
      }
      .search-kbd {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 4px 8px;
        font-size: 11px;
        color: #94a3b8;
        font-weight: 700;
        margin-left: 12px;
      }
      .filter-tabs {
        display: flex;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 6px;
      }
      .tab-btn {
        padding: 10px 24px;
        border: none;
        background: transparent;
        font-size: 14px;
        font-weight: 700;
        color: #64748b;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .tab-btn:hover { color: #0f172a; background: #f8fafc; }
      .tab-btn.active { background: #f0fdf4; color: #16a34a; }

      .btn-new-project {
        background: #2563eb;
        color: white;
        height: 52px;
        padding: 0 24px;
        border-radius: 14px;
        font-size: 15px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        transition: all 0.2s;
        text-decoration: none;
      }
      .btn-new-project:hover {
        background: #1d4ed8;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
      }

      /* Stats Overview */
      .stats-overview {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
        margin-bottom: 48px;
      }
      .overview-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 24px;
        padding: 24px;
        display: flex;
        align-items: center;
        gap: 20px;
      }
      .overview-icon-box {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .overview-icon-box.blue { background: #eff6ff; color: #2563eb; }
      .overview-icon-box.green { background: #f0fdf4; color: #16a34a; }
      .overview-icon-box.orange { background: #fff7ed; color: #f97316; }
      .overview-icon-box.purple { background: #f5f3ff; color: #7c3aed; }
      .overview-data { display: flex; flex-direction: column; }
      .ov-label { font-size: 12px; font-weight: 700; color: #94a3b8; margin-bottom: 4px; text-transform: uppercase; }
      .ov-value { font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1; }
      .ov-sub { font-size: 12px; font-weight: 500; color: #94a3b8; }

      /* Grid */
      .projects-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 32px;
      }

      .project-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 28px;
        padding: 32px;
        display: flex;
        flex-direction: column;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 1px 4px rgba(0,0,0,0.02);
      }
      .project-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
      }

      .card-top {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;
      }
      .tech-icon-box {
        width: 64px;
        height: 64px;
        border-radius: 18px;
        background: linear-gradient(135deg, #3b82f6, #6366f1);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        box-shadow: 0 8px 16px rgba(59, 130, 246, 0.2);
      }
      .card-title-group { flex: 1; }
      .p-name {
        font-size: 24px;
        font-weight: 800;
        color: #0f172a;
        margin: 0 0 4px 0;
        letter-spacing: -0.02em;
      }
      .p-info {
        font-size: 13px;
        font-weight: 600;
        color: #94a3b8;
        display: block;
      }
      .status-badge-container {
        display: flex;
        align-items: center;
        height: 64px;
      }
      .status-badge {
        font-size: 11px;
        font-weight: 800;
        padding: 6px 14px;
        border-radius: 100px;
        border: 2px solid transparent;
        letter-spacing: 0.05em;
      }
      .status-badge.completed { background: #f0fdf4; color: #16a34a; border-color: #16a34a; }
      .status-badge.processing { background: #eff6ff; color: #2563eb; border-color: #2563eb; }
      .status-badge.failed { background: #fef2f2; color: #ef4444; border-color: #ef4444; }

      .card-meta { margin-bottom: 32px; }
      .date-container {
        background: #fcfcfd;
        border-radius: 14px;
        padding: 14px 18px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 13px;
        font-weight: 600;
        color: #64748b;
        border: 1px solid #f1f5f9;
      }

      .card-metrics {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
      }
      .metric-item { display: flex; align-items: center; gap: 12px; flex: 1; }
      .metric-divider { width: 1px; height: 32px; background: #f1f5f9; margin: 0 12px; }
      .m-val { display: flex; flex-direction: column; }
      .m-val .num {
        font-size: 17px;
        font-weight: 800;
        color: #0f172a;
        line-height: 1.1;
        margin-bottom: 2px;
      }
      .m-val .lab { font-size: 12px; font-weight: 600; color: #94a3b8; white-space: nowrap; }

      .card-footer-divider {
        height: 1px;
        background: #f1f5f9;
        margin: 0 -32px 24px -32px;
      }

      .card-actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .btn-main-action {
        background: #2563eb;
        color: white;
        height: 48px;
        border-radius: 14px;
        font-size: 14px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        flex: 1.4;
        text-decoration: none;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        transition: all 0.2s;
      }
      .btn-main-action:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3); }
      .btn-sub-action {
        background: white;
        border: 1px solid #e2e8f0;
        color: #334155;
        height: 48px;
        border-radius: 14px;
        font-size: 14px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        flex: 1;
        cursor: pointer;
        transition: all 0.2s;
      }
      .btn-sub-action:hover:not(:disabled) { background: #fcfcfd; border-color: #cbd5e1; transform: translateY(-1px); }
      .btn-sub-action:disabled { opacity: 0.5; cursor: not-allowed; }
      .btn-icon-action {
        width: 48px;
        height: 48px;
        background: white;
        border: 1px solid #e2e8f0;
        color: #64748b;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 14px;
        cursor: pointer;
        transition: all 0.2s;
        padding: 0;
        flex-shrink: 0;
      }
      .btn-icon-action:hover { background: #fcfcfd; color: #0f172a; transform: translateY(-1px); }
      .btn-icon-action:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .btn-icon-action.spinning svg {
        animation: spin 1s linear infinite;
      }

      .actions-menu-container {
        position: relative;
        display: inline-block;
      }
      .card-menu-dropdown {
        position: absolute;
        bottom: calc(100% + 8px);
        right: 0;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        z-index: 50;
        min-width: 180px;
        padding: 6px;
        animation: fadeInUp 0.2s ease-out;
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .menu-item {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        background: none;
        border: none;
        font-size: 13px;
        font-weight: 600;
        color: #475569;
        text-align: left;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
      }
      .menu-item:hover:not(:disabled) {
        background: #f1f5f9;
        color: #0f172a;
      }
      .menu-item:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .menu-item.danger {
        color: #ef4444;
      }
      .menu-item.danger:hover:not(:disabled) {
        background: #fef2f2;
        color: #ef4444;
      }
      .menu-divider {
        height: 1px;
        background: #f1f5f9;
        margin: 6px 0;
      }

      .loading-state, .empty-state {
        padding: 100px;
        text-align: center;
        background: white;
        border-radius: 28px;
        border: 2px dashed #e2e8f0;
      }
      .empty-icon { font-size: 56px; margin-bottom: 20px; }
      .spinner {
        width: 40px; height: 40px;
        border: 4px solid #f1f5f9;
        border-top-color: #2563eb;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      @media (max-width: 1400px) { .projects-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 1024px) { .stats-overview { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 768px) {
        .projects-grid { grid-template-columns: 1fr; }
        .stats-overview { grid-template-columns: 1fr; }
        .toolbar { flex-direction: column; align-items: stretch; }
        .main-title { font-size: 36px; }
      }
    `,
  ],
})
export class ProjectsComponent implements OnInit {
  proyectos: GenerationRequest[] = [];
  filteredProjects: GenerationRequest[] = [];
  loading = true;
  error: string | null = null;

  currentFilter: string = 'all';
  searchTerm: string = '';

  isPushingToGitHub = false;
  pushingGenerationId?: number;
  activeMenuProjectId: number | null = null;
  currentUser$?: Observable<User | null>;

  constructor(
    private generationService: GenerationService,
    private toastr: ToastrService,
    private confirmService: ConfirmService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.currentUser$ = this.userService.currentUser$;
    this.userService.getMe().subscribe({ next: () => {}, error: () => {} });
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.generationService.getAllRequests().subscribe({
      next: (proyectos) => {
        this.proyectos = proyectos;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando proyectos:', err);
        this.error = 'No se pudieron cargar los proyectos.';
        this.toastr.error('Error al cargar proyectos');
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    let filtered = [...this.proyectos];

    // Filter by status
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(p => (p.status || p.estado) === this.currentFilter);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        (p.projectName?.toLowerCase().includes(term)) ||
        (p.projectDescription?.toLowerCase().includes(term)) ||
        (p.id?.toString().includes(term))
      );
    }

    this.filteredProjects = filtered;
  }

  setFilter(filter: string): void {
    this.currentFilter = filter;
    this.applyFilters();
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  getCountByStatus(status: string): number {
    return this.proyectos.filter(p => (p.status || p.estado) === status).length;
  }

  getPercentage(status: string): number {
    if (this.proyectos.length === 0) return 0;
    const count = this.getCountByStatus(status);
    return Math.round((count / this.proyectos.length) * 100);
  }

  getTotalLines(): number {
    return this.proyectos.reduce((acc, p) => acc + (p.lineasDeCodigo || 0), 0);
  }

  onDownload(id?: number | null) {
    if (!id) return;
    this.generationService.downloadProject(id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `project_${id}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        this.toastr.success('Descarga iniciada');
      },
      error: (err) => {
        console.error('Error downloading project', err);
        this.toastr.error('Error al descargar el proyecto');
      },
    });
  }

  getStatusLabel(status: string | undefined): string {
    const s = status?.toLowerCase();
    switch (s) {
      case 'completed': return 'COMPLETADO';
      case 'processing': return 'EN PROCESO';
      case 'failed': return 'FALLIDO';
      default: return (status || '').toUpperCase();
    }
  }

  async onPushToGitHub(p: GenerationRequest) {
    const id = p.id || p.generationRequestId;
    if (id === undefined || this.isPushingToGitHub) return;
    const requestId = Number(id);

    const hasPublished = !!p.gitHubRepoUrl?.trim();
    const confirmed = await this.confirmService.confirm({
      title: hasPublished ? 'Actualizar en GitHub' : 'Subir a GitHub',
      message: hasPublished
        ? 'El repositorio ya está vinculado. Se actualizará el contenido en GitHub (o se recreará si lo eliminaste). ¿Continuar?'
        : '¿Subir este proyecto a GitHub usando tu PAT guardado?',
      confirmText: hasPublished ? 'Actualizar' : 'Subir Proyecto',
      type: 'info'
    });

    if (!confirmed) return;

    this.isPushingToGitHub = true;
    this.pushingGenerationId = requestId;
    this.activeMenuProjectId = null;

    this.generationService.pushToGitHub(requestId).subscribe({
      next: (res) => {
        p.gitHubRepoUrl = res.repoUrl;
        this.toastr.success('Proyecto subido correctamente a GitHub.');
        if (res.repoUrl) {
          this.toastr.info(res.repoUrl, 'Repositorio en GitHub', {
            timeOut: 8000,
            closeButton: true,
          });
        }
        this.isPushingToGitHub = false;
        this.pushingGenerationId = undefined;
        this.loadProjects();
      },
      error: (err) => {
        this.isPushingToGitHub = false;
        this.pushingGenerationId = undefined;
        this.toastr.error(
          this.extractApiErrorMessage(err, 'Error al subir a GitHub'),
          'Error de publicación'
        );
      },
    });
  }

  async onDeleteProject(p: GenerationRequest) {
    const id = p.id || p.generationRequestId;
    if (id === undefined) return;

    const confirmed = await this.confirmService.confirm({
      title: 'Eliminar Proyecto',
      message: '¿Estás seguro de que deseas eliminar este proyecto generado? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar definitivamente',
      type: 'danger'
    });

    if (!confirmed) return;
    this.activeMenuProjectId = null;

    this.generationService.deleteProject(Number(id)).subscribe({
      next: () => {
        this.toastr.success('Proyecto eliminado correctamente');
        this.loadProjects();
      },
      error: () => this.toastr.error('No se pudo eliminar el proyecto'),
    });
  }

  toggleCardMenu(p: GenerationRequest, event: MouseEvent): void {
    event.stopPropagation();
    const id = p.id || p.generationRequestId;
    if (id !== undefined) {
      this.activeMenuProjectId = this.activeMenuProjectId === id ? null : id;
    }
  }

  @HostListener('document:click')
  closeAllMenus(): void {
    this.activeMenuProjectId = null;
  }

  private extractApiErrorMessage(err: unknown, fallback: string): string {
    if (!err || typeof err !== 'object') {
      return fallback;
    }

    const httpErr = err as { error?: unknown; message?: string };
    const body = httpErr.error;

    if (typeof body === 'string' && body.trim().length > 0) {
      return body;
    }

    if (body && typeof body === 'object') {
      const payload = body as { message?: string; title?: string };
      if (payload.message) {
        return payload.message;
      }
      if (payload.title) {
        return payload.title;
      }
    }

    if (httpErr.message) {
      return httpErr.message;
    }

    try {
      return JSON.stringify(body ?? err);
    } catch {
      return fallback;
    }
  }
}
