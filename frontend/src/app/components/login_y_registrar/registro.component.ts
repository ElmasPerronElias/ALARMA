import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  registroForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService
  ) {
    this.registroForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      password2: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const password2 = group.get('password2')?.value;
    return password === password2 ? null : { mismatch: true };
  }

  onSubmit() {
    console.log('=== INICIO DE REGISTRO ===');
    
    if (this.registroForm.invalid) {
      console.log('Formulario inválido:', this.registroForm.errors);
      this.registroForm.markAllAsTouched();
      this.errorMessage = 'Por favor completa el formulario correctamente';
      return;
    }

    const formData = this.registroForm.value;
    console.log('Datos a enviar:', formData);

    this.apiService.register(formData).subscribe({
      next: (response) => {
        console.log('✅ REGISTRO EXITOSO:', response);
        this.successMessage = 'Usuario registrado exitosamente. Redirigiendo...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        console.error('❌ ERROR EN REGISTRO:');
        console.error('Status code:', err.status);
        console.error('Mensaje:', err.message);
        console.error('Error completo:', err.error);
        console.error('Headers:', err.headers);
        
        // Mostrar mensaje específico según el error
        if (err.status === 0) {
          this.errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté corriendo.';
        } else if (err.status === 400) {
          this.errorMessage = err.error?.error || err.error?.message || 'Datos inválidos. Verifica la información.';
        } else if (err.status === 500) {
          this.errorMessage = 'Error interno del servidor. Contacta al administrador.';
        } else {
          this.errorMessage = err.error?.error || err.message || 'Error al registrar usuario';
        }
        
        // Mostrar el error detallado debajo del formulario
        this.errorMessage += ' - Revisa la consola (F12) para más detalles.';
      }
    });
  }
}