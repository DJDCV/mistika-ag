import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Corrección de styleUrls
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email ?? ''; // Valor por defecto
      const password = this.loginForm.value.password ?? ''; // Valor por defecto
      
      this.authService.login(email, password).subscribe({
        next: (response) => {
          const token = response.token;
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.router.navigate(['/dashboard']);
        },
        error: (err) => console.error('Login failed', err)
      });
    } else {
      console.log('Formulario inválido');
    }
  }
  
}
