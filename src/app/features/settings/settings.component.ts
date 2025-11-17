import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="container" style="max-width:600px; margin:0 auto;">
        <h2>Configuración</h2>
        <p>
          Guarda tu GitHub Personal Access Token (PAT) para poder subir repositorios desde la
          interfaz.
        </p>

        <div class="card">
          <div class="card-body">
            <label for="pat">GitHub PAT</label>
            <input id="pat" [(ngModel)]="pat" class="form-control" placeholder="ghp_..." />
            <div style="margin-top:12px; display:flex; gap:8px;">
              <button class="btn btn-primary" (click)="save()">Guardar</button>
              <button class="btn btn-secondary" (click)="clear()">Borrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SettingsComponent {
  pat: string | null = null;

  constructor(private userService: UserService, private toastr: ToastrService) {}

  save() {
    this.userService.savePat(this.pat).subscribe({
      next: () => {
        this.toastr.success('PAT guardado correctamente');
        // ensure other components get updated user state
        this.userService.getMe().subscribe({ next: () => {}, error: () => {} });
      },
      error: () => this.toastr.error('Error guardando el PAT'),
    });
  }

  clear() {
    this.pat = null;
    this.userService.savePat(null).subscribe({
      next: () => {
        this.toastr.success('PAT eliminado');
        this.userService.getMe().subscribe({ next: () => {}, error: () => {} });
      },
      error: () => this.toastr.error('Error eliminando el PAT'),
    });
  }
}
