import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { Account } from 'app/models/account.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_ENDPOINT = environment.baseUrl + '/auth';

    public accountId: string | null = null;
    public authToken: string | null = null;
    public loggedIn: boolean = false;

    constructor(private http: HttpClient) { }

    login(username: string, password: string): Observable<HttpResponse<any>> {
        this.accountId = username;
        this.authToken = 'Basic ' + btoa(username + ':' + password);

        return this.http.get(this.API_ENDPOINT + '/login', {
            observe: 'response',
        }).pipe(
            tap(response => {
                if (response.ok) {
                    this.loggedIn = true;
                } else {
                    this.logout();
                }
            }),
            catchError((err) => {
                this.logout();
                return throwError(() => err);
            })
        );
    }

    signup(holderName: string, password: string): Observable<Account> {
        return this.http.post<Account>(environment.baseUrl + '/accounts/signup', {
            holderName: holderName,
            password: password
        }).pipe(
            tap(response => {
                this.accountId = response.id;
                this.authToken = 'Basic ' + btoa(response.id + ':' + password);
                this.loggedIn = true;
            }),
            catchError((err) => {
                this.logout();
                return throwError(() => err);
            })
        );
    }

    logout(): void {
        this.loggedIn = false;
        this.accountId = null;
        this.authToken = null;
    }
}
