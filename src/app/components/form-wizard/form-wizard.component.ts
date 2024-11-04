import {ChangeDetectorRef, Component, EventEmitter, forwardRef, Output} from '@angular/core';
import {CdkStepper, CdkStepperModule} from '@angular/cdk/stepper';
import {NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {HeaderComponent} from "../header/header.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxTouchKeyboardModule} from 'ngx-touch-keyboard';


@Component({
  selector: 'form-wizard-container',
  templateUrl: './form-wizard-container.html',
  styleUrl: './form-wizard-container.scss',
  standalone: true,
  imports: [forwardRef(() => FormWizard), CdkStepperModule, ReactiveFormsModule, NgIf, HeaderComponent, NgForOf, NgxTouchKeyboardModule],
})
export class FormWizardContainer {

  currentLocale = localStorage.getItem("lang");
  infoModalVisibility: boolean = false;

  form!: FormGroup;
  gameModeForm!: FormGroup;
  teamDetailsForm!: FormGroup;
  nbTeams = 0;

  teams: any[] = [];
  linearMode: boolean = true;
  checkedModalVisibility: boolean = false;

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef) {
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.form = this.fb.group({
      nbTeams: [this.nbTeams, [Validators.required, Validators.min(1)]],
      groupName: [null],
    })
    this.gameModeForm = this.fb.group({
      gamemode: [null, [Validators.required]],
    })
    this.teamDetailsForm = this.fb.group({
      teamName: ["", [Validators.required, Validators.minLength(3)]],
      teamEmail: ["", [Validators.required, Validators.email]],
      nbPlayer: [null, [Validators.required, Validators.min(2), Validators.max(5)]],
    })
  }

  submitForm() {
    if (this.form.valid) {
      for (let i = 0; i < this.form.value.nbTeams; i++) {
        this.teams.push({id: "équipe" + (i + 1), name: ""});
      }
    }
  }

  receiveMessage($event: string) {
    if ($event === "returnToStart") {
      this.returnToStart();
    }
  }

  submitTeamDetailsForm(id: any) {
    if (this.teamDetailsForm.valid) {
      let index = this.teams.findIndex(team => team.id === id);
      this.teams[index].name = this.teamDetailsForm.value.teamName;

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

  minusOneTeam() {
    if (this.nbTeams > 0) {
      this.nbTeams--;
    }
    this.form.controls['nbTeams'].setValue(this.nbTeams);

    console.log(this.nbTeams)
    if (this.nbTeams > 1) {
      this.form.controls['groupName'].setValidators([
        Validators.required,
        Validators.minLength(3)
      ]);
    } else if (this.nbTeams < 2) {
      this.form.controls['groupName'].setValidators([]);
    }
    console.log(this.form.value)
    this.form.controls['groupName'].updateValueAndValidity();
  }

  addOneTeam() {
    if (this.nbTeams < 10) {
      this.nbTeams++;
    }
    this.form.controls['nbTeams'].setValue(this.nbTeams);

    if (this.nbTeams > 1) {
      this.form.controls['groupName'].setValidators([
        Validators.required,
        Validators.minLength(3)
      ]);
    } else if (this.nbTeams < 2) {
      this.form.controls['groupName'].setValidators([]);
    }
    this.form.controls['groupName'].updateValueAndValidity();
  }


  returnToStart() {
    this.form.reset();
    this.gameModeForm.reset();
    this.teamDetailsForm.reset();
    this.nbTeams = 0;
    this.teams = [];
    window.location.href = "/lang-select";
  }

  toggleInfoModal() {
    this.infoModalVisibility = !this.infoModalVisibility;
  }

  toggleCheckedModal() {
    if (!this.allTeamAreCompleted()) this.checkedModalVisibility = !this.checkedModalVisibility;
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
  cancelModalVisibility: boolean = false;

  selectStepByIndex(index: number): void {
    this.selectedIndex = index;
  }

  goBack() {
    if (this.selectedIndex === 0) {
      window.location.href = "/lang-select";
    } else {
      this.selectedIndex--;
    }
  }

  returnToStart() {
    this.messageEvent.emit("returnToStart");
  }

  toggleCancelModal() {
    this.cancelModalVisibility = !this.cancelModalVisibility;
  }
}
