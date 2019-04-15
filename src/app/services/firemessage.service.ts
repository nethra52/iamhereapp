import { Injectable } from '@angular/core';

import { FCM } from '@ionic-native/fcm/ngx';


@Injectable({
  providedIn: 'root'
})
export class FiremessageService {

  constructor(private _fcm: FCM) {}

  subscribeToTopic(topic) {
    this._fcm.subscribeToTopic(topic);
  }

  getToken() {
    return new Promise((resolve, reject) => {
    return this._fcm.getToken().then(token => {
        console.log(token);
        resolve(token);
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
    });
  }

  onNotification() {
    this._fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        console.log('Received in background', data);
      } else {
        console.log('Received in foreground', data);
      }
    });
  }

  tokenRefresh() {
    this._fcm.onTokenRefresh().subscribe(token => {
      //
    });
  }

  unSubscribeTopic(topic) {
    this._fcm.unsubscribeFromTopic(topic);
  }
}
