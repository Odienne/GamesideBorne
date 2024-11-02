import {Routes} from '@angular/router';
import {LangSelectionComponent} from "./components/lang-selection/lang-selection.component";
import {HomeComponent} from "./components/home/home.component";
import {FormWizardComponent} from "./components/form-wizard/form-wizard.component";

export const routes: Routes = [
  {
    path: "", component: HomeComponent
  },
  {
    path: "lang-select", component: LangSelectionComponent
  },
  {
    path: "form-wizard", component: FormWizardComponent
  },
  {
    path: "**", redirectTo: "", pathMatch: "full"
  }
];
