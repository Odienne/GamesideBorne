import {ChangeDetectorRef, Component, EventEmitter, forwardRef, Output} from '@angular/core';
import {CdkStepper, CdkStepperModule} from '@angular/cdk/stepper';
import {NgForOf, NgIf, NgOptimizedImage, NgTemplateOutlet} from '@angular/common';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxTouchKeyboardDirective, NgxTouchKeyboardModule} from 'ngx-touch-keyboard';
import {ReservationService} from "../../services/reservation.service";
import {AnimationOptions, LottieComponent} from "ngx-lottie";
import {AnimationItem} from "lottie-web";

@Component({
  selector: 'form-wizard-container',
  templateUrl: './form-wizard-container.html',
  styleUrl: './form-wizard-container.scss',
  standalone: true,
  imports: [forwardRef(() => FormWizard),
    CdkStepperModule, ReactiveFormsModule,
    NgIf, NgForOf, NgxTouchKeyboardModule, TranslateModule,
    ReactiveFormsModule, NgOptimizedImage, LottieComponent,
  ],
})
export class FormWizardContainer {
  form!: FormGroup; //first form to retrieve nbTeams and groupName
  teamDetailsForm!: FormGroup; //second form to retrieve team details (nbPlayers, teamName, email)
  playerInfosForm!: FormGroup; //third form to retrieve player infos (gender,age)
  scanTeamForm!: FormGroup; //hidden form to save and retrieve whether the team has scanned its badge
  nbTeams = 0;
  maxTeams = 99;
  isKeyboardOpen: boolean = false;
  animationItem!: AnimationItem; //lottie scan animation item

  teams: any[] = [{}]; // array of teams, used to iterate in template I need at least an empty object first to avoid double submit bug
  currentTeamIndex: number = 0; // keep track of current edited team
  players: any[] = []; // contains player data such as age and gender, keyed by groupID and used to
  linearMode: boolean = true;
  checkedModalVisibility: boolean = false;
  nbTeamsAnimationClass: string = "";
  animationClass: string = "animate__slideInRight";
  firstAnimationClass: string = "animate__fadeIn";
  fadeOutModalClass: string = "";

