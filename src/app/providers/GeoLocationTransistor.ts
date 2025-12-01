import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';

export class LocationProvider {
  
  // Verificar y solicitar permisos
  private async checkPermissions(): Promise<boolean> {
    try {
      const status = await BackgroundGeolocation.requestPermission();
    //   return status.background === 'granted' && status.foreground === 'granted';
      return status === 3 || status === 4;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }
  
  // Obtener ubicación con alta precisión
  async getHighAccuracyLocation(timeoutSeconds: number = 30): Promise<{
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: string;
  } | null> {
    
    const hasPermission = await this.checkPermissions();
    if (!hasPermission) {
      console.error('No location permissions');
      return null;
    }
    
    try {
      const location = await BackgroundGeolocation.getCurrentPosition({
        timeout: timeoutSeconds,
        maximumAge: 0,
        desiredAccuracy: 0, // Máxima precisión
        persist: false // No persistir en base de datos
      });
      
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp
      };
      
    } catch (error) {
      console.error('Error getting high accuracy location:', error);
      return null;
    }
  }
  
  // Obtener ubicación rápida (menos precisa pero más rápida)
  async getQuickLocation(): Promise<{
    latitude: number;
    longitude: number;
  } | null> {
    
    const hasPermission = await this.checkPermissions();
    if (!hasPermission) {
      return null;
    }
    
    try {
      const location = await BackgroundGeolocation.getCurrentPosition({
        timeout: 10,
        maximumAge: 60000, // Aceptar ubicación de hasta 1 minuto
        desiredAccuracy: 100, // Precisión media
        persist: false
      });
      
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
      
    } catch (error) {
      console.error('Error getting quick location:', error);
      return null;
    }
  }
}

// // Uso:
// const locationService = new LocationService();

// // Obtener ubicación precisa
// const preciseLocation = await locationService.getHighAccuracyLocation();
// if (preciseLocation) {
//   console.log('Ubicación precisa:', preciseLocation.latitude, preciseLocation.longitude);
// }

// // Obtener ubicación rápida
// const quickLocation = await locationService.getQuickLocation();
// if (quickLocation) {
//   console.log('Ubicación rápida:', quickLocation.latitude, quickLocation.longitude);
// }