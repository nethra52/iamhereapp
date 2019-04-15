import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

import { AuthenticationService } from './../services/authentication.service';
import { MapService } from './../services/map.service';

@Component({
  selector: 'app-stopedit',
  templateUrl: './stopedit.page.html',
  styleUrls: ['./stopedit.page.scss'],
})
export class StopeditPage implements OnInit {

  routeEditForm: FormGroup;

  arrRoutes = [
    {nRoute:  'Route: 1', area:  'Boduppal'},
    {nRoute:  'Route: 2', area:  'ECIL'},
    {nRoute:  'Route: 3', area:  'Dilsukh Nagar'},
    {nRoute:  'Route: 4', area:  'Uppal'},
    {nRoute:  'Route: 5', area:  'Ramanthapur'},
  ];
  arrStops = [];
  stopsArr = [];
  actor = {};
  constructor(private _pMap: MapService, private _storage: Storage, private _pAuth: AuthenticationService) { }

  ngOnInit() {
    this.routeEditForm = new FormGroup({
      broute: new FormControl('', [Validators.required]),
      busstop: new FormControl('', [Validators.required])
    });
    this._storage.get('iamhereLog').then((res) => {
      if (res) {
        this.actor = res['details'];
      }
     }).catch((err) => {
         console.log(err);
     });
  }

  async editRoute() {
    const data = {
      userName: this.actor['userName'],
      bRoute: this.routeEditForm.value.broute.split('-')[0],
      bArea: this.routeEditForm.value.broute.split('-')[1],
      busStop: await this.getStopCoords()
    };

   const res = await this._pAuth.updateUserDetails(data);
   try {
    if (res) {
      const student = {
        type: 'student',
        details: res
      };
     await this._storage.set('iamhereLog', student);
    }
   } catch (error) {
     console.log(error);
   }
  }

  async getStops() {
    const bus = await this._pMap.getBusLoc(this.routeEditForm.value.broute.split(': ')[1].split('-')[0]);
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
      const stops = this.stopsArr.find((stop) => stop['locName'] === this.routeEditForm.value.busstop);
      if (stops) {
        resolve(stops);
      } else {
        reject('Invalid Stop Selected');
      }
    });
  }

}
