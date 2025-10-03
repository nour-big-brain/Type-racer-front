import { Component, OnInit } from '@angular/core';
import { ResultService } from '../../services/result.service';
import { CommonModule } from '@angular/common';
import { Result } from '../../modal/result';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  leaderboard: Result[] = [];
  errorMessage: string = '';

  constructor(private resultService: ResultService, private router: Router) {}

  ngOnInit() {
    this.loadLeaderboard();
  }

  loadLeaderboard() {
    this.resultService.getLeaderboard(10).subscribe({
      next: (results) => {
        this.leaderboard = results;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load leaderboard. Please try again.';
        console.error('Leaderboard error:', err);
      }
    });
  }

  navigateToHome() {
    this.router.navigate(['/']);

  }
}