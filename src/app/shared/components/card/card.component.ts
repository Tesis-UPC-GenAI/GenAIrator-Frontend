import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente reutilizable de tarjeta para agrupar contenido.
 */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {}
