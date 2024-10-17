import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { PlaceAutocompleteComponent } from '../../../shared/components/place-autocomplete/place-autocomplete.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PlaceAutocompleteComponent, MatToolbarModule, MatInputModule, MatButtonModule, MatOptionModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    confirmPassword: new FormControl('', Validators.required),  
    clientType: new FormControl('', Validators.required),
    place: new FormControl<{
      name: string;
      address: string;
      location: { lat: number; lng: number };
      rating?: number;
      photos: { photoReference: string }[];
      types: string[];
      place_id: string;
    } | null>(null, Validators.required)
  }, { validators: this.passwordMatchValidator });

  clientTypes = ['Restaurante', 'Hotel', 'Otro'];

  constructor(private authService: AuthService, private router: Router) {}

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  onPlaceSelected(place: {
    name: string;
    address: string;
    location: { lat: number; lng: number };
    rating?: number;
    photos: { photoReference: string }[];
    types: string[];
    place_id: string;
  } | null) {
    console.log('Datos del lugar seleccionado:', place);
    this.registerForm.get('place')?.setValue(place || null);
  }  

  register(): void {
    console.log('Datos del formulario:', this.registerForm.value);
    if (this.registerForm.valid) {
      const { confirmPassword, ...formData } = this.registerForm.value;
      this.authService.register(
        formData.username || '',  
        formData.email || '',
        formData.password || '',
        formData.clientType || '',
        formData.place || { name: '', address: '', location: { lat: 0, lng: 0 }, photos: [], types: [], place_id: '' }
      ).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          this.router.navigate(['/login']); 
        },
        error: (error) => {
          console.error('Error al registrar:', error);
        }
      });
    } else {
      console.error('El formulario no es válido');
    }
  }
}
