import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // No mostrar loading para pings automáticos
    const isPing = req.url.includes('/dashboard/') && req.method === 'GET';
    
    if (!isPing) {
      this.loadingSubject.next(true);
    }

    return next.handle(req).pipe(
      tap({
        next: (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if (!isPing) {
              setTimeout(() => this.loadingSubject.next(false), 300);
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          if (!isPing) {
            this.loadingSubject.next(false);
          }
          console.error('HTTP Error:', error);
        }
      })
    );
  }
}