import {ChangeDetectorRef, Component, EventEmitter, forwardRef, Output} from '@angular/core';
import {CdkStepper, CdkStepperModule} from '@angular/cdk/stepper';
import {NgForOf, NgIf, NgOptimizedImage, NgTemplateOutlet} from '@angular/common';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxTouchKeyboardDirective, NgxTouchKeyboardModule} from 'ngx-touch-keyboard';
import {LangSelectionComponent} from "../lang-selection/lang-selection.component";
import {MatStep, MatStepperModule} from "@angular/material/stepper";
import {ReservationService} from "../../services/reservation.service";


@Component({
  selector: 'form-wizard-container',
  templateUrl: './form-wizard-container.html',
  styleUrl: './form-wizard-container.scss',
  standalone: true,
  imports: [forwardRef(() => FormWizard),
    CdkStepperModule, ReactiveFormsModule,
    NgIf, NgForOf, NgxTouchKeyboardModule, TranslateModule, LangSelectionComponent, MatStep,
    MatStepperModule,
    ReactiveFormsModule, NgOptimizedImage,
  ],
})
export class FormWizardContainer {
  form!: FormGroup;
  teamDetailsForm!: FormGroup;
  playerInfosForm!: FormGroup;
  nbTeams = 0;
  maxTeams = 10;
  isKeyboardOpen: boolean = false;

