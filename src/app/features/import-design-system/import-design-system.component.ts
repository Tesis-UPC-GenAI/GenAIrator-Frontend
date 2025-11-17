import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { DesignSystemService } from '../../core/services/design-system.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-import-design-system',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent],
  template: `
    <div class="page-container">
      <div class="container">
        <div class="dashboard-header">
          <h1>Importar Design System</h1>
          <p class="text-secondary mt-sm">Conecta tus herramientas de diseño favoritas</p>
        </div>

        <div class="grid grid-cols-1 grid-cols-md-2">
          <app-card class="feature-card card-interactive">
            <div
              class="feature-icon"
              style="background: linear-gradient(135deg, #F24E1E 0%, #FF7262 100%);"
            >
              🎨
            </div>
            <h2 class="text-xl font-semibold mb-md">Figma</h2>
            <p class="text-secondary mb-lg">
              Importa componentes, estilos y tokens directamente desde Figma.
            </p>
            <button class="btn btn-primary" disabled>Conectar con Figma</button>
          </app-card>

          <app-card class="feature-card card-interactive">
            <div
              class="feature-icon"
              style="background: linear-gradient(135deg, #18B663 0%, #2DD277 100%);"
            >
              📁
            </div>
            <h2 class="text-xl font-semibold mb-md">Subir Archivos</h2>
            <p class="text-secondary mb-lg">Sube archivos JSON o CSS con tus design tokens.</p>
            <input
              #fileInput
              type="file"
              accept=".json"
              style="display:none"
              (change)="onFileSelected($event)"
            />
            <button class="btn btn-primary" (click)="fileInput.click()">
              Seleccionar Archivos
            </button>
          </app-card>
        </div>

        <app-card class="mt-xl">
          <h2 class="text-xl font-semibold mb-md">📚 ¿Cómo funciona?</h2>
          <div class="grid grid-cols-1 grid-cols-md-3 gap-md mt-lg">
            <div class="text-center">
              <div class="text-3xl mb-md">1️⃣</div>
              <h3 class="font-semibold mb-sm">Conecta</h3>
              <p class="text-sm text-secondary">Conecta tu herramienta de diseño preferida</p>
            </div>
            <div class="text-center">
              <div class="text-3xl mb-md">2️⃣</div>
              <h3 class="font-semibold mb-sm">Importa</h3>
              <p class="text-sm text-secondary">Selecciona los componentes y tokens a importar</p>
            </div>
            <div class="text-center">
              <div class="text-3xl mb-md">3️⃣</div>
              <h3 class="font-semibold mb-sm">Genera</h3>
              <p class="text-sm text-secondary">Genera código optimizado automáticamente</p>
            </div>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: [
    `
      /* Estilos específicos si se necesitan */
    `,
  ],
})
export class ImportDesignSystemComponent {
  constructor(private designSystemService: DesignSystemService, private toastr: ToastrService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    // Validate extension
    if (!/\.json$/i.test(file.name) || file.size > maxSize) {
      this.toastr.error('Archivo no compatible. Solo .json y max 5MB.');
      // reset input
      input.value = '';
      return;
    }

    // Call upload
    this.designSystemService.uploadDesignSystem(file).subscribe({
      next: (res) => {
        this.toastr.success('¡Archivo subido correctamente!');
        input.value = '';
      },
      error: (err) => {
        const msg = err?.error?.error || err?.error?.message || 'Error al subir archivo';
        this.toastr.error(msg);
        input.value = '';
      },
    });
  }
}
