import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedObservable = new BehaviorSubject<boolean>(false);
  private isAuthenticated = false;
  private userID: string | null = null;
  private userType: string | null = null;

  url: string = '';

  constructor(private http: HttpClient, private urlService: UrlService) {}

  async checkLogin(): Promise<boolean> {
    await this.urlService.loadConfig();
    this.url = this.urlService.getUrl('data');

    const response = await lastValueFrom<any>(
      this.http.post(
        this.url,
        { action: 'check-login-customer' },
        { withCredentials: true }
      )
    );

    if (response.data != null) {
      this.isAuthenticated = true;
      this.userID = response.data.id;
      this.userType = response.data.customer_type;
      this.isAuthenticatedObservable.next(true);
    } else {
      this.isAuthenticated = false;
      this.isAuthenticatedObservable.next(false);
      this.userType = 'Retail';
      this.userID = null;
    }
    return this.isAuthenticated;
  }

  login(userID: string) {
    this.userID = userID;
    this.isAuthenticatedObservable.next(true);
    this.isAuthenticated = true;
  }

  async logout() {
    const url = this.url;

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
      window.location.reload();
      return true;
    }

    return false;
  }

  isLoggedInObservable(): Observable<boolean> {
    return this.isAuthenticatedObservable.asObservable();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  waitForLoginCheck(): Promise<boolean> {
    return lastValueFrom(
      this.isAuthenticatedObservable.asObservable().pipe(take(1))
    );
  }

  getUserID() {
    return this.userID;
  }

  getUserType() {
    return this.userType;
  }
}