  previousLabelTarget: string = '';
  intervalId: any = null;
  intervalVelocityInitialValue = 500
  intervalVelocity: number = this.intervalVelocityInitialValue;
  intervalVelocityCap = 200;

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
      teamEmail: ["", [Validators.email, Validators.maxLength(80)]],
      nbPlayer: [null, [Validators.required, Validators.min(2), Validators.max(5)]],
      playersInfos: []
    });

    this.scanTeamForm = this.fb.group({
      scanned: [false]
    })

    this.playerInfosForm = this.fb.group({});
  }

  /**
   * this function communicates with parent component implementing CdkStepper which triggers events on next/previous events
   * I use these events to update the animation class on stepContainer, making it slideFromLeft or slideFromRight giving it more fluidity
   * @param $event
   */
  receiveMessage($event: any) {
    if ($event.name === "returnToStart") {
      this.returnToStart();
    } else if ($event.name === "prev") {
      let teamHasScanned = this.teams[this.currentTeamIndex].hasScanned;

      if (teamHasScanned === false) {
        //can call the callback (previous function)
        //otherwise won't do anything
        this.animationClass = "animate__slideInLeft";
        this.firstAnimationClass = this.animationClass;

        $event.value.callBackFunction();
      }
    } else if ($event.name === "next") {
      this.animationClass = "animate__slideInRight";
    } else if ($event.name === "next-header") {
      this.animationClass = "animate__slideInRight";

      let form = document.querySelector("form") as HTMLFormElement;
      let btn = document.querySelector(".valid-btn") as HTMLButtonElement;

      if (form.checkValidity()) {
        btn.click();
      }
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
      this.updateNbTeamsAnimationClass("scale-down-bounce");
    }
    this.form.controls['nbTeams'].setValue(this.nbTeams);

    this.updateGroupNameValidators();
  };

  /**
   * related to the first form, decrease nbTeams by 1
   * also check if nbTeams is > 1 to display a new input asking for a groupName (required)
   * if not, needs to remove the required validators of the groupName field
   */
  addOneTeam() {
    if (this.nbTeams < this.maxTeams) {
      this.nbTeams++;
      this.updateNbTeamsAnimationClass("scale-up-bounce");
    }
    this.form.controls['nbTeams'].setValue(this.nbTeams);

    this.updateGroupNameValidators();
  }

  /**
   * Interval used to increase or decrease nbTeams, with an increasing velocity the longer you press
   * @param action
   * @param speed
   */
  startInterval(action: string, speed = this.intervalVelocity) {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        action === "add" ? this.addOneTeam() : this.minusOneTeam();
        this.clearAddMinusInterval();
        let newVelocity = speed * 0.82 > this.intervalVelocityCap ? speed * 0.82 : this.intervalVelocityCap;
        this.startInterval(action, newVelocity)
      }, speed);
    }
  }

  /**
   * Clear the interval declared in startInterval
   */
  clearAddMinusInterval() {
    clearInterval(this.intervalId)
    this.intervalId = null;
    this.intervalVelocity = this.intervalVelocityInitialValue;
  }

  updateNbTeamsAnimationClass(animation = "scale-up-bounce") {
    this.nbTeamsAnimationClass = animation;
    setTimeout(() => {
      this.nbTeamsAnimationClass = "";
    }, 500);
  }

  /**
   * check whether I need to display groupName field
   */
  updateGroupNameValidators() {
    if (this.nbTeams > 1) {
      this.form.controls['groupName'].setValidators([
        // Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]);
    } else if (this.nbTeams < 2) {
      this.form.controls['groupName'].setValidators([]);
      this.form.controls['groupName'].setValue(null);
      this.form.controls['groupName'].updateValueAndValidity();
      this.form.markAsPristine(); //to reset form
      this.form.markAsUntouched(); //to reset form
    }
  }

  /**
   * submit first form indicating the number of teams (and eventually the groupName)
   * Then if the form is valid, it populates an array of teams used to iterate in template
   */
  submitForm() {
    if (this.form.valid) {

      //necessary because array is init with an empty object [{}
      if (Object.keys(this.teams[0]).length === 0) {
        this.teams.splice(0, 1);
      }

      //ideally I want to push new teams to this.teams array depending on the number of teams declared in the first form
      //I would pop this.teams as well
      //depending on the difference between this.teams.length and this.form.value.nbTeams
      //if their are the same, nothing to change
      let oldValue = this.teams.length;
      let newValue = this.form.value.nbTeams;

      if (newValue > oldValue) { //if we want more teams
        for (let i = oldValue; i < newValue; i++) {
          this.teams.push({
            id: this.translate.instant("team") + " " + (i + 1),
            name: "",
            players: [],
            email: "",
            nbPlayer: 0,
            hasScanned: false
          });
        }
      } else if (newValue < oldValue) { //we want fewer teams
        for (let i = newValue; i < oldValue; i++) {
          this.teams.pop();
        }
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
      this.currentTeamIndex = index;
      this.teams[index].name = this.teamDetailsForm.value.teamName;
      this.teams[index].email = this.teamDetailsForm.value.teamEmail;


      let oldValue = this.teams[index].nbPlayer ?? 0;
      let newValue = this.teamDetailsForm.value.nbPlayer;

      //same logic as the submitForm method
      if (newValue > oldValue) { //if we want more players
        for (let i = oldValue; i < newValue; i++) {
          //classic add
          this.teams[index].players.push({age: null, gender: null}); //to iterate on it in template

          this.playerInfosForm.addControl('ageplayer' + (i + 1), this.fb.control(null));
          this.playerInfosForm.addControl('genderplayer' + (i + 1), this.fb.control(null));
        }
      } else if (newValue < oldValue) { //we want fewer players
        for (let i = newValue; i < oldValue; i++) {
          //remove last player and reset last controls corresponding to him
          this.playerInfosForm.controls['ageplayer' + this.teams[index].players.length]?.reset();
          this.playerInfosForm.controls['genderplayer' + this.teams[index].players.length]?.reset();
          this.teams[index].players.pop();
        }
      }
      //now can update this value
      this.teams[index].nbPlayer = this.teamDetailsForm.value.nbPlayer;
    }
  }


  /**
   * Returns whether the teams have their attributed names and are complete
   */
  allTeamAreCompleted() {
    let allTeamAreCompleted = true;

    this.teams.forEach(team => {
      if (!team.hasScanned) {
        allTeamAreCompleted = false;
      }
    })

    return allTeamAreCompleted;
  }


  returnToStart() {
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
        }, 12000)
      } else {
        alert("could not save data")
      }
    } else if (!this.checkedModalVisibility && this.allTeamAreCompleted()) { //if user press check or cancel
      this.returnToStart();
    }

    //reset forms when closing the modal
    if (!this.checkedModalVisibility) {
      this.resetForms();
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

  resetForms() {
    //we can reset teamDetailsForm here, as well as playerInfosForm
    //because we will not go back to edit previous team
    this.teamDetailsForm.reset();
    this.playerInfosForm.reset();
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

  headToYourGameMasterTranslation() {
    if (this.nbTeams > 1) return this.translate.instant('your-teams-are-ready');
    return this.translate.instant('your-team-is-ready');
  }

  /**
   * custom toggle keyboard function because I need to manage a state to trigger animations
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

  submitPlayerInfosForm(teamId: any) {
    if (this.playerInfosForm.valid) {
      //add players infos into team object under .players
      let index = this.teams.findIndex(team => team.id === teamId);

      for (let i = 0; i < this.teams[index].nbPlayer; i++) {
        let playerIndex = i + 1;
        this.teams[index].players[i].age = this.getPlayerInfosFormValue('ageplayer', playerIndex);
        this.teams[index].players[i].gender = this.getPlayerInfosFormValue('genderplayer', playerIndex);
      }
    }
  }

  getPlayerInfosFormValue(formControlName: string, playerId: number) {
    return this.playerInfosForm.value[formControlName + playerId];
  }

  uncheckPlayerGender(inputId: string, elem: any) {
    let targetElemId = elem.target.id;

    if (this.playerInfosForm.controls[inputId].value && this.previousLabelTarget === targetElemId) {
      this.playerInfosForm.controls[inputId].setValue(null);
      this.playerInfosForm.controls[inputId].updateValueAndValidity();
    }

    this.previousLabelTarget = targetElemId;
  }

  submitScanTeamForm(teamIndex: number) {
    if (this.scanTeamForm.valid) {
      this.toggleCheckedModal();
      this.animationItem.stop();
      this.updateTeamScan(teamIndex);
    }
  }

  updateTeamScan(teamIndex: number) {
    this.teams[teamIndex].hasScanned = true;
  }

  options: AnimationOptions = {
    path: '/assets/animations/scanning.json',
    loop: true,
    autoplay: true,
  };

  animationCreated(animationItem: AnimationItem) {
    this.animationItem = animationItem;
    this.animationItem.setSpeed(1.5);

    setTimeout(() => {
      if (this.animationItem) {
        this.animationItem.play();
      }
    }, 300)
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
  fadeOutModalClass: string = "";
  canClickCancelModal: boolean = true;

  override previous() {
    this.messageEvent.emit({name: "prev", value: {callBackFunction: () => super.previous()}});
    //I let receiver check if it can previous()
    // super.previous();
  }

  /**
   * default next behavior, with event emitter added
   */
  override next() {
    this.messageEvent.emit({name: "next", value: null});
    super.next();
  }

  /**
   * I also need a custom next function that sends a different event
   * It will only be used by the next btn in header
   * The event will submit click on the validate btn if form is valid, thus going to next step
   */
  customNext() {
    this.messageEvent.emit({name: "next-header", value: null});
  }

  selectStepByIndex(index: number): void {
    this.selectedIndex = index;
  }

  goBack() {
    if (this.selectedIndex === 0) {
      this.toggleCancelModal();
    } else {
      this.previous();
    }
  }

  returnToStart() {
    this.messageEvent.emit({name: "returnToStart", value: null});
  }

  toggleCancelModal() {
    if (this.canClickCancelModal) {
      this.canClickCancelModal = false;
      setTimeout(() => { //can click again after 1s
        this.canClickCancelModal = true;
      }, 1000);

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

  shouldNextBtnBeDisabled() {
    let currentForm = document.querySelector("form") as HTMLFormElement;
    return !currentForm?.checkValidity();
  }
}
