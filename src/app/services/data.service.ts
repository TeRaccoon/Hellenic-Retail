import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';

export const apiUrlBase = "http://localhost/API/";
@Injectable({
  providedIn: 'root',
})
export class DataService {
  shopFilter = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}
  uploadURL = `http://localhost/uploads/`;
  

  collectData(query: string, filter?: string): Observable<any[]> {
    let url = `http://localhost/API/retail_query_handler.php?query=${query}`;
    if (filter != null) {
      url += `&filter=${encodeURIComponent(filter)}`;
    }
    return this.http.get<any[]>(url);
  }

  collectDataComplex(query: string, filter?: Record<string, any>): Observable<any> {
    let url = apiUrlBase + `retail_query_handler.php?query=${query}`;
    if (filter != null) {
      const queryParams = Object.entries(filter).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
      url += `&${queryParams}`;
    }
    return this.http.get<any>(url);
  }

  submitFormDataQuery(query:string, data: any) {
    const url = 'http://localhost/API/retail_query_handler.php';
    return this.http.post(url, { query, data });
  }

  submitFormData(data: any): Observable<any> {
    const url = apiUrlBase + 'manage_data.php';
    return this.http.post(url, data, {withCredentials: true}).pipe(
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

  processTransaction(data: any) {
    const url = apiUrlBase + 'payment.php';
    return this.http.post(url, data, {withCredentials: true}).pipe(
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

  getUploadURL() {
    return this.uploadURL;
  }

  setShopFilter(filter: any) {
    this.shopFilter.next(filter);
  }

  getShopFilter() {
    return this.shopFilter.asObservable();
  }
}