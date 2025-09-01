import { HttpRequest, HttpHandlerFn } from '@angular/common/http'

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  // Get the token
  const token = localStorage.getItem('auth-token')

  // Clone the request to add the authentication header.
  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  })
  return next(newReq)
}
