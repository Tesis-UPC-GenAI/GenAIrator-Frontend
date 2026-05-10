import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger';
  showCancel?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private confirmSubject = new Subject<boolean>();
  private optionsSubject = new Subject<ConfirmOptions | null>();

  confirm$ = this.confirmSubject.asObservable();
  options$ = this.optionsSubject.asObservable();

  confirm(options: ConfirmOptions): Promise<boolean> {
    this.optionsSubject.next(options);
    return new Promise((resolve) => {
      const subscription = this.confirm$.subscribe((result) => {
        subscription.unsubscribe();
        resolve(result);
      });
    });
  }

  resolve(result: boolean) {
    this.optionsSubject.next(null);
    this.confirmSubject.next(result);
  }
}
