import { inject } from '@angular/core'
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs'
import { finalize } from 'rxjs/operators'
import { LoaderService } from './loader.service'

export function loaderInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const loaderService = inject(LoaderService)
  loaderService.show()
  return next(req).pipe(finalize(() => loaderService.hide()))
}
