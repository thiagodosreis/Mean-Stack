import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error/error.component';

// Interceptors are Services offered by Angular Http Client
// functions that will run on any outgoing http request
// that we can manipulate to inject anything we want, as adding a Token Header
// works as a middleware in the nodejs but for outgoing instead of ingoing requests

// Should be add as a providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}]
// in the AppModule

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  // Every outgoing http request will have this interceptor / will be watched by this and
  // if get back an error response this interceptor will kick in.


  // Angular Material Dialog - for beautiful UI
  // Needs to add to app.module -> entryComponents: [ErrorComponent]
  // this component will be used eventually, eventhough Angular can't see it.
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // listening to the response of the http requests
    return next.handle(req).pipe( // adding pipe to catchError
      // emitting errors
      catchError((error: HttpErrorResponse) => {
        // console.log(error);

        let errorMessage = 'An unknown error occurred!';
        if (error.error.message) {
          errorMessage = error.error.message;
        }

        // the second parameter is the data you need to pass on to the component
        this.dialog.open(ErrorComponent, {data: {message: errorMessage}});

        // adding information to the Observable Streem that we subscribe in the app when call http (get/post)
        return throwError(error);
      })
    );
  }
}

