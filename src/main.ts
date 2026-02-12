import { APP_INITIALIZER, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { AppConfigService } from './app/services/app-config.service';
import { APP_CONFIG } from './app/core/config/app-config.token';
import { environment } from './environments/environment';

export function initializeApp(appConfig: AppConfigService) {
  return () => appConfig.loadAppConfig();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: APP_CONFIG, useValue: environment },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(),
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService],
      multi: true
    }
  ],
});
