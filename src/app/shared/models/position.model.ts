export class Position {
    coords: { 
        latitude: number; 
        longitude: number; 
        accuracy: number; 
        altitudeAccuracy: number | null; 
        altitude: number | null; 
        speed: number | null; 
        heading: number | null; 
    };
    timestamp: number;

  constructor(
    public longitude: number = 0,
    public latitude: number = 0,
    public accuracy: number = 0,
    public altitude: number = 0,
    public altitudeAccuracy: number = 0,
    // public bearing: number = 0,
    // public simulated: boolean = false,
    public speed: number = 0,
    // public time: number = Date.now()
  ) {}
}