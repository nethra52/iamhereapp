import { AuthenticationService } from '../services/authentication.service';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FiremessageService } from './../services/firemessage.service';

import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  actor = 'driver';
  loginForm: FormGroup;
  entity: any;
  flag = false;


  constructor(private storage: Storage,
    private _pAuth: AuthenticationService, private _router: Router, private _actRoute: ActivatedRoute, private _fcm: FiremessageService) {
    // this.platform.ready().then(() => {
    //   this.platform.registerBackButtonAction((e) => {
    //     e.preventDefault();
    //   }, 101);
    // });
    this.storage.get('iamhereLog').then((res) => {
      if (res) {
       this._router.navigate(['map']);
      }
     }).catch((err) => {
         console.log(err);
     });
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  ionViewWillEnter() {
    this._actRoute.params.subscribe((res) => {
      if (!res.actor) {
        this.actor = 'driver';
      } else {
        this.actor = res.actor;
      }
    });
  }



  changeActor(act) {
    this.actor = act;
    this.flag = false;
    this.loginForm['submitted'] = false;
    this.loginForm.reset();
  }
  async loginMe() {
    if (this.loginForm.invalid) {
      this.loginForm['submitted'] = true;
    } else {
      this.loginForm['submitted'] = false;
      if (this.actor === 'driver') {
        await this.loginBus();
      }
      if (this.actor === 'student') {
        await this.loginStudent();
      }
      if (this.entity) {
        this.loginForm.reset();
        this._router.navigate(['map']);
      } else {
        this.flag = true;
      }
    }
  }
  async loginBus() {
    const data = {
      busId: this.loginForm.value.username,
      password: this.loginForm.value.password
    };
    this.entity = await this._pAuth.loginBus(data);
    this.storeToDevice({ type: 'bus', details: this.entity });

  }
  async loginStudent() {
    const data = {
      userName: this.loginForm.value.username,
      password: this.loginForm.value.password
    };
    this.entity = await this._pAuth.loginStudent(data);
    this._fcm.getToken().then((res) => {
      this._pAuth.updateFcmId({fcmId: res, userName: data.userName});
    }).catch((err) => {
      console.log(err);
    });
    this.storeToDevice({ type: 'student', details: this.entity });

  }

  async storeToDevice(data) {
    this.storage.set('iamhereLog', data).then(
      () => { console.log('Entry created'); }
    ).catch(
      () => {
        console.log('Failed to save Login Creds');
      });
  }

  registerMe() {
    this._router.navigate(['signup']);
  }

}
