import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

// Interceptors are Services offered by Angular Http Client
// functions that will run on any outgoing http request
// that we can manipulate to inject anything we want, as adding a Token Header
// works as a middleware in the nodejs but for outgoing instead of ingoing requests

// Should be add as a providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}]
// in the AppModule

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();

    // we need to clone the original request. Never change the original one.
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });

    // continue the request function
    return next.handle(authRequest);
  }
}

