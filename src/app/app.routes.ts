import { Routes } from '@angular/router';
import { TypeTestComponent } from './components/type-test/type-test.component';
import { HomeComponent } from './components/home/home.component';
import { ResultsComponent } from './components/results/results.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { SignUpComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
 { path: 'typeTest', component: TypeTestComponent },
{ path: 'results', component: ResultsComponent },
  {path:'home',component:HomeComponent},
  {path:'leaderboard',component:LeaderboardComponent},
  {path:'profile',component:ProfileComponent},
  {path:'signup',component:SignUpComponent},
  {path:'login',component:LoginComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full' }
];