  teams: any[] = [{}]; // array of teams, used to iterate in template
  players: any[] = []; // contains player data such as age and gender, keyed by groupID and used to
  linearMode: boolean = false;
  checkedModalVisibility: boolean = false;
  animationClass: string = "animate__slideInRight";
  firstAnimationClass: string = "animate__fadeIn";
  fadeOutModalClass: string = "";

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef, private translate: TranslateService, private reservationService: ReservationService) {
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.form = this.fb.group({
      nbTeams: [this.nbTeams, [Validators.required, Validators.min(1), Validators.max(this.maxTeams)]],
      groupName: [null, Validators.maxLength(50)],
    });
    this.teamDetailsForm = this.fb.group({
      teamName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      teamEmail: ["", [Validators.required, Validators.email, Validators.maxLength(80)]],
      nbPlayer: [null, [Validators.required, Validators.min(2), Validators.max(5)]],
      playersInfos: []
    });

    this.playerInfosForm = this.fb.group({});
  }

  /**
   * this function communicates with parent component implementing CdkStepper which triggers events on next/previous events
   * I use these events to update the animation class on stepContainer, making it slideFromLeft or slideFromRight giving it more fluidity
   * @param $event
   */
  receiveMessage($event: { name: string, value: any }) {
    if ($event.name === "returnToStart") {
      this.returnToStart();
    } else if ($event.name === "prev") {
      this.animationClass = "animate__slideInLeft";
      this.firstAnimationClass = this.animationClass;
    } else if ($event.name === "next") {
      this.animationClass = "animate__slideInRight";
    }
  }

  /**
   * related to the first form, decrease nbTeams by 1
   * also check if nbTeams is > 1 to display a new input asking for a groupName (required)
   * if not, needs to remove the required validators of the groupName field
   */
  minusOneTeam() {
    if (this.nbTeams > 0) {
      this.nbTeams--;
    }
    this.form.controls['nbTeams'].setValue(this.nbTeams);

    this.updateGroupNameValidators();
  }

  /**
   * related to the first form, decrease nbTeams by 1
   * also check if nbTeams is > 1 to display a new input asking for a groupName (required)
   * if not, needs to remove the required validators of the groupName field
   */
  addOneTeam() {
    if (this.nbTeams < this.maxTeams) {
      this.nbTeams++;
    }
    this.form.controls['nbTeams'].setValue(this.nbTeams);

    this.updateGroupNameValidators();
  }

  /**
   * check whether I need to display
   */
  updateGroupNameValidators() {
    if (this.nbTeams > 1) {
      this.form.controls['groupName'].setValidators([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]);
    } else if (this.nbTeams < 2) {
      this.form.controls['groupName'].setValidators([]);
      this.form.controls['groupName'].setValue(null); // reset groupName
    }
    this.form.controls['groupName'].updateValueAndValidity();
  }

  /**
   * submit first form indicating the number of teams (and eventually the groupName)
   * Then if the form is valid, it populates an array of teams used to iterate in template
   */
  submitForm() {
    if (this.form.valid) {
      /*need to reset the form after each submit to avoid a bug*/
      /*also need to reset other forms, otherwise coming back to this screen will cause a bug*/
      this.teamDetailsForm.reset();
      this.teams = [];

      for (let i = 0; i < this.form.value.nbTeams; i++) {
        this.teams.push({id: this.translate.instant("team") + " " + (i + 1), name: ""});
      }
    }
  }

  /**
   * Submit the teamDetailsFrom, used to gather data for each team : team name, email, nbPlayer
   * @param id
   */
  submitTeamDetailsForm(id: any) {
    if (this.teamDetailsForm.valid) {
      let index = this.teams.findIndex(team => team.id === id);
      this.teams[index].name = this.teamDetailsForm.value.teamName;
      this.teams[index].email = this.teamDetailsForm.value.teamEmail;
      this.teams[index].nbPlayer = this.teamDetailsForm.value.nbPlayer;


      //reset array (in case you go back it would push more and more players)
      this.teams[index].players = [];
      //reset formControls of formGroup
      this.playerInfosForm = this.fb.group({});

      for (let i = 0; i < this.teamDetailsForm.value.nbPlayer; i++) {
        this.teams[index].players.push({age: null, gender: null}); //to iterate on it in template

        //also need to manually add a formControl for each player
        this.playerInfosForm.addControl('ageplayer' + (i + 1), this.fb.control(null));
        this.playerInfosForm.addControl('genderplayer' + (i + 1), this.fb.control(null));
      }
      console.log(this.playerInfosForm)
      //and save playerInfos into teams global data
      // this.teams[index].playersInfos = this.players;
      // console.log(this.teams)
      //then reset players data for next team
      // this.players = [];
    }
  }


  /**
   * Returns whether the teams have their attributed names and are complete
   */
  allTeamAreCompleted() {
    let allTeamAreCompleted = true;

    this.teams.forEach(team => {
      if (team.name === "" || team.name === null) {
        allTeamAreCompleted = false;
      }
    })

    return allTeamAreCompleted;
  }


  returnToStart() {
    console.log('return to start')
    this.teamDetailsForm.reset();
    this.nbTeams = 0;
    this.teams = [];
    window.location.href = "";
  }

  /**
   * The toggle function for the confirmation modal when team data is completed and badge is scanned, also appears when all teams are completed
   */
  async toggleCheckedModal() {
    this.checkedModalVisibility = !this.checkedModalVisibility; //toggle modal


    //We need to prevent user from closing the last modal
    // it acts as a confirmation and sends data before returning to home screen
    //only triggers once, we do not want to resend data
    if (this.checkedModalVisibility && this.allTeamAreCompleted()) { //meaning the last team is completed
      let res = await this.sendData();
      if (res === true) {
        //close modal after 15 seconds (unless user clicks on it again
        setTimeout(() => {
          this.returnToStart();
        }, 15000)
      } else {
        alert("could not save data")
      }
    } else if (!this.checkedModalVisibility && this.allTeamAreCompleted()) { //if user press check or cancel
      this.returnToStart();
    }
  }

  /**
   * When all teams are completed, data is sent to backend to create teams, groups, etc.
   */
  async sendData() {
    //this.reservationService.createTeams({});
    //then, returns to home screen
    return true;
  }


  /**
   * quick translation for template
   * @param id
   * @param teamName
   */
  teamIsReadyTranslation(id: any, teamName: string) {
    return this.translate.instant('the-team-is-ready', {
      teamId: id,
      teamName: teamName,
    })
  }

  /**
   * custom toggle keyboard function because i need to manage a state to triger animations
   * @param touchKeyboard
   */
  customToggleKeyboard(touchKeyboard: NgxTouchKeyboardDirective) {
    this.isKeyboardOpen = !this.isKeyboardOpen;
    this.isKeyboardOpen ? touchKeyboard.openPanel() : touchKeyboard.closePanel();
  }

  /**
   * Returns errors array of a formControl, used in template to display errors
   * @param control
   */
  formErrors(control: any) {
    //only returns error if the user has interacted and left the field at least once
    if (control?.touched) {
      return control?.errors;
    }
    return null;
  }

  submitPlayerInfosForm() {
    if (this.playerInfosForm.valid) {
      this.playerInfosForm.reset();
    }
  }

  getPlayerInfosFormValue(formControlName: string, playerId: number) {
    return this.playerInfosForm.value[formControlName + playerId];
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
  hideAnimationClass: string = "";
  fadeOutModalClass: string = "";

  override previous() {
    console.log('going back');
    console.log(this.selectedIndex)
    this.messageEvent.emit({name: "prev", value: null});
    super.previous();
  }

  override next() {
    console.log('going next');
    console.log(this.selectedIndex)
    this.messageEvent.emit({name: "next", value: null});
    super.next();
  }

  selectStepByIndex(index: number): void {
    this.selectedIndex = index;
  }

  goBack() {
    if (this.selectedIndex === 0) {
      window.location.href = "/";
    } else {
      this.previous();
    }
  }

  returnToStart() {
    this.messageEvent.emit({name: "returnToStart", value: null});
  }

  toggleCancelModal() {
    //todo this is broken
    this.fadeOutModalClass = "animate__bounceInDown";
    if (this.cancelModalVisibility) {
      this.fadeOutModalClass = "animate__bounceOutUp";
      setTimeout(() => {
        this.cancelModalVisibility = !this.cancelModalVisibility;
      }, 1000)
    } else {
      this.cancelModalVisibility = !this.cancelModalVisibility;
    }
  }
}
