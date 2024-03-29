import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  submitFormData(query:string, userData: any) {
    const url = 'http://localhost/API/retail_query_handler.php';
    return this.http.post(url, { query, userData });
  }

  getUploadURL() {
    return this.uploadURL;
  }
}