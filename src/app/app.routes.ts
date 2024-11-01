import {Routes} from '@angular/router';
import {LangSelectionComponent} from "./components/lang-selection/lang-selection.component";
import {HomeComponent} from "./components/home/home.component";

export const routes: Routes = [
  {
    path: "", component: HomeComponent
  },
  {
    path: "lang-select", component: LangSelectionComponent
  },
  {
    path: "**", redirectTo: "", pathMatch: "full"
  }
];
