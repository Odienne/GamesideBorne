import {NgModule} from "@angular/core";
import {CdkStepperModule} from '@angular/cdk/stepper';
import {NgStepperModule} from 'angular-ng-stepper';

@NgModule({
  imports: [CdkStepperModule,NgStepperModule],
})
export class WizardModule {}
