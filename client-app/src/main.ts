import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient } from "@angular/common/http";
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from "./app/app.routes";
import { registerIcons } from "./app/core/icons/icons";
import { register } from 'swiper/element/bundle';

register();
registerIcons();

bootstrapApplication(App, {
    providers: [
        provideHttpClient(),
        ...appConfig.providers,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        provideIonicAngular(),
        provideRouter(routes, withPreloading(PreloadAllModules)),
    ],
}).catch((err) => console.error(err));
