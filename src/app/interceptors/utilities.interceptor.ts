import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpInterceptorFn,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    storageService = inject(StorageService);
    token: string;
    constructor(private router: Router) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = this.storageService.token();
        const request = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
        this.storageService.almacenarRutaActual(this.router.url);

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this.router.navigateByUrl('/');
                }
                return throwError(() => error);
            })
        );
        // si quiero modificar la respuesta antes de que llegue al component
        // return next.handle(request).pipe(
        //     tap((event: HttpEvent<any>) => {
        //         console.log('Incoming HTTP response', event);
        //     })
        // );
    }
}
