import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, lastValueFrom, map, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

const HOST_NAME = 'http://localhost/';
const API_EXTENSION = 'API/';
const UPLOAD_EXTENSION = 'uploads/';
const DATA_PATH = API_EXTENSION + 'manage_data.php'
const MAIL_PATH = API_EXTENSION + 'mail.php';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  shopFilter = new BehaviorSubject<string | null>(null);

  visibleCategoryNames: any[] = [];
  visibleCategoryLocations: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {
    this.loadStandardData();
  }  

  collectData(query: string, filter?: string): Observable<any> {
    let url = HOST_NAME + API_EXTENSION + `retail_query_handler.php?query=${query}`;
    if (filter != null) {
      url += `&filter=${encodeURIComponent(filter)}`;
    }
    return this.http.get(url);
  }

  async processPost(body: Record<string, any>): Promise<any> {
    const url = 'http://localhost/API/retail_query_handler.php';
    return await lastValueFrom(this.http.post(url, {body}));
  }

async collectDataComplex(query: string, filter: Record<string, any> = {}): Promise<any> {
  await this.authService.checkLogin();
  let userType = this.authService.getUserType();

  const url = new URL(HOST_NAME + API_EXTENSION + 'retail_query_handler.php');
  url.searchParams.append('query', query);

  const queryParams = { ...filter, queryType: userType };
  for (const [key, value] of Object.entries(queryParams)) {
    url.searchParams.append(key, value ?? '');
  }

  try {
    return await lastValueFrom(this.http.get<any>(url.toString()));
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}


  submitFormDataQuery(query:string, data: any) {
    const url = 'http://localhost/API/retail_query_handler.php';
    return this.http.post(url, { query, data });
  }

  submitFormData(data: any): Observable<any> {
    const url = HOST_NAME + API_EXTENSION + 'manage_data.php';
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
    const url = HOST_NAME + API_EXTENSION + 'payment.php';
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

  setShopFilter(filter: any) {
    this.shopFilter.next(filter);
  }

  getShopFilter() {
    return this.shopFilter.asObservable();
  }
  
  async loadStandardData() {
    await this.loadVisibleCategories();
  }

  async loadVisibleCategories() {
    let categories = await lastValueFrom(this.collectData("visible-categories"));
    for (const category of categories) {
      this.visibleCategoryNames.push(category.name);
      this.visibleCategoryLocations.push(category.location);
    }
  }

  getVisibleCategoryNames() {
    return this.visibleCategoryNames;
  }

  getVisibleCategoryLocations() {
    return this.visibleCategoryLocations;
  }
}