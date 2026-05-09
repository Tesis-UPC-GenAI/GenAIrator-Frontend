import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      height: 100%;
    }

    .card {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }
  `]
})
export class CardComponent {}
