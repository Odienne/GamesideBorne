import {Component, HostListener} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormWizardContainer} from "./components/form-wizard/form-wizard.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormWizardContainer],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'GamesideBorne';

  ngOnInit() {
    /*Retour sur l'écran d'accueil au bout d'une minute*/
    setTimeout(() => {
      if (window.location.pathname !== "/") {
        window.location.href = '';
      }
    }, 10000 * 6)
  }
}
