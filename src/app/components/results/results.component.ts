import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResultService } from '../../services/result.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Result } from '../../modal/result';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  wpm: number = 0;
  accuracy: number = 0;
  timeTaken: number = 0;
  carType: string = '';
  carDescription: string = '';
  carImage: string = '';

  private readonly PENDING_RESULT_KEY = 'pendingTypingResult';

  constructor(
    private router: Router,
    private resultService: ResultService,
    private authService: AuthService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { wpm: number; accuracy: number; timeTaken: number } | undefined;
    
    if (state) {
      this.wpm = state.wpm;
      this.accuracy = state.accuracy;
      this.timeTaken = state.timeTaken;
    } else {
      // Try to load from pending result (after login redirect)
      const pendingResult = this.loadPendingResult();
      if (pendingResult) {
        this.wpm = pendingResult.wpm;
        this.accuracy = pendingResult.accuracy;
        this.timeTaken = pendingResult.timeTaken;
      } else {
        this.router.navigate(['/type-test']);
        return;
      }
    }
  }

  ngOnInit() {
    this.determineCar();
    
    // If user is logged in and there's a pending result, auto-save it
    if (this.authService.isLoggedIn() && this.hasPendingResult()) {
      this.autoSavePendingResult();
    }
  }

  determineCar() {
    if (this.wpm >= 100 && this.accuracy >= 95) {
      this.carType = 'Supercar';
      this.carDescription = 'Like a Lamborghini Aventador: blistering speed and pinpoint precision. You\'re at the top of your game!';
      this.carImage = 'Lamborghini.jpg';
    } else if (this.wpm >= 70 && this.accuracy >= 90) {
      this.carType = 'Sports Car';
      this.carDescription = 'Similar to a Porsche 911: fast, agile, and reliable. Great performance with room to push harder.';
      this.carImage = 'Porsche.jpg';
    } else if (this.wpm >= 50 && this.accuracy >= 85) {
      this.carType = 'Electric Vehicle';
      this.carDescription = 'Evoking a Tesla Model S: efficient, modern, and eco-friendly. Smooth acceleration with innovative flair.';
      this.carImage = 'Tesla.jpg';
    } else if (this.wpm >= 30 && this.accuracy >= 80) {
      this.carType = 'Classic Car';
      this.carDescription = 'Reminiscent of a Ford Mustang: timeless style with character. A bit of polishing will make it shine.';
      this.carImage = 'ford.jpg';
    } else {
      this.carType = 'Compact Car';
      this.carDescription = 'Like a Toyota Corolla: practical and dependable. Focus on basics to build up speed and accuracy.';
      this.carImage = 'toyota.jpg';
    }
  }

  saveResult() {
    if (!this.authService.isLoggedIn()) {
      // Store result before redirecting to login
      this.storePendingResult();
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/results' }
      });
    } else {
      this.performSave();
    }
  }

  private performSave() {
    const result: Result = {
      wpm: this.wpm,
      accurracy: this.accuracy,
      timeTaken: this.timeTaken
    };
    
    this.resultService.saveResult(result).subscribe({
      next: (response) => {
        console.log('Result saved:', response);
        this.clearPendingResult(); // Clear stored result after successful save
        alert('Your result has been saved successfully');
      },
      error: (err) => {
        console.error('Error saving result:', err);
        alert('There was an error saving your result');
      }
    });
  }

  private autoSavePendingResult() {
    // Automatically save the result after user logs in
    this.performSave();
  }

  private storePendingResult() {
    const result = {
      wpm: this.wpm,
      accuracy: this.accuracy,
      timeTaken: this.timeTaken,
      timestamp: new Date().getTime()
    };
    sessionStorage.setItem(this.PENDING_RESULT_KEY, JSON.stringify(result));
  }

  private loadPendingResult(): { wpm: number; accuracy: number; timeTaken: number } | null {
    const stored = sessionStorage.getItem(this.PENDING_RESULT_KEY);
    if (!stored) return null;

    try {
      const result = JSON.parse(stored);
      // Check if result is not too old (e.g., 1 hour)
      const oneHour = 60 * 60 * 1000;
      if (new Date().getTime() - result.timestamp > oneHour) {
        this.clearPendingResult();
        return null;
      }
      return result;
    } catch {
      return null;
    }
  }

  private hasPendingResult(): boolean {
    return sessionStorage.getItem(this.PENDING_RESULT_KEY) !== null;
  }

  private clearPendingResult() {
    sessionStorage.removeItem(this.PENDING_RESULT_KEY);
  }

  tryAgain() {
    this.clearPendingResult(); // Clear any pending results
    this.router.navigate(['/typeTest']);
  }
}