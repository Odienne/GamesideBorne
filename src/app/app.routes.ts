import {Routes} from '@angular/router';
import {LangSelectionComponent} from "./components/lang-selection/lang-selection.component";
import {HomeComponent} from "./components/home/home.component";
import {FormWizardContainer} from "./components/form-wizard/form-wizard.component";

export const routes: Routes = [
  {
    path: "", component: HomeComponent
  },
  {
    path: "form-wizard", component: FormWizardContainer
  },
  {
    path: ":device", component: HomeComponent
  },
  {
    path: "**", redirectTo: "/", pathMatch: "full"
  }
];
