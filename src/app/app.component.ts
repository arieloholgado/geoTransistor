import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit{
  constructor() {}

  async ngOnInit(): Promise<void> {
    await this.initializeBackgroundGeolocation();
  }

  // En tu app`.component.ts o servicio principal
  async initializeBackgroundGeolocation() {

    await BackgroundGeolocation.ready({
      reset: true,
      debug: true, // muestra notificaciones de depuración
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 50, // cada 50 metros
      stopOnTerminate: false,
      startOnBoot: true
      // ⚠️ NO pongas licenseKey todavía
    });
  }

}
