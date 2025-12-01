// import { } from '@types/google.maps';
import { Component, OnInit, ChangeDetectorRef, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';

@Component({
    template: `
      <!-- <capacitor-google-map #map></capacitor-google-map> -->
      <button (click)="createMap()">Create Map</button>
    `,
    styles: [
      `
        capacitor-google-map {
          display: inline-block;
          width: 275px;
          height: 400px;
        }
      `,
    ],
  })
  export class Map {
    @ViewChild('map')
    mapRef: ElementRef<HTMLElement>;
    newMap: GoogleMap;
  
    async createMap() {
      this.newMap = await GoogleMap.create({
        id: 'my-cool-map',
        element: this.mapRef.nativeElement,
        apiKey: "AIzaSyAR7n8VEJBOTpCGkB_Jz-wNcCD7JiWyldw",
        config: {
          center: {
            lat: 33.6,
            lng: -117.9,
          },
          zoom: 8,
        },
      });
    }
  }

// export class Map {
    
//     map: google.maps.Map;
// 	marker: google.maps.Marker;
//     position: google.maps.LatLng;

//     polygon = new google.maps.Polyline({
//         path: [], // Aquí puedes especificar las coordenadas que formarán el polígono
//         geodesic: true,
//         strokeColor: "#FF0000",
//         strokeOpacity: 1.0,
//         strokeWeight: 2,
//       });

//     initMap(mapObject: any) {
// 		if (!mapObject) return;
//         let mapProp = {
//           zoom: 15,
//           mapTypeId: google.maps.MapTypeId.ROADMAP
//         };
//         this.map = new google.maps.Map(mapObject.nativeElement, mapProp);
//     }

//     addMarker(title: string) {
// 		if (this.marker != null) {
// 			this.marker.setMap(null);
// 		}
//         this.marker = new google.maps.Marker({
//             position: this.position,
//             title: title
//         });
//         this.marker.setMap(this.map);
//     }

//     addPolyline(pathLine: any) {
//         this.polygon = new google.maps.Polyline({
//             path: pathLine, // Aquí puedes especificar las coordenadas que formarán el polígono
//             geodesic: true,
//             strokeColor: "#FF0000",
//             strokeOpacity: 1.0,
//             strokeWeight: 2,
//           });
//         this.polygon.setMap(this.map);
//     }
 
//     updatePosition(latitude: number, longtitude: number){
//         if (this.map!=undefined) {
//             this.position = new google.maps.LatLng(latitude, longtitude);
//             this.map.setCenter(this.position);
//         }
//     }
// }
