import { Component } from '@angular/core';
import {HeaderComponent} from "../header/header.component";

@Component({
  selector: 'app-lang-selection',
  standalone: true,
    imports: [
        HeaderComponent
    ],
  templateUrl: './lang-selection.component.html',
  styleUrl: './lang-selection.component.scss'
})
export class LangSelectionComponent {

}
