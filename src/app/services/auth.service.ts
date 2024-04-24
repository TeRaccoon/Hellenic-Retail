import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom, map } from 'rxjs';
import { DataService, apiUrlBase } from './data.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticated = new BehaviorSubject<boolean>(false);
    private userID: string | null = null
    private userType: string | null = null;

    constructor(private http: HttpClient) {
        this.checkLogin();
    }

    async checkLogin(): Promise<void> {
        const url = apiUrlBase + 'manage_data.php';
    
        await this.http
            .post(url, { action: 'check-login-customer' }, { withCredentials: true })
            .toPromise()
            .then((response: any) => {
                if (response.data != null) {
                    this.userID = response.data.id;
                    this.userType = response.data.customer_type;
                    this.isAuthenticated.next(true);
                } else {
                    this.isAuthenticated.next(false);
                    this.userType = "Retail";
                    this.userID = null;
                }
            });
    }

    login(userID: string) {
        this.userID = userID;
        this.isAuthenticated.next(true);
    }

    async logout() {
        const url = apiUrlBase + 'manage_data.php';
    
        this.isAuthenticated.next(false);
    
        const logoutResponse = await lastValueFrom(
          this.http.post<{ success: boolean; message: string }>(
            url,
            { action: 'logout' },
            { withCredentials: true }
          )
        );
        if (logoutResponse.success) {
          return true;
        }
    
        return false;
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

    getUserType() {
        return this.userType;
    }
}