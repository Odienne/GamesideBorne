import {Component, Input} from '@angular/core';
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ConfigService} from "../../services/config.service";
import {InfiniteScrollDirective} from "ngx-infinite-scroll";

@Component({
  selector: 'app-lang-selection',
  standalone: true,
  imports: [
    NgForOf,
    TranslateModule,
    NgOptimizedImage,
    InfiniteScrollDirective
  ],
  templateUrl: './lang-selection.component.html',
  styleUrl: './lang-selection.component.scss'
})
export class LangSelectionComponent {

  @Input() onSubmit!: any;

  selected = "";
  defaultLocales: string[] = [
    "fr",
    "en",
    "es"
  ];
  locales = this.defaultLocales;

  array = [...this.locales];

  constructor(private translateService: TranslateService, private configService: ConfigService) {
  }

  ngOnInit() {
    this.retrieveLocalesConfig();
  }

  selectLocale(locale: string) {
    this.selected = locale;
    localStorage.setItem("lang", locale);
    this.translateService.use(locale);
    this.translateService.setDefaultLang(locale);
  }

  private retrieveLocalesConfig() {
    this.configService.getConfig().subscribe((config: any) => {
      this.locales = config.locales ?? this.defaultLocales;
    })
  }

}
