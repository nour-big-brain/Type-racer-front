import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, SignUpResponse } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../modal/user';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent {
  user: User = { username: '', password: '', email: '' };
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

signUp() {
  this.authService.signUp(this.user).subscribe({
    next: (token: string) => {
      this.authService.setToken(token);  // token is just the raw JWT string
      this.successMessage = 'Sign-up successful! Redirecting to login...';
      this.errorMessage = '';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    },
    error: (err) => {
      this.errorMessage = 'Sign-up failed. Please try again.';
      this.successMessage = '';
      console.error('Sign-up error:', err);
    }
  });
}

  route() {
    this.router.navigate(['/login']);
  }
}