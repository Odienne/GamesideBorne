import {Component, forwardRef} from '@angular/core';
import {CdkStepper, CdkStepperModule} from '@angular/cdk/stepper';
import {NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'form-wizard-container',
  templateUrl: './form-wizard-container.html',
  styleUrl: './form-wizard-container.css',
  standalone: true,
  imports: [forwardRef(() => FormWizard), CdkStepperModule],
})
export class FormWizardContainer {}

@Component({
  selector: 'form-wizard',
  templateUrl: './form-wizard.component.html',
  styleUrl: './form-wizard.component.scss',
  providers: [{provide: CdkStepper, useExisting: FormWizard}],
  standalone: true,
  imports: [NgTemplateOutlet, CdkStepperModule],
})
export class FormWizard extends CdkStepper {
  selectStepByIndex(index: number): void {
    this.selectedIndex = index;
  }
}
