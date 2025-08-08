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
import { AuthInterceptor } from './auth.interceptor'
import { registerLocaleData } from '@angular/common'
import localeEs from '@angular/common/locales/es'

// Register the locale data
registerLocaleData(localeEs)

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([AuthInterceptor])),
  ],
}
