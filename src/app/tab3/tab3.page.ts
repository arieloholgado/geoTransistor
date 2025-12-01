// import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

import { Component, ElementRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 👈 necesario en standalone
})
// export class Tab3Page implements OnInit {
export class Tab3Page {
  constructor() {}
  @ViewChild('mapElement', { static: true }) mapElement!: ElementRef<HTMLElement>;
  private map?: GoogleMap;

  // async ngOnInit() {
  async ionViewDidEnter() {

    if (!this.mapElement?.nativeElement) return;

    try {
      this.map = await GoogleMap.create({
        id: 'my-map', // un ID único
        element: this.mapElement.nativeElement,
        apiKey: 'AIzaSyAR7n8VEJBOTpCGkB_Jz-wNcCD7JiWyldw', // solo para web
        config: {
          center: {
            lat: -34.6037, // Ej: Buenos Aires
            lng: -58.3816,
          },
          zoom: 12,
        },
      });

      // Ejemplo: añadir marcador
      await this.map.addMarker({
        coordinate: {
          lat: -34.6037,
          lng: -58.3816,
        },
        title: 'Buenos Aires',
      });

    } catch (err) {
      console.error('Error creando el mapa:', err);
    }
  }

  async ionViewWillLeave() {
    if (this.map) {
      await this.map.destroy();
      this.map = undefined;
    }
  }

}
