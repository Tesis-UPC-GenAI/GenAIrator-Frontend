import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../../../core/services/confirm.service';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="onCancel()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-icon" [ngClass]="type">
            <svg *ngIf="type === 'warning'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
            <svg *ngIf="type === 'danger'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            <svg *ngIf="type === 'info'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </div>
          <h3 class="modal-title">{{ title }}</h3>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" *ngIf="showCancel" (click)="onCancel()">{{ cancelText }}</button>
          <button class="btn-confirm" [ngClass]="type" (click)="onConfirm()">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.2s ease-out;
    }

    .modal-container {
      background: white;
      border-radius: 24px;
      width: 90%;
      max-width: 400px;
      padding: 32px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .modal-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 16px;
    }

    .modal-icon {
      width: 64px;
      height: 64px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }

    .modal-icon.warning { background: #fffbeb; color: #f59e0b; }
    .modal-icon.danger { background: #fef2f2; color: #ef4444; }
    .modal-icon.info { background: #eff6ff; color: #3b82f6; }

    .modal-title {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .modal-body {
      text-align: center;
      margin-bottom: 32px;
    }

    .modal-body p {
      font-size: 15px;
      color: #64748b;
      line-height: 1.6;
      margin: 0;
    }

    .modal-footer {
      display: flex;
      gap: 12px;
    }

    .modal-footer button {
      flex: 1;
      padding: 14px;
      border-radius: 14px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      font-family: 'Inter', sans-serif;
    }

    .btn-cancel {
      background: #f1f5f9;
      color: #475569;
    }

    .btn-cancel:hover { background: #e2e8f0; transform: translateY(-1px); }

    .btn-confirm.info { background: #2563eb; color: white; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
    .btn-confirm.info:hover { background: #1d4ed8; transform: translateY(-1px); }

    .btn-confirm.warning { background: #f59e0b; color: white; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2); }
    .btn-confirm.warning:hover { background: #d97706; transform: translateY(-1px); }

    .btn-confirm.danger { background: #ef4444; color: white; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2); }
    .btn-confirm.danger:hover { background: #dc2626; transform: translateY(-1px); }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class ConfirmModalComponent implements OnInit {
  isOpen = false;
  title = '';
  message = '';
  confirmText = 'Aceptar';
  cancelText = 'Cancelar';
  type: 'info' | 'warning' | 'danger' = 'info';
  showCancel = true;

  constructor(private confirmService: ConfirmService) {}

  ngOnInit(): void {
    this.confirmService.options$.subscribe(options => {
      if (options) {
        this.title = options.title;
        this.message = options.message;
        this.confirmText = options.confirmText || 'Aceptar';
        this.cancelText = options.cancelText || 'Cancelar';
        this.type = options.type || 'info';
        this.showCancel = options.showCancel !== undefined ? options.showCancel : true;
        this.isOpen = true;
      } else {
        this.isOpen = false;
      }
    });
  }

  onConfirm() {
    this.confirmService.resolve(true);
  }

  onCancel() {
    this.confirmService.resolve(false);
  }
}
