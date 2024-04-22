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

    constructor(private http: HttpClient, private dataService: DataService) {
        this.checkLogin();
    }

    checkLogin() {
        const url = apiUrlBase + 'manage_data.php';
    
        return this.http
            .post(url, { action: 'check-login-customer' }, { withCredentials: true })
            .pipe(
            map((response: any) => {
                if (response.data != null) {
                    this.userID = response.data.id;
                    this.dataService.setQueryType(response.data.customer_type);
                    this.isAuthenticated.next(true);
                }
                return response;
            })
        );
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
}