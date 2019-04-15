import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Map View',
      url: '/map',
      icon: 'map'
    },
    {
      title: 'Edit Stop',
      url: '/stopedit',
      icon: 'create'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _storage: Storage,
    private _router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logOut() {
    this._storage.remove('iamhereLog').then(() => {
      this._router.navigate(['home']);
    });
  }

  // routeRedirect(url) {
  //   console.log(url);
  //   this._router.navigate[url];
  // }
}
