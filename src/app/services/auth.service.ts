import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UrlService } from './url.service';
import { CustomerType } from '../common/types/account';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedObservable = new BehaviorSubject<boolean>(false);
  private isAuthenticated = false;
  private customerID: string | null = null;
  private customerType: CustomerType | null = null;

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
      this.customerID = response.data.id;
      this.customerType = response.data.customer_type;
      this.isAuthenticatedObservable.next(true);
    } else {
      this.isAuthenticated = false;
      this.isAuthenticatedObservable.next(false);
      this.customerType = CustomerType.Retail;
      this.customerID = null;
    }
    return this.isAuthenticated;
  }

  login(userID: string) {
    this.customerID = userID;
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

  getCustomerID() {
    return this.customerID;
  }

  getCustomerType(): CustomerType {
    return this.customerType ?? CustomerType.Retail;
  }
}
