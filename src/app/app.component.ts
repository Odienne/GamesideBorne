import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatStepperModule} from "@angular/material/stepper";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule],
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
