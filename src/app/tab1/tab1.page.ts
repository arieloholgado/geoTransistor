import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';
import { LocationProvider } from '../providers/GeoLocationTransistor';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class Tab1Page implements OnInit{
  private locationProvider = new LocationProvider();

  constructor() {}

  async ngOnInit(): Promise<void> {
    await this.getLocation();
  }

  async getLocation() {
    // Obtener ubicación rápida
    const quickLocation = await this.locationProvider.getQuickLocation();
    if (quickLocation) {
      console.log('Ubicación rápida:', quickLocation.latitude, quickLocation.longitude);
    }
  }

}
