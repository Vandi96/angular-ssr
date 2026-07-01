import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {}
