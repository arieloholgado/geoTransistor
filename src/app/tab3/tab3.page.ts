// import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

import { Component, ElementRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';

import { AuthorizationService } from '../../config/Authorization';
// import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';
// import BackgroundGeolocation, { TransistorAuthorizationToken, HttpEvent } from '@transistorsoft/capacitor-background-geolocation';
import BackgroundGeolocation, { Location, MotionActivityEvent, Subscription } from '@transistorsoft/capacitor-background-geolocation';

import { Preferences } from '@capacitor/preferences';
import { ENV } from '../../config/ENV';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 👈 necesario en standalone
})
// export class Tab3Page implements OnInit {
export class Tab3Page {
  constructor( private auth: AuthorizationService ) {}
  @ViewChild('mapElement', { static: true }) mapElement!: ElementRef<HTMLElement>;
  private map?: GoogleMap;
  private locationSubscription: any;



  location: Location | null = null;
  isMoving: boolean = false;
  motionActivityEvent: MotionActivityEvent | null = null;
  enabled: boolean = false;
  odometer: number = 0;
  ready: boolean = false;

  subscriptions: Subscription[] = [];

  private subscribe(sub: Subscription) {
    this.subscriptions.push(sub);
  }



  async ngOnInit() {

    await Preferences.set({ key: 'orgname', value: 'arielholgado' });
    await Preferences.set({ key: 'username', value: 'arieloholgado' });
    // Configura el listener global
    await this.auth.registerTransistorAuthorizationListener();
  }

  ngOnDestroy() {

    this.subscriptions.forEach(s => s.remove());

    // Limpia listeners
    this.auth.removeListener();
  }

  // async ngOnInit() {
  async ionViewDidEnter() {
    // 1. Permisos
    const granted = await this.requestLocationPermission();
    if (!granted) return; // Si no dio permiso, no hacemos nada

    // 2. Registrar BackgroundGeolocation.ready()
    await this.initBackgroundGeolocation();

    // 3. Crear el mapa
    await this.loadMap();
    
    // 4. Agrego listener de posición
    await this.initLocationTracking();
  }

  
  async ionViewWillLeave() {
    if (this.map) {
      await this.map.destroy();
      this.map = undefined;
    }

    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }

    await BackgroundGeolocation.stop();
  }


  private async loadMap() {
    if (!this.mapElement?.nativeElement) return;

    this.map = await GoogleMap.create({
      id: 'my-map',
      element: this.mapElement.nativeElement,
      apiKey: 'AIzaSyAR7n8VEJBOTpCGkB_Jz-wNcCD7JiWyldw',
      config: {
        center: { lat: -34.6037, lng: -58.3816 },
        zoom: 14,
      },
    });
  }

  async initBackgroundGeolocation() {
    const org = (await Preferences.get({key: 'orgname'})).value;
    const username = (await Preferences.get({key: 'username'})).value;

    if (!org || !username) {
      console.warn("org / username no configurados");
      return;
    }

    const token = await BackgroundGeolocation.findOrCreateTransistorAuthorizationToken(
      org,
      username,
      ENV.TRACKER_HOST
    );

    const state = await BackgroundGeolocation.ready({
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,

      transistorAuthorizationToken: token,

      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION,
      distanceFilter: 10,
      stopTimeout: 5,

      locationAuthorizationRequest: 'Always',
      autoSync: true,
      stopOnTerminate: false,
      startOnBoot: true
    });

    console.log("BG Ready:", state);
  }

  async initLocationTracking() {
    BackgroundGeolocation.onLocation((location) => {
      console.log("Location:", location);

      if (this.map) {
        this.map.setCamera({
          coordinate: {
            lat: location.coords.latitude,
            lng: location.coords.longitude
          },
          zoom: 16
        });
      }
    });

    await BackgroundGeolocation.start();
  }

  private async requestLocationPermission() {
    // Obtener el estado actual del proveedor
    const providerState = await BackgroundGeolocation.getProviderState();
    console.log('Current authorization status:', providerState.status);

    // Por simplicidad vamos a pedir Always directamente (podés mostrar un alert si querés "WhenInUse / Always")
    await BackgroundGeolocation.setConfig({ locationAuthorizationRequest: 'Always' });

    const status = await BackgroundGeolocation.requestPermission();
    console.log('Permission status:', status);

    if (status === 1 || status === 2) {
      return true;
    } else {
      console.warn('Permiso de ubicación denegado');
      return false;
    }
  }


}
