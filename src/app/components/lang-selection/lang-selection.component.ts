import {Component, Input} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CdkStepperNext} from "@angular/cdk/stepper";

@Component({
  selector: 'app-lang-selection',
  standalone: true,
  imports: [
    NgForOf,
    TranslateModule,
    NgOptimizedImage,
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

  @Input() onSubmit!: any;

  selected = "";

  constructor(private translateService: TranslateService) {
  }

  selectLocale(locale: string) {
    this.selected = locale;
    localStorage.setItem("lang", locale);
    this.translateService.use(locale);
    this.translateService.setDefaultLang(locale);
  }
}
