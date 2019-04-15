import { AuthenticationService } from './../services/authentication.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MapService } from '../services/map.service';

@Component({
  selector:  'app-signup',
  templateUrl:  './signup.page.html',
  styleUrls:  ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signupForm:  FormGroup;
  stopsArr = [];
  arrRoutes = [
    {nRoute:  'Route:1', area:  'Boduppal'},
    {nRoute:  'Route:2', area:  'ECIL'},
    {nRoute:  'Route:3', area:  'Dilsukh Nagar'},
    {nRoute:  'Route:4', area:  'Uppal'},
    {nRoute:  'Route:5', area:  'Ramanthapur'},
  ];
  arrStops = [];

  constructor(private _router: Router, private _pMap: MapService, private _pAuth: AuthenticationService) {
    this.signupForm = new FormGroup({
      fullname:  new FormControl(null, [Validators.required, Validators.minLength(6)]),
      broute:  new FormControl(null, Validators.required),
      busstop:  new FormControl(null, Validators.required),
      username:  new FormControl(null, [Validators.required, Validators.minLength(10)]),
      password:  new FormControl(null, [Validators.required, Validators.minLength(8)]),
      phnNumber:  new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(12)]),
    });
  }

  ngOnInit() {
  }

  async signMe() {
    if (this.signupForm.invalid) {
      this.signupForm['submitted'] = true;
    } else {
    this.signupForm['submitted'] = false;
    const data = {
      fullName:  this.signupForm.value.fullname,
      userName: this.signupForm.value.username,
      password: this.signupForm.value.password,
      phnNumber: this.signupForm.value.phnNumber,
      bRoute: this.signupForm.value.broute.split('-')[0],
      bArea: this.signupForm.value.broute.split('-')[1],
      busStop: await this.getStopCoords()
    };
    this._pAuth.registerStudent(data);
    // this.navCtrl.push('LoginPage', {actor: 'student'});
    this._router.navigate(['home/student']);
    this.signupForm.reset();

    }
  }
  logIn() {
    this._router.navigate(['home/student']);
  }

  async getStops() {
    const bus = await this._pMap.getBusLoc(this.signupForm.value.broute.split(': ')[1].split('-')[0]);
    this.arrStops = [];
    this.stopsArr = bus['stops'];
    for (const key in this.stopsArr) {
      if (this.stopsArr.hasOwnProperty(key)) {
        this.arrStops.push(this.stopsArr[key]);
      }

    }
  }

  getStopCoords() {
    return new Promise((resolve, reject) => {
      const stops = this.stopsArr.find((stop) => stop['locName'] === this.signupForm.value.busstop);
      if (stops) {
        resolve(stops);
      } else {
        reject('Invalid Stop Selected');
      }
    });
  }

}
