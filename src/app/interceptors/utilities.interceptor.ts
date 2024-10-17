import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpInterceptorFn,
    HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';

// var token =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IiQyYSQxMCQ2N3dmSFJiOGFCUW9SenFvaW0vL3V1eFExRGdQT1EwRzAzQ09sMU9PLlVBdDlLWEpmTTh0eSIsImlkIjozLCJub21icmUiOiJEYWlybyBSYWZhZWwiLCJhcGVsbGlkbyI6IkJhcnJpb3MgUmFtb3MiLCJkb2N1bWVudG8iOiIxMDgzNDM0NzcwIiwidGlwb191c3VhcmlvIjoiU1VQRVJfQURNSU4iLCJlbXByZXNhX2lkIjpudWxsLCJlc3RhZG8iOiJBIiwiaWF0IjoxNzI5MTc4ODE2LCJleHAiOjE3MjkxODI0MTZ9.bK5I77HcDSiToxO23dyJs13N2sk93bTEApAHWPiGMpI';
export const utilitiesInterceptor: HttpInterceptorFn = (req, next) => {
    const service = inject(StorageService);
    const token = service.obtenerToken();
    const request = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
        },
    });
    return next(request).pipe(
        catchError((err: any) => {
            if (err instanceof HttpErrorResponse) {
                // Handle HTTP errors
                if (err.status === 401) {
                    // Specific handling for unauthorized errors
                    console.error('Unauthorized request:', err);
                    // You might trigger a re-authentication flow or redirect the user here
                } else {
                    // Handle other HTTP error codes
                    console.error('HTTP error:', err);
                }
            } else {
                // Handle non-HTTP errors
                console.error('An error occurred:', err);
            }

            // Re-throw the error to propagate it further
            return throwError(() => err);
        })
    );
};

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    service = inject(StorageService);
    token: string;
    constructor() {
        this.token = this.service.obtenerToken();
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const request = req.clone({
            setHeaders: {
                Authorization: `Bearer ${this.token}`,
            },
        });
        return next.handle(request);
        // si quiero modificar la respuesta antes de que llegue al component
        // return next.handle(request).pipe(
        //     tap((event: HttpEvent<any>) => {
        //         console.log('Incoming HTTP response', event);
        //     })
        // );
    }
}
