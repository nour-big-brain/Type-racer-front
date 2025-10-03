import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  ngOnInit() {
    // Any initialization logic can go here
  }
  constructor(private router: Router) {}
  go(){
    this.router.navigate(['/typeTest']);
  }


}
