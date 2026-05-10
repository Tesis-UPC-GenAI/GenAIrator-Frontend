import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { GenerationService } from '../../core/services/generation.service';
import { DesignSystemService } from '../../core/services/design-system.service';
import { Observable, forkJoin } from 'rxjs';
import { GenerationRequest } from '../../core/models/generation-request.model';
import { User } from '../../core/models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  proyectosRecientes$!: Observable<GenerationRequest[]>;
  totalProyectos = 0;
  totalDesigns = 0;
  totalGenerados = 0;
  loading = true;

  constructor(
    private authService: AuthService,
    private generationService: GenerationService,
    private designService: DesignSystemService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.proyectosRecientes$ = this.generationService.getRequests();

    // Fetch stats
    forkJoin({
      projects: this.generationService.getAllRequests(),
      designs: this.designService.getDesignSystems()
    }).subscribe({
      next: (res) => {
        this.totalProyectos = res.projects.length;
        this.totalDesigns = res.designs.length;
        this.totalGenerados = res.projects.filter(p => p.status === 'Completed' || p.estado === 'Completed').length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard stats', err);
        if (err.status === 401) {
          this.toastr.error('Tu sesión ha expirado');
        } else {
          this.toastr.error('Error al cargar estadísticas');
        }
        this.loading = false;
      }
    });
  }
}

