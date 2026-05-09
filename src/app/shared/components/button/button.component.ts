import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      [attr.aria-busy]="loading">
      <span *ngIf="loading" class="sr-only">Cargando...</span>
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'link' = 'primary';
  @Input() disabled = false;
  @Input() loading = false;

  get buttonClasses(): string {
    const baseClass = 'btn';
    const variantClass = `btn-${this.variant}`;
    return `${baseClass} ${variantClass}`;
  }
}
