import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import BackgroundGeolocation, { TransistorAuthorizationToken, HttpEvent } from '@transistorsoft/capacitor-background-geolocation';
import { ENV } from './ENV'; // Ajustá esta ruta según tu estructura

let onHttpSubscription: any = null;

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private navCtrl: NavController) {}

  /**
   * Inicializa los listeners y módulos relacionados con geolocalización en segundo plano.
   * Reemplaza al useEffect() del código React original.
   */
  async init(): Promise<void> {
    console.log('[AuthorizationService] init()');

    await this.registerTransistorAuthorizationListener();
    await this.initBackgroundGeolocation();
    await this.initBackgroundFetch();
  }

  /**
   * Listener global para manejar respuestas HTTP del servidor TransistorSoft.
   * Maneja los códigos 403, 406 y 410 relacionados con el token de autorización.
   */
  async registerTransistorAuthorizationListener(): Promise<void> {
    console.log('[Authorization] registerTransistorAuthorizationListener()');

    if (onHttpSubscription !== null) {
      onHttpSubscription.remove();
    }

    onHttpSubscription = BackgroundGeolocation.onHttp(async (event: HttpEvent) => {
      console.log('[Authorization] HTTP Event:', event.status);

      switch (event.status) {
        case 403:
        case 406:
          await BackgroundGeolocation.destroyTransistorAuthorizationToken(ENV.TRACKER_HOST);
          const token = await this.register();
          if (token.accessToken !== 'DUMMY_TOKEN') {
            BackgroundGeolocation.sync();
          }
          break;

        case 410:
          await this.goHome();
          break;
      }
    });
  }

  /**
   * Registra o renueva el token TransistorAuthorizationToken.
   */
  private async register(): Promise<TransistorAuthorizationToken> {
    console.log('[TransistorAuth] Registrando dispositivo...');
    await BackgroundGeolocation.destroyTransistorAuthorizationToken(ENV.TRACKER_HOST);

    const orgname = (await Preferences.get({ key: 'orgname' })).value;
    const username = (await Preferences.get({ key: 'username' })).value;

    if (!orgname || !username) {
      console.warn('[TransistorAuth] No se encontraron credenciales. Redirigiendo a Home.');
      await this.goHome();
      return {
        accessToken: 'DUMMY_TOKEN',
        refreshToken: 'DUMMY_TOKEN',
        expires: -1,
        url: ''
      };
    }

    const token: TransistorAuthorizationToken =
      await BackgroundGeolocation.findOrCreateTransistorAuthorizationToken(orgname, username, ENV.TRACKER_HOST);

    await BackgroundGeolocation.setConfig({
      transistorAuthorizationToken: token
    });

    console.log('[TransistorAuth] Token configurado correctamente');
    return token;
  }

  /**
   * Redirige al Home y elimina el username almacenado si el token es inválido.
   */
  private async goHome(): Promise<void> {
    console.log('[TransistorAuth] Token inválido. Redirigiendo al Home.');
    await Preferences.remove({ key: 'username' });
    this.navCtrl.navigateRoot('/home');
  }

  /**
   * Inicializa la configuración principal de BackgroundGeolocation.
   * Acá podés personalizar la configuración según tu proyecto.
   */
  private async initBackgroundGeolocation(): Promise<void> {
    console.log('[AuthorizationService] initBackgroundGeolocation()');

    await BackgroundGeolocation.ready({
      reset: true,
      debug: false,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 50,
      stopOnTerminate: false,
      startOnBoot: true,
      url: `${ENV.TRACKER_HOST}/locations`,
      batchSync: true,
      autoSync: true
    });

    console.log('[BackgroundGeolocation] Ready');
  }

  /**
   * Inicializa la funcionalidad de BackgroundFetch (si la usás en el proyecto).
   */
  private async initBackgroundFetch(): Promise<void> {
    console.log('[AuthorizationService] initBackgroundFetch()');
    // Si tenés una función de fetch adicional, podés implementarla acá
  }

  /**
   * Limpieza de listeners o recursos si fuera necesario.
   */
  destroy(): void {
    if (onHttpSubscription !== null) {
      onHttpSubscription.remove();
      onHttpSubscription = null;
    }
    console.log('[AuthorizationService] destroyed.');
  }
}
