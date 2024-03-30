import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

export const apiUrlBase = "http://localhost/API/";
@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}
  uploadURL = `http://localhost/uploads/`;
  

  collectData(query: string, filter?: string): Observable<any[]> {
    let url = `http://localhost/API/retail_query_handler.php?query=${query}`;
    if (filter != null) {
      url += `&filter=${encodeURIComponent(filter)}`;
    }
    return this.http.get<any[]>(url);
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

  getUploadURL() {
    return this.uploadURL;
  }
}