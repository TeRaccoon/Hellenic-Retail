import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { apiUrlBase } from './data.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticated = new BehaviorSubject<boolean>(false);
    private userID: string | null = null

    constructor(private http: HttpClient) {
        this.checkLogin();
    }

    checkLogin() {
        const url = apiUrlBase + 'manage_data.php';
    
        return this.http
            .post(url, { action: 'check-login-customer' }, { withCredentials: true })
            .pipe(
            map((response: any) => {
                if (response.data != null) {
                    this.userID = response.data;
                }
                return response;
            })
        );
    }

    login(userID: string) {
        this.userID = userID;
        this.isAuthenticated.next(true);
    }

    logout() {
        this.isAuthenticated.next(false);
    }

    isLoggedInObservable(): Observable<boolean> {
        return this.isAuthenticated.asObservable();
    }

    isLoggedIn() {
        return this.isAuthenticated.getValue();
    }

    getUserID() {
        return this.userID
    }
}