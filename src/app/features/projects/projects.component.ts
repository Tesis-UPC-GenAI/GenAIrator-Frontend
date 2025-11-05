import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent],
  template: `
    <div class="page-container">
      <div class="container">
        <div class="dashboard-header">
          <h1>Mis Proyectos</h1>
          <p class="text-secondary mt-sm">
            Gestiona todos tus proyectos de generación de código
          </p>
        </div>

        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <h2 class="empty-state-title">No tienes proyectos todavía</h2>
          <p class="empty-state-description">
            Comienza creando tu primer proyecto o importando un design system.
          </p>
          <div class="flex gap-md justify-center">
            <a routerLink="/import-design-system" class="btn btn-primary">
              Importar Design System
            </a>
            <a routerLink="/generate" class="btn btn-secondary">
              Nuevo Proyecto
            </a>
          </div>
        </div>

        <!-- Esta sección se mostrará cuando haya proyectos -->
        <!--
        <div class="grid grid-cols-1 grid-cols-md-2 grid-cols-lg-3">
          <app-card class="card-interactive">
            <div class="flex justify-between items-center mb-md">
              <h3 class="text-lg font-semibold">Nombre del Proyecto</h3>
              <span class="badge badge-success">Activo</span>
            </div>
            <p class="text-secondary mb-lg text-sm">
              Descripción del proyecto y sus detalles...
            </p>
            <div class="flex gap-sm">
              <button class="btn btn-primary">Abrir</button>
              <button class="btn btn-secondary">Editar</button>
            </div>
          </app-card>
        </div>
        -->
      </div>
    </div>
  `,
  styles: [`
    /* Estilos específicos si se necesitan */
  `]
})
export class ProjectsComponent {}
