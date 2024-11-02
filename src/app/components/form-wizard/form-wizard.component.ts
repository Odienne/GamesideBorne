import {Component, forwardRef} from '@angular/core';
import {CdkStepper, CdkStepperModule} from '@angular/cdk/stepper';
import {NgTemplateOutlet} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'form-wizard-container',
  templateUrl: './form-wizard-container.html',
  styleUrl: './form-wizard-container.css',
  standalone: true,
  imports: [forwardRef(() => FormWizardComponent), CdkStepperModule, TranslateModule],
})
export class FormWizardContainer {}

@Component({
  selector: 'form-wizard',
  templateUrl: './form-wizard.component.html',
  styleUrl: './form-wizard.component.scss',
  providers: [{provide: CdkStepper, useExisting: FormWizardComponent}],
  standalone: true,
  imports: [NgTemplateOutlet, CdkStepperModule, TranslateModule],
})
export class FormWizardComponent extends CdkStepper {

  selectStepByIndex(index: number): void {
    this.selectedIndex = index;
  }
}
