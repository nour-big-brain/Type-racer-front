import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ResultService } from '../../services/result.service';
import { UserService } from '../../services/user.service'; // Add UserService
import { CommonModule } from '@angular/common';
import { Result } from '../../modal/result';
import { User } from '../../modal/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string = '';
  email: string = '';
  results: Result[] = [];
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private resultService: ResultService,
    private userService: UserService, // Inject UserService
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { state: { redirectUrl: '/profile' } });
    } else {
      this.loadUserProfile();
      this.loadUserResults();
    }
  }

  loadUserProfile() {
    this.userService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.username = user.username;
        if (user.email){
        this.email = user.email;}
        else{ this.email = 'Not provided';}
      },
      error: (err) => {
        this.errorMessage = 'Failed to load user profile. Please try again.';
        console.error('Profile fetch error:', err);
      }
    });
  }

  loadUserResults() {
    this.resultService.getMyResults().subscribe({
      next: (results) => {
        this.results = results;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load your results. Please try again.';
        console.error('Profile results error:', err);
      }
    });
  }

  route() {
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}