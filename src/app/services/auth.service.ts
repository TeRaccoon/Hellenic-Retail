import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom, map } from 'rxjs';
import { apiUrlBase } from './data.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedObservable = new BehaviorSubject<boolean>(false);
  private isAuthenticated = false;
  private userID: string | null = null;
  private userType: string | null = null;

  constructor(private http: HttpClient) {
    this.checkLogin();
  }

  async checkLogin(): Promise<void> {
    const url = apiUrlBase + 'manage_data.php';

    let response = await lastValueFrom<any>(
      this.http.post(
        url,
        { action: 'check-login-customer' },
        { withCredentials: true }
      )
    );
    if (response.data != null) {
      this.userID = response.data.id;
      this.userType = response.data.customer_type;
      this.isAuthenticatedObservable.next(true);
      this.isAuthenticated = true;
    } else {
      this.isAuthenticatedObservable.next(false);
      this.isAuthenticated = false;
      this.userType = 'Retail';
      this.userID = null;
    }
  }

  login(userID: string) {
    this.userID = userID;
    this.isAuthenticatedObservable.next(true);
    this.isAuthenticated = true;
  }

  async logout() {
    const url = apiUrlBase + 'manage_data.php';

    this.isAuthenticatedObservable.next(false);
    this.isAuthenticated = false;

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
    return this.isAuthenticatedObservable.asObservable();
  }

  isLoggedIn() {
    return this.isAuthenticated;
  }

  getUserID() {
    return this.userID;
  }

  getUserType() {
    return this.userType;
  }
}
