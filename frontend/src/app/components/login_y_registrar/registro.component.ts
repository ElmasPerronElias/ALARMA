import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, RegisterRequest } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get password2() {
    return this.registerForm.get('password2');
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('password2')?.value ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Por favor completa el formulario correctamente.';
      this.successMessage = '';
      return;
    }

    const userData: RegisterRequest = this.registerForm.value;
    this.apiService.register(userData).subscribe({
      next: (response) => {
        this.successMessage = 'Registro exitoso. Ahora puedes iniciar sesión.';
        this.errorMessage = '';
        this.registerForm.reset();
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Error en el registro. Intenta de nuevo.';
        this.successMessage = '';
      }
    });
  }
}