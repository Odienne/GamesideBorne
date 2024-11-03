import {Component, EventEmitter, forwardRef, Output} from '@angular/core';
import {CdkStepper, CdkStepperModule} from '@angular/cdk/stepper';
import {NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {HeaderComponent} from "../header/header.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'form-wizard-container',
  templateUrl: './form-wizard-container.html',
  styleUrl: './form-wizard-container.css',
  standalone: true,
  imports: [forwardRef(() => FormWizard), CdkStepperModule, ReactiveFormsModule, NgIf, HeaderComponent, NgForOf],
})
export class FormWizardContainer {


  form!: FormGroup;
  gameModeForm!: FormGroup;
  teamDetailsForm!: FormGroup;

  teams: any[] = [];

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      nbTeams: [null, [Validators.required]],
      groupName: ["", Validators.minLength(3)],
    })
    this.gameModeForm = this.fb.group({
      gamemode: [null, [Validators.required]],
    })
    this.gameModeForm = this.fb.group({
      gamemode: [null, [Validators.required]],
    })
    this.teamDetailsForm = this.fb.group({
      teamName: ["", [Validators.required, Validators.minLength(3)]],
    })
  }

  submitForm() {
    if (this.form.valid) {
      console.log(this.form.value);

      for (let i = 0; i < this.form.value.nbTeams; i++) {
        this.teams.push({id: "team" + (i + 1), name: "Equipe" + (i + 1)});
      }
      console.log(this.teams);
    }
  }

  receiveMessage($event: string) {
    console.log($event);
  }

  submitGameModeForm() {
    if (this.gameModeForm.valid) {
      console.log(this.gameModeForm.value);
    }
  }

  submitTeamDetailsForm(id: any) {
    if (this.teamDetailsForm.valid) {
      let index = this.teams.findIndex(team => team.id === id);
      console.log(this.teams)
      console.log(this.teams[index])
      this.teams[index].team = this.teamDetailsForm.value.teamName;
    }
  }

  allTeamAreCompleted() {
    let allTeamAreCompleted = true;

    this.teams.forEach(team => {
      if (team.name === "") {
        allTeamAreCompleted = false;
      }
    })


    return allTeamAreCompleted;

  }
}

@Component({
  selector: 'form-wizard',
  templateUrl: './form-wizard.component.html',
  styleUrl: './form-wizard.component.scss',
  providers: [{provide: CdkStepper, useExisting: FormWizard}],
  standalone: true,
  imports: [NgTemplateOutlet, CdkStepperModule, HeaderComponent, TranslateModule, NgIf],
})
export class FormWizard extends CdkStepper {
  @Output() messageEvent = new EventEmitter<string>();

  selectStepByIndex(index: number): void {
    this.selectedIndex = index;
  }

  sendMessage() {
    this.messageEvent.emit(this._getFocusIndex()?.toString());
  }
}
