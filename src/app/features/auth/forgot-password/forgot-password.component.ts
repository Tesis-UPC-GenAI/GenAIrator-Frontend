import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  submitted = false;

  private readonly genericSuccessMessage =
    'Si el correo existe, enviaremos instrucciones de recuperación.';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.forgotForm.get('email');
  }

  getEmailError(): string {
    if (this.email?.hasError('required') && this.email?.touched) {
      return 'El email es requerido';
    }
    if (this.email?.hasError('email') && this.email?.touched) {
      return 'Email inválido';
    }
    return '';
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const email = (this.forgotForm.value.email as string).trim();

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.submitted = true;
        this.successMessage = this.genericSuccessMessage;
        this.isLoading = false;
      },
      error: () => {
        this.submitted = true;
        this.successMessage = this.genericSuccessMessage;
        this.isLoading = false;
      },
    });
  }
}
