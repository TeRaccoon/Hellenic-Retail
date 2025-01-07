import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  lastValueFrom,
  map,
  throwError,
} from 'rxjs';
import { AuthService } from './auth.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  shopFilter = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private urlService: UrlService
  ) {}

  async processPost(
    body: Record<string, any>,
    makeArray = false
  ): Promise<any> {
    const url = this.urlService.getUrl('retail');
    let response = await lastValueFrom(this.http.post(url, { body }));

    if (makeArray) response = Array.isArray(response) ? response : [response];

    return response;
  }

  async processGet(
    query: string,
    filter: Record<string, any> = {},
    makeArray = false,
    checkLogin = false
  ): Promise<any> {
    checkLogin && (await this.authService.checkLogin());
    let userType = this.authService.getCustomerType();

    const url = new URL(this.urlService.getUrl('retail'));
    url.searchParams.append('query', query);

    const queryParams = { ...filter, queryType: userType };
    for (const [key, value] of Object.entries(queryParams)) {
      url.searchParams.append(key, value ?? '');
    }

    let response = await lastValueFrom(this.http.get(url.toString()));

    if (makeArray) response = Array.isArray(response) ? response : [response];

    return response;
  }

  async submitFormDataQuery(query: string, data: any) {
    const url = this.urlService.getUrl('retail');
    return await lastValueFrom(this.http.post(url, { query, data }));
  }

  submitFormData(data: any): Observable<any> {
    const url = this.urlService.getUrl('data');
    return this.http.post(url, data, { withCredentials: true }).pipe(
      map((response: any) => {
        if (response) {
          return response;
        } else {
          throw new Error('Unexpected response format');
        }
      }),
      catchError((error: any) => {
        console.error('HTTP error occurred:', error);
        return throwError(error);
      })
    );
  }

  async processTransaction(data: any) {
    const url = this.urlService.getUrl('payment');
    return await lastValueFrom(
      this.http.post(url, data, { withCredentials: true })
    );
  }

  setShopFilter(filter: any) {
    this.shopFilter.next(filter);
  }

  getShopFilter() {
    return this.shopFilter.asObservable();
  }
}
