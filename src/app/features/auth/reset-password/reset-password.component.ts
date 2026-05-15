import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css', '../login/login.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  submitted = false;
  linkInvalid = false;

  email = '';
  token = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.route.queryParamMap.subscribe((params) => {
      this.email = (params.get('email') ?? '').trim();
      this.token = (params.get('token') ?? '').trim();
      this.linkInvalid = !this.email || !this.token;
    });

    this.resetForm = this.fb.group(
      {
        contrasena: ['', [Validators.required, Validators.minLength(6)]],
        confirmarContrasena: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('contrasena');
    const confirmPassword = control.get('confirmarContrasena');

    if (!password || !confirmPassword) {
      return null;
    }

    if (confirmPassword.value === '') {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    const errors = confirmPassword.errors;
    if (errors) {
      delete errors['passwordMismatch'];
      if (Object.keys(errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }

    return null;
  }

  get contrasena() {
    return this.resetForm.get('contrasena');
  }

  get confirmarContrasena() {
    return this.resetForm.get('confirmarContrasena');
  }

  getPasswordError(): string {
    if (this.contrasena?.hasError('required') && this.contrasena?.touched) {
      return 'La contraseña es requerida';
    }
    if (this.contrasena?.hasError('minlength') && this.contrasena?.touched) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }

  getConfirmPasswordError(): string {
    if (this.confirmarContrasena?.hasError('required') && this.confirmarContrasena?.touched) {
      return 'Confirma tu contraseña';
    }
    if (this.confirmarContrasena?.hasError('passwordMismatch') && this.confirmarContrasena?.touched) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }

  onSubmit(): void {
    if (this.linkInvalid || this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { contrasena, confirmarContrasena } = this.resetForm.value;

    this.authService
      .resetPassword({
        email: this.email,
        token: this.token,
        contrasena,
        confirmarContrasena,
      })
      .subscribe({
        next: (res) => {
          this.submitted = true;
          this.successMessage =
            res.message || 'Tu contraseña fue actualizada correctamente. Ya puedes iniciar sesión.';
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage =
            error.error?.message || error.message || 'No se pudo restablecer la contraseña';
          this.isLoading = false;
        },
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
