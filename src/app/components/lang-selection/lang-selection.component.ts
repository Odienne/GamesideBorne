import {Component} from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {NgForOf} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-lang-selection',
  standalone: true,
  imports: [
    HeaderComponent,
    NgForOf,
    TranslateModule
  ],
  templateUrl: './lang-selection.component.html',
  styleUrl: './lang-selection.component.scss'
})
export class LangSelectionComponent {
  locales = [
    "fr",
    "en",
    "es",
  ];

  selected = "";

  constructor(private translateService: TranslateService) {
  }

  selectLocale(locale: string) {
    this.selected = locale;
    localStorage.setItem("lang", locale);
    this.translateService.use(locale);
    this.translateService.setDefaultLang(locale);
  }

  goToFormWizard() {
    window.location.href = "/form-wizard";
  }
}
