// type-test.component.ts
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-type-test',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './type-test.component.html',
  styleUrls: ['./type-test.component.css']
})
export class TypeTestComponent implements OnInit, OnDestroy {
  @ViewChild('testTextElement') testTextElement!: ElementRef<HTMLDivElement>;
  private sampleTexts = [
    "the roar of a finely tuned sports car engine is music to any car enthusiasts ears sleek curves and aerodynamic lines not only enhance the vehicles beauty but also improve performance every detail from the stitching on the leather seats to the precision of the dashboard reflects craftsmanship and engineering excellence driving such a car on a winding road provides an exhilarating experience that combines speed control and pure joy the way the car responds to every movement of the steering wheel and pedals requires attention focus and skill making every journey an opportunity to appreciate both technology and human ability the sensation of acceleration and the sound of the engine create a connection between driver and machine that is unforgettable",

    "classic cars tell stories of eras long past each model carrying a unique history polished chrome elegant grilles and vintage headlights evoke nostalgia and admiration restoration requires patience and dedication as every nut and bolt must be carefully maintained car shows bring these masterpieces to life allowing enthusiasts to share their passion and celebrate automotive artistry attending these events provides a sense of community as people discuss techniques showcase rare models and inspire each other to preserve the heritage of automotive design the craftsmanship and attention to detail found in classic cars continue to impress and influence modern designs",

    "electric vehicles are revolutionizing the automotive industry combining innovation with environmental responsibility advanced battery technology allows longer ranges while reducing emissions inside digital dashboards and smart connectivity offer drivers a futuristic experience as charging networks expand and technology evolves electric cars are becoming practical efficient and increasingly thrilling to drive the shift towards electric mobility is also changing infrastructure city planning and consumer behavior creating new opportunities for sustainable transportation cleaner urban environments and more conscious driving habits with every advancement the potential for transforming how we travel and interact with vehicles grows exponentially",

    "motorsports captivate fans around the world from formula 1 circuits to off road rally tracks high performance cars expertly tuned for speed and handling push both vehicles and drivers to their limits pit crews strategy and split second decisions make racing a complex adrenaline filled spectacle watching a race unfold demonstrates precision teamwork and the relentless pursuit of victory the excitement is heightened by the unpredictability of each lap the skill required to navigate challenging courses and the engineering behind every car combine to create a thrilling experience for participants and spectators alike",

    "car design is both art and science blending aesthetics with functionality from concept sketches to wind tunnel testing every aspect is carefully planned headlights spoilers and wheel arches are not just decorative they enhance performance and safety the evolution of design reflects changing tastes technological advances and a continuous quest to create vehicles that are beautiful and efficient designers must balance creativity with practicality considering aerodynamics ergonomics and user experience every new model is an opportunity to push boundaries redefine standards and contribute to the ongoing story of automotive innovation and excellence"
  ];




  testDuration = 60;
  testText = '';
  testTextArray: string[] = [];

  userInput = '';
  currentCharIndex = 0;
  hasStarted = false;
  isActive = false;
  testCompleted = false;
  startTime = 0;
  timeRemaining = 60;

  currentWPM = 0;
  accuracy = 100;
  correctChars = 0;
  incorrectChars = 0;
  progressPercentage = 0;

  private gameTimer?: number;
  private wpmTimer?: number;

  constructor(private router: Router) { }

  ngOnInit() {
    this.initializeTest();
  }

  ngOnDestroy() {
    this.clearTimers();
  }

  initializeTest() {
    this.testText = this.sampleTexts[Math.floor(Math.random() * this.sampleTexts.length)];
    this.testTextArray = this.testText.split('');
    this.timeRemaining = this.testDuration;
    this.progressPercentage = 0;
  }

  focusOnText() {
    this.testTextElement.nativeElement.focus();
  }

  onTextFocus() {
    if (!this.hasStarted && !this.testCompleted) this.startTest();
  }

  onKeyDown(event: KeyboardEvent) {
    event.preventDefault();
    if (this.testCompleted) return;
    if (!this.hasStarted) this.startTest();

    if (event.key === 'Backspace') {
      if (this.currentCharIndex > 0 && this.userInput.length > 0) {
        const lastTypedChar = this.userInput[this.userInput.length - 1];
        const expectedChar = this.testTextArray[this.currentCharIndex - 1];
        if (lastTypedChar !== expectedChar) {
          this.userInput = this.userInput.slice(0, -1);
          this.currentCharIndex--;
        }
      }
    } else if (event.key.length === 1) {
      this.userInput += event.key;
      this.currentCharIndex++;
    }

    this.updateStatistics();
    this.updateProgress();
    this.checkCompletion();
  }

  startTest() {
    this.hasStarted = true;
    this.isActive = true;
    this.startTime = Date.now();

    this.gameTimer = window.setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) this.endTest();
    }, 1000);

    this.wpmTimer = window.setInterval(() => {
      this.calculateWPM();
    }, 1000);
  }

  calculateWPM() {
    const minutes = (Date.now() - this.startTime) / 1000 / 60;
    if (minutes > 0) {
      this.currentWPM = Math.round((this.correctChars / 5) / minutes);
    }
  }

  updateStatistics() {
    let correct = 0;
    let incorrect = 0;
    for (let i = 0; i < this.userInput.length; i++) {
      if (this.userInput[i] === this.testTextArray[i]) correct++;
      else incorrect++;
    }
    this.correctChars = correct;
    this.incorrectChars = incorrect;
    this.accuracy = (correct + incorrect) > 0 ? (correct / (correct + incorrect)) * 100 : 100;
  }

  updateProgress() {
    this.progressPercentage = (this.currentCharIndex / this.testTextArray.length) * 100;
  }

  checkCompletion() {
    if (this.currentCharIndex >= this.testTextArray.length) this.endTest();
  }

  endTest() {
    this.isActive = false;
    this.testCompleted = true;
    this.clearTimers();
    this.calculateWPM();
  }

  resetTest() {
    this.clearTimers();
    this.userInput = '';
    this.currentCharIndex = 0;
    this.hasStarted = false;
    this.isActive = false;
    this.testCompleted = false;
    this.timeRemaining = this.testDuration;
    this.currentWPM = 0;
    this.accuracy = 100;
    this.correctChars = 0;
    this.incorrectChars = 0;
    this.progressPercentage = 0;
    this.initializeTest();
    setTimeout(() => this.focusOnText(), 100);
  }

  seeResults() {
    const timeTaken = this.testDuration - this.timeRemaining; // Calculate time taken in seconds
    this.router.navigate(['/results'], {
      state: { wpm: this.currentWPM, accuracy: this.accuracy, timeTaken: timeTaken }
    });
  }

  getCharClass(index: number): string {
    let classes = '';
    if (index < this.userInput.length) {
      classes = this.userInput[index] === this.testTextArray[index] ? 'char-correct' : 'char-incorrect';
    } else {
      classes = 'char-pending';
    }
    if (index === this.currentCharIndex && this.isActive) {
      classes += ' char-current';
    }
    return classes;
  }

  private clearTimers() {
    clearInterval(this.gameTimer);
    clearInterval(this.wpmTimer);
  }
}