import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, LocationStrategy } from '@angular/common';
import { Router, ChildActivationEnd, NavigationEnd, NavigationError, NavigationStart, } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ROUTS } from './constants/constants';

function isMobile() {
  return (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i))
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'workflexNewUI';
  isBackButtonPressed = false;
  previousPageUrl = "";
  constructor(@Inject(PLATFORM_ID) platformId: Object, public router: Router, private location: LocationStrategy) {
    this.router.events
      .pipe(filter(event => {
        if (event instanceof ChildActivationEnd || event instanceof NavigationEnd || event instanceof NavigationError) {
          if (isPlatformBrowser(platformId)) {
            window.scrollTo(0, 0);
          }
        }
        return event instanceof ChildActivationEnd
      }))
      .subscribe(event => {
        
        if(this.isBackButtonPressed && this.router.url === ROUTS.ADD_SKILL &&  this.previousPageUrl === ROUTS.ADD_PAYMENT_INFO) {
          this.isBackButtonPressed = false;
          this.router.navigate([this.previousPageUrl]);
        }
        this.previousPageUrl = this.router.url;
      });

      this.location.onPopState((event) => {
        this.isBackButtonPressed = true;
        return true;
      });
  }
}
