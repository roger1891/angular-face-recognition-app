import { Component } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { NavigationCancel,
        Event,
        NavigationEnd,
        NavigationError,
        NavigationStart,
        Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Product Listing Exercise';

  //initialize constructor arguments
  constructor(
    private loadingBar: SlimLoadingBarService,
    private router: Router
  ){
    //subscribe to router event
    this.router.events.subscribe((event: Event) => {
      //intercept event via custom function
      this.navigationInterceptor(event);
    });
  }

  //custom navigation intercept function
  private navigationInterceptor(event: Event): void {
    //given an event it will...
    //start
    if(event instanceof NavigationStart){
      this.loadingBar.start();
    }
    //complete
    if(event instanceof NavigationEnd){
      this.loadingBar.complete();
    }
    //stop
    if(event instanceof NavigationCancel){
      this.loadingBar.stop();
    }
    //stop
    if(event instanceof NavigationError){
      this.loadingBar.stop();
    }
  }
}
