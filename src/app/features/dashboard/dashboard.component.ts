import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { GenerationService } from '../../core/services/generation.service';
import { Observable } from 'rxjs';
import { GenerationRequest } from '../../core/models/generation-request.model';
import { User } from '../../core/models/user.model';
import { CardComponent } from '../../shared/components/card/card.component';

/**
 * Componente de Dashboard (protegido).
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  proyectosRecientes$!: Observable<GenerationRequest[]>;
  constructor(private authService: AuthService, private generationService: GenerationService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.proyectosRecientes$ = this.generationService.getRequests();
  }
}
