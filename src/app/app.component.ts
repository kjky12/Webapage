
import { Component } from '@angular/core';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
} from '@angular/router'
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  private LOGO = require("./assets/logo.png");

  constructor(
    private router: Router,
    public authService: AuthService,
  ) {
    router.events.subscribe((event: RouterEvent) => { //1
      this.refreshToken(event);
    });
  }

  private refreshToken(event: RouterEvent): void {
    if (event instanceof NavigationStart && this.authService.isLoggedIn()) {
      this.authService.refresh().catch(response => null);
    }
  }
}

