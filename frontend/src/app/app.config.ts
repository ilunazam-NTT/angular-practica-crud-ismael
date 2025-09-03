import {
  LOCALE_ID,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core'
import { provideRouter } from '@angular/router'
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http'
import { routes } from './app.routes'
import { authInterceptor } from './core/interceptors/auth.interceptor'
import { loaderInterceptor } from './core/interceptors/loader.interceptor'

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, loaderInterceptor])
    ),
  ],
}
