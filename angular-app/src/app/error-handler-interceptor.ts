import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');

  if (token) {

  

  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      if (error.status === 400) {
        alert('Bad request. Please check the entered data.');
      }
      else if (error.status === 401) {
        alert('You are not authorized.');
      }
      else if (error.status === 403) {
        alert('Access denied.');
      }
      else if (error.status === 404) {
        alert('Requested data was not found.');
      }
      else if (error.status === 500) {
        alert('Server error. Please try again later.');
      }
      else {
        alert('Something went wrong. Please try again.');
      }

      return throwError(() => error);

    })

  );

};