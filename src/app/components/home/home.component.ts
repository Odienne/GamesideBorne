import {Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  host: {
    '(click)': 'start()',
    '(window:keydown)': 'start()'
  },
})
export class HomeComponent {
  protected start = () => {
    window.location.href = '/lang-select';
  }
}
