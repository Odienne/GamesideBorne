import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormWizardContainer} from "./components/form-wizard/form-wizard.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormWizardContainer, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'GamesideBorne';
  defaultLang = localStorage.getItem("lang") || "fr";

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['fr', 'en', 'es']);
    this.translate.setDefaultLang(this.defaultLang);
    this.translate.use(this.defaultLang);
  }
}
