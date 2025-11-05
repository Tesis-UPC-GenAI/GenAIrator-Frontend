import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Componente reutilizable de input con soporte para formularios reactivos
 * y accesibilidad completa (WCAG AA).
 */
@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-group">
      <label
        *ngIf="label"
        [for]="id"
        class="form-label">
        {{ label }}
        <span *ngIf="required" class="text-error" aria-label="requerido">*</span>
      </label>

      <input
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [attr.aria-invalid]="isInvalid"
        [attr.aria-describedby]="errorId"
        [attr.aria-required]="required"
        class="form-input"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onBlur()"
      />

      <div
        *ngIf="isInvalid && errorMessage"
        [id]="errorId"
        class="form-error"
        role="alert">
        {{ errorMessage }}
      </div>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = `input-${Math.random().toString(36).substring(2, 9)}`;
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() errorMessage = '';
  @Input() isInvalid = false;

  value = '';
  disabled = false;

  get errorId(): string {
    return `${this.id}-error`;
  }

  // ControlValueAccessor implementation
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
