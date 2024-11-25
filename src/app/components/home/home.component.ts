import {Component} from '@angular/core';
import {AnimationOptions, LottieComponent} from "ngx-lottie";
import {AnimationItem} from "lottie-web";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {LangSelectionComponent} from "../lang-selection/lang-selection.component";

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
