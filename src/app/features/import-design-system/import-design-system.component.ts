import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-import-design-system',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent],
  template: `
    <div class="page-container">
      <div class="container">
        <div class="dashboard-header">
          <h1>¿Cómo funciona?</h1>
          <p class="text-secondary mt-sm">
            Flujo de generación: diseño → descripción → proyecto fullstack
          </p>
        </div>

        <app-card class="mt-lg">
          <div class="grid grid-cols-1 grid-cols-md-3 gap-md mt-lg">
            <div class="text-center">
              <div class="text-3xl mb-md">1️⃣</div>
              <h3 class="font-semibold mb-sm">Diseña y Sube</h3>
              <p class="text-sm text-secondary">
                Diseña tu interfaz en Figma o tu herramienta preferida y sube el código frontend
                como un archivo ZIP. El generador usará los archivos subidos como fuente canónica.
              </p>
            </div>

            <div class="text-center">
              <div class="text-3xl mb-md">2️⃣</div>
              <h3 class="font-semibold mb-sm">Describe y Configura</h3>
              <p class="text-sm text-secondary">
                Describe la lógica de negocio en el campo de texto. Puedes subir tu frontend o usar
                nuestras plantillas para que la IA genere o hidrate componentes.
              </p>
            </div>

            <div class="text-center">
              <div class="text-3xl mb-md">3️⃣</div>
              <h3 class="font-semibold mb-sm">Generación Fullstack</h3>
              <p class="text-sm text-secondary">
                Nuestra IA fusiona el diseño visual con la lógica backend (.NET) y genera tu
                proyecto completo.
              </p>
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
  // This component was repurposed as a help page. No upload logic required.
}
