/// <reference types="google-maps" />

import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';

import { MapService } from '../services/map.service';
import { AuthenticationService } from './../services/authentication.service';
import { throttleTime } from 'rxjs/operators';



declare var google: any;
// declare var AdvancedGeolocation: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  @ViewChild('map') mapElement;
  directionsService = new google.maps.DirectionsService();
  map: any;
  marker: any;
  arrDistTime: any[] = [];
  mStop = { lat: 17.435237, lng: 78.656304 };
  eTime = ' ';
  eDist = ' ';
  currentLat = 0;
  currentLng = 0;
  bus: any;
  actor = '';

  constructor(private _platform: Platform, private pAuth: AuthenticationService, private pMap: MapService,
    private geolocation: Geolocation, private _storage: Storage) {
    this.currentLat = 17.3984;
    this.currentLng = 78.5583;
    this._platform.ready().then(() => {
      this.geolocation.getCurrentPosition().then((res) => {
        this.currentLat = res.coords.latitude;
        this.currentLng = res.coords.longitude;
      });
      this.loadMap();
      // if (this. _platform.is('android')) {
      //   // this. _platform.registerBackButtonAction((e)=>{
      //   //   e.preventDefault();
      //   // },101)
      //   if (this.pAuth.actor.type === 'bus') {
      //     let data: any;
      //     this.bus = this.pAuth.actor.details;
      //     AdvancedGeolocation.start((success) => {
      //       try {
      //         const jsonObject = JSON.parse(success);
      //         switch (jsonObject.provider) {
      //           // case "gps":
      //           //   this.currentLat = jsonObject.latitude;
      //           //   this.currentLng = jsonObject.longitude;
      //           //   this.pMap.storeCurrentLoc({ lat: this.currentLat, lng: this.currentLng });
      //           //   this.makeMarker();
      //           //   this.setRouteMarks();
      //           //   data={
      //           //     busId:this.bus.busId,
      //           //     currentLoc:{lat:this.currentLat,lng:this.currentLng}
      //           //   }
      //           //   this.pMap.updateLoc(data)
      //           //   break;
      //           case 'network':
      //             this.currentLat = jsonObject.latitude;
      //             this.currentLng = jsonObject.longitude;
      //             this.makeMarker();
      //             this.setRouteMarks();
      //             data = {
      //               busId: this.bus.busId,
      //               currentLoc: {lat: this.currentLat, lng: this.currentLng}
      //             };
      //             this.pMap.updateLoc(data);
      //             break;
      //         }
      //       } catch (exc) {
      //         console.log('Invalid JSON: ' + exc);
      //       }
      //     },
      //       function (error) {
      //         console.log('ERROR! ' + JSON.stringify(error));
      //       },
      //       {
      //         'minTime': 500,         // Min time interval between updates (ms)
      //         'minDistance': 1,       // Min distance between updates (meters)
      //         'noWarn': true,         // Native location provider warnings
      //         'providers': 'all',     // Return GPS, NETWORK and CELL locations
      //         'useCache': true,       // Return GPS and NETWORK cached locations
      //         'satelliteData': false, // Return of GPS satellite info
      //         'buffer': false,        // Buffer location data
      //         'bufferSize': 0,         // Max elements in buffer
      //         'signalStrength': false // Return cell signal strength data
      //       });
      //   } else {
      //     if (this.pAuth.actor.type === 'student') {
      //     const route = this.pAuth.actor.details['bRoute'].split(':')[1];
      //     this.pMap.getBusLoc(route).then((res) => {
      //       this.bus = res;
      //       this.currentLat = res['currentLoc'].lat;
      //       this.currentLng = res['currentLoc'].lng;
      //       this.makeMarker();
      //       this.setRouteMarks();
      //     });
      //     }
      //   }

      // } else {
      //   if (this.pAuth.actor.type === 'bus') {
      //     this.bus = this.pAuth.actor.details;
      //     let res: any;
      //       this.geolocation.watchPosition().subscribe((data) => {
      //         this.currentLat = data.coords.latitude;
      //         this.currentLng = data.coords.longitude;
      //         this.makeMarker();
      //         this.setRouteMarks();
      //         res = {
      //            busId: this.bus.busId,
      //             currentLoc: {lat: this.currentLat, lng: this.currentLng}
      //         };
      //         this.pMap.updateLoc(res);
      //       });
      //   } else {
      //     if (this.pAuth.actor.type === 'student') {
      //       const route = this.pAuth.actor.details['bRoute'].split(':')[1];
      //       this.pMap.getBusLoc(route).then((res) => {
      //         this.bus = res;
      //         this.currentLat = res['currentLoc'].lat;
      //         this.currentLng = res['currentLoc'].lng;
      //         this.makeMarker();
      //         this.setRouteMarks();
      //       });
      //     }
      //   }
      // }
    });
  }

  ngOnInit() {
    this._storage.get('iamhereLog').then((res) => {
      if (res) {
        this.actor = res;
        this.ViewRenderer();
      }
     }).catch((err) => {
         console.log(err);
  });
  }

  ViewRenderer() {
    if (this.actor['type'] === 'bus') {
      let data: any;
      this.bus = this.actor['details'];
      this.geolocation.watchPosition().pipe(throttleTime(10000)).subscribe((res) => {
        this.currentLat = res.coords.latitude;
        this.currentLng = res.coords.longitude;
        this.makeMarker();
        this.setRouteMarks();
        data = {
          busId: this.bus.busId,
          currentLoc: { lat: this.currentLat, lng: this.currentLng }
        };
        this.pMap.updateLoc(data);
      });
    } else {
      if (this.actor['type'] === 'student') {
        this.mStop = {
          lat : this.actor['details']['busStop'].lat,
          lng : this.actor['details']['busStop'].lng
        };
        const route = this.actor['details']['bRoute'].split(':')[1].trim();
        console.log(route);
        this.pMap.getBusLoc(route).then((res) => {
          console.log(res);
          this.bus = res;
          this.currentLat = res['currentLoc'].lat;
          this.currentLng = res['currentLoc'].lng;
          this.makeMarker();
          this.setRouteMarks();
        });
      }
    }
  }


  loadMap() {
    const coords = new google.maps.LatLng(this.currentLat, this.currentLng);
    const mapOptions: google.maps.MapOptions = {
      center: coords,
      zoom: 18,
      mapTypeControl: false,

      scaleControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.marker = new google.maps.Marker({
      map: this.map,
      position: new google.maps.LatLng(this.currentLat, this.currentLng),
      icon: '../../assets/imgs/map/transport.png',
    });
  }

  makeMarker() {
    this.marker.setPosition(new google.maps.LatLng(this.currentLat, this.currentLng));
    this.map.panTo(new google.maps.LatLng(this.currentLat, this.currentLng));
  }

  async setRouteMarks() {
    this.arrDistTime = [];
    const stops = this.bus['stops'];
    for (const key in stops) {
      if (stops.hasOwnProperty(key)) {
        const map = new google.maps.Marker({
          map: this.map,
          position: new google.maps.LatLng(stops[key].lat, stops[key].lng),
          icon: '../../assets/imgs/map/ic_stop.png',
        });
        if (this.actor['type'] === 'student') {
          const dest = { lat: stops[key].lat, lng: stops[key].lng };
          const x = await this.calcDistance(dest);
          this.arrDistTime.push(x);
          this.setTimeDist();
        }
      }
    }
  }

  calcDistance(dest) {
    const origin = { lat: this.currentLat, lng: this.currentLng };
    const request = {
      origin: origin,
      destination: dest,
      travelMode: 'DRIVING'
    };
    return new Promise((resolve, reject) => {
      this.directionsService.route(request, function (result, status) {
        if (status === 'OK') {
          resolve({
            stop: dest, dist: result['routes'][0]['legs'][0]['distance']['text'],
            time: result['routes'][0]['legs'][0]['duration']['text']
          }
          );
        } else {
          reject('Couldn\'t Calculate Distance');
        }
      });
    });
  }

  setTimeDist() {
    this.arrDistTime.forEach((loc) => {
      if (loc['stop']['lat'] === this.mStop['lat'] && loc['stop']['lng'] === this.mStop['lng']) {
        this.eDist = loc['dist'];
        this.eTime = loc['time'];
      }
    });

  }

  sendMessage() {
    this.pMap.sendMessage(this.bus.route.trim()).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });

  }

}
