import {
  LOCALE_ID,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core'
import { provideRouter, withComponentInputBinding } from '@angular/router'
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http'
import { routes } from './app.routes'
import { authInterceptor } from './core/interceptors/auth.interceptor'
import { loaderInterceptor } from './core/interceptors/loader.interceptor'
import { errorInterceptor } from './core/interceptors/error.interceptor'

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, errorInterceptor, loaderInterceptor])
    ),
  ],
}
