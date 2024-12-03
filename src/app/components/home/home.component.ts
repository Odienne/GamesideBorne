import {Component} from '@angular/core';
import {AnimationOptions, LottieComponent} from "ngx-lottie";
import {AnimationItem} from "lottie-web";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {LangSelectionComponent} from "../lang-selection/lang-selection.component";
import {ActivatedRoute} from "@angular/router";
import {ReservationService} from "../../services/reservation.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LottieComponent,
    NgIf,
    NgOptimizedImage,
    TranslateModule,
    LangSelectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  showAnimation = false;
  animationClass = "";

  backgrounds: string[] = [
    "/assets/images/bgs/1.png",
    "/assets/images/bgs/2.png",
    "/assets/images/bgs/3.png",
    "/assets/images/bgs/4.png",
  ];
  currentBackgroundIndex: number = 0;
  currentBackgroundImage: string = this.backgrounds[this.currentBackgroundIndex];


  constructor(private activatedRoute: ActivatedRoute, private reservationService: ReservationService) {
  }

  ngOnInit() {
    const deviceName = this.activatedRoute.snapshot.paramMap.get('device') ?? localStorage.getItem('deviceName');

    if (!deviceName) {
      alert("No device detected, can't register on this machine. Please head to your game master for help");
      window.location.href = '';
    }
    else {
      console.log(deviceName, "device stored");
      localStorage.setItem("deviceName", deviceName);
    }

    setInterval(() => {
      this.currentBackgroundImage = this.backgrounds[this.getNextBackgroundIndex()];
    }, 10000);
  }

  getNextBackgroundIndex() {
    this.currentBackgroundIndex = (this.currentBackgroundIndex + 1) % this.backgrounds.length;
    return this.currentBackgroundIndex;
  }

  protected start = () => {
    this.animationClass = "customFullScreenAnimation";
    this.showAnimation = true;
    setTimeout(() => {
      this.play();

      setTimeout(() => {
        window.location.href = '/form-wizard';
      }, 2000)
    }, 200)
  }

  private animationItem!: AnimationItem;


  options: AnimationOptions = {
    path: '/assets/animations/heartbeat.json',
    loop: false,
    autoplay: false
  };

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
  }

  play(): void {
    if (this.animationItem) {
      this.animationItem.play();
    }
  }

  pause(): void {
    if (this.animationItem) {
      this.animationItem.pause();
    }
  }

  stop(): void {
    if (this.animationItem) {
      this.animationItem.stop();
    }
  }
}
