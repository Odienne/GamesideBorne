import {ChangeDetectorRef, Component, EventEmitter, forwardRef, Output} from '@angular/core';
import {CdkStepper, CdkStepperModule} from '@angular/cdk/stepper';
import {NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxTouchKeyboardDirective, NgxTouchKeyboardModule} from 'ngx-touch-keyboard';
import {LangSelectionComponent} from "../lang-selection/lang-selection.component";
import {MatStep, MatStepperModule} from "@angular/material/stepper";


@Component({
  selector: 'form-wizard-container',
  templateUrl: './form-wizard-container.html',
  styleUrl: './form-wizard-container.scss',
  standalone: true,
  imports: [forwardRef(() => FormWizard),
    CdkStepperModule, ReactiveFormsModule,
    NgIf, NgForOf, NgxTouchKeyboardModule, TranslateModule, LangSelectionComponent, MatStep,
    MatStepperModule,
    ReactiveFormsModule,
  ],
})
export class FormWizardContainer {
  currentLocale = localStorage.getItem("lang");
  infoModalVisibility: boolean = false;

  form!: FormGroup;
  gameModeForm!: FormGroup;
  teamDetailsForm!: FormGroup;
  nbTeams = 0;
  isKeyboardOpen: boolean = false;

  teams: any[] = [];
  linearMode: boolean = true;
  checkedModalVisibility: boolean = false;
  animationClass: string = "animate__slideInRight";

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef, private translate: TranslateService) {
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
      /*need to reset the form after each submit to avoid a bug*/
      /*also need to reset other forms, otherwise coming back to this screen will cause a bug*/
      this.gameModeForm.reset();
      this.teamDetailsForm.reset();
      this.teams = [];

      for (let i = 0; i < this.form.value.nbTeams; i++) {
        this.teams.push({id: "équipe " + (i + 1), name: ""});
      }
    }
  }

  receiveMessage($event: { name: string, value: any }) {
    if ($event.name === "returnToStart") {
      this.returnToStart();
    } else if ($event.name === "prev") {
      console.log("goind back")
      this.animationClass = "animate__slideInLeft";
    } else if ($event.name === "next") {
      console.log("goind next")
      this.animationClass = "animate__slideInRight";
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
    window.location.href = "";
  }

  toggleInfoModal() {
    this.infoModalVisibility = !this.infoModalVisibility;
  }

  toggleCheckedModal() {
    //prevent user from closing last modal, acts as a confirmation instead and sends data before returning to home screen
    /*must only trigger if modal was shown once, and on cancel btn*/
    if (this.checkedModalVisibility && this.allTeamAreCompleted()) {
      this.sendDataIfAllTeamAreCompleted();
    }
    this.checkedModalVisibility = !this.checkedModalVisibility;
  }

  sendDataIfAllTeamAreCompleted() {
    if (this.allTeamAreCompleted()) {
      //todo send data to backend
      console.log('send data to backend')

      this.form.reset();
      this.gameModeForm.reset();
      this.teamDetailsForm.reset();
      this.nbTeams = 0;
      this.teams = [];
      window.location.href = "";
    }
  }

  teamIsReadyTranslation(id: any, teamName: string) {
    return this.translate.instant('the-team-is-ready', {
      teamId: id,
      teamName: teamName,
    })
  }

  translateModalTextInformation() {
    return this.translate.instant('modal-text-information')
  }

  custopOpenKeyboard(touchKeyboard: NgxTouchKeyboardDirective) {
    this.isKeyboardOpen = !this.isKeyboardOpen;
    touchKeyboard.openPanel();
  }

  customCloseKeyboard(touchKeyboard: NgxTouchKeyboardDirective) {
    this.isKeyboardOpen = !this.isKeyboardOpen;
    touchKeyboard.closePanel();
  }
}

@Component({
  selector: 'form-wizard',
  templateUrl: './form-wizard.component.html',
  styleUrl: './form-wizard.component.scss',
  providers: [{provide: CdkStepper, useExisting: FormWizard}],
  standalone: true,
  imports: [NgTemplateOutlet, CdkStepperModule, TranslateModule, NgIf],
})
export class FormWizard extends CdkStepper {
  @Output() messageEvent = new EventEmitter<{ name: string, value: any }>();
  cancelModalVisibility: boolean = false;


  override previous() {
    console.log('going back');
    this.messageEvent.emit({name: "prev", value: null});
    super.previous();
  }

  override next() {
    console.log('going next');
    this.messageEvent.emit({name: "next", value: null});
    super.next();
  }

  selectStepByIndex(index: number): void {
    this.selectedIndex = index;
  }

  goBack() {
    if (this.selectedIndex === 0) {
      window.location.href = "/lang-select";
    } else {
      this.previous();
    }
  }

  returnToStart() {
    this.messageEvent.emit({name: "returnToStart", value: null});
  }

  toggleCancelModal() {
    this.cancelModalVisibility = !this.cancelModalVisibility;
  }
}
