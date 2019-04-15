import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as env from '../../environments/environment';


@Injectable  (  {
  providedIn :  'root'
})
export class MapService   {
  studentUrl = env.default.apiUrl + 'students/';
  busUrl = env.default.apiUrl + 'buses/';
  stops: any[] = [];
  locationLog: { lat: 0, lng: 0 }[] = [];

  constructor  (public http:  HttpClient)   { }

  storeCurrentLoc({lat, lng }) {
    this.locationLog.push({ lat, lng });
    return this.locationLog;
  }


  getBusLoc(route) {

    return new Promise((resolve, reject) => {
      this.http.put(this.busUrl + 'route', {route : route}).subscribe ((res) => {
        if (res)  {
          console.log(res);
          this.stops = res['stops'];
          resolve(res);
        } else  {
          reject  ('No Bus in this Route');
        }
      });
    });
  }

  updateLoc  (data)  {
    return new Promise((resolve, reject) => {
      this.http.put(this.busUrl + 'logloc',   {busId  :  data['busId'], currentLoc : data['currentLoc']}).subscribe  (  (res) =>  {
        if  (res)  {
          resolve(res);
        } else  {
          reject  ('No Bus in this Route');
        }
      });
    });
  }
  sendMessage(route) {
    return new Promise((resolve, reject) => {
      this.http.post(this.busUrl + 'sendnotif', {route: route}).subscribe((res) => {
        resolve(res);
      });
    });
  }
}
