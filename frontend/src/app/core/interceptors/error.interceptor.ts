import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { NotificationService } from '../services/notification.service'; // Ajusta la ruta

export function errorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Extraer mensaje del servidor
      const serverMessage = error?.message || error.error.error + '. ' + error.error.message + '. ' + error.error.statusCode || 'Error desconocido';
      const errorMessage = 
        `Error en petición: ${serverMessage}`

      // Mostrar notificación de error
      notificationService.showError(errorMessage);

      // Re-lanzar el error para que pueda manejarse localmente si se desea
      return throwError(() => error);
    })
  );
}
