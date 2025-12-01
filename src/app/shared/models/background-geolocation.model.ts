export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number;
  heading: number;
  altitude: number;
  ellipsoidal_altitude: number;
}

export interface LocationActivity {
  type: 'still' | 'on_foot' | 'walking' | 'running' | 'in_vehicle' | 'on_bicycle';
  confidence: number; // porcentaje 0–100
}

export interface LocationBattery {
  level: number;
  is_charging: boolean;
}

export interface BackgroundGeolocationEvent {
  timestamp: Date;
  event: 'motionchange' | 'geofence' | 'heartbeat';
  is_moving: boolean;
  uuid: string;
  age: number;
  coords: LocationCoords;
  activity: LocationActivity;
  battery: LocationBattery;
  odometer: number;
}
