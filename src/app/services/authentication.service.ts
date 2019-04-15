import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as env from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  studentUrl = env.default.apiUrl + 'students/';
  busUrl = env.default.apiUrl + 'buses/';
  public actor = {
    type: '',
    details: {}
  };
  constructor(public http: HttpClient) { }

  registerStudent(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.studentUrl + 'register', data).subscribe((res) => {
        if (res) {
          resolve(res);
        } else {
          reject('Couldn\'t Register');
        }
      });
    });
  }


  loginStudent(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.studentUrl + 'login', data).subscribe((res) => {
        if (res) {
          this.actor.type = 'student',
            this.actor.details = res;
          resolve(res);
        } else {
          reject('Authentication Failed');
        }
      });
    });
  }

  loginBus(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.busUrl + 'login', data).subscribe((res) => {
        if (res) {
          this.actor.type = 'bus',
          this.actor.details = res;
          resolve(res);
        } else {
          reject('Authentication Failed');
        }
      });
    });
  }

  updateUserDetails(data) {
    return new Promise((resolve, reject) => {
      this.http.put(this.studentUrl + 'update', data).subscribe((res) => {
        if (res) {
          resolve(res);
        } else {
          reject('Authentication Failed');
        }
      });
    });
  }

  updateFcmId(id) {
    return new Promise((resolve, reject) => {
      this.http.put(this.studentUrl + 'updatefcid', id).subscribe((res) => {
        if (res) {
          resolve(res);
        } else {
          reject('Authentication Failed');
        }
      });
    });
  }
}
