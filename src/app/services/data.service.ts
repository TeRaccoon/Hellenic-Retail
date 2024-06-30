import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, lastValueFrom, map, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { NavigationStart, Router } from '@angular/router';

export const apiUrlBase = "http://localhost/API/";
@Injectable({
  providedIn: 'root',
})
export class DataService {
  shopFilter = new BehaviorSubject<string | null>(null);

  visibleCategoryNames: any[] = [];
  visibleCategoryLocations: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationStart) {
    //     // this.authService.checkLogin();
    //   }
    // });
    this.loadStandardData();
  }

  uploadURL = `http://localhost/uploads/`;
  

  collectData(query: string, filter?: string): Observable<any[]> {
    let url = apiUrlBase + `retail_query_handler.php?query=${query}`;
    if (filter != null) {
      url += `&filter=${encodeURIComponent(filter)}`;
    }
    return this.http.get<any[]>(url);
  }

  collectDataComplex(query: string, filter?: Record<string, any>): Observable<any> {
    let url = apiUrlBase + `retail_query_handler.php?query=${query}`;
    let userType = this.authService.getUserType();
    let paramFilter = filter === undefined ? {} : filter;

    if (userType == null) {
      this.authService.checkLogin();
    }
    
    paramFilter['queryType'] = this.authService.getUserType();
    const queryParams = Object.entries(paramFilter).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    url += `&${queryParams}`;
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

  sendEmail(data: any) {
    const url = apiUrlBase + 'mail.php';
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

  generateOrderConfirmationEmail(emailData: any) {
    let email = `
    <html>
    <head>
        <title>Order ${emailData.reference}</title>
        <meta charset="UTF-8">
        <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 80%;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #007bff;
            text-align: center;
            margin-bottom: 20px;
        }
        p {
            margin: 10px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #007bff;
            color: #fff;
        }
        .total-row {
            font-weight: bold;
        }
        .total-row td {
            text-align: right;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #555;
        }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Order Confirmation: ${emailData.reference}</h1>
            <p>Dear Customer,</p>
            <p>Thank you for your order! Your order has been received and is now being processed. Your order details are as follows:</p>
            <table>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>`;

    for (let product of emailData.products) {
        email += `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.quantity}</td>
                    <td style='text-align: right;'>${product.price}</td>
                </tr>`;
    }

    email += `
                <tr class="total-row">
                    <td colspan="2">Net Total</td>
                    <td>${emailData.net_total}</td>
                </tr>
                <tr class="total-row">
                    <td colspan="2">VAT</td>
                    <td>${emailData.vat}</td>
                </tr>
                <tr class="total-row">
                    <td colspan="2">Total</td>
                    <td>${emailData.total}</td>
                </tr>
            </table>
            <p>We will send you another email when your order is on its way.</p>
            <p>Thank you for choosing our service!</p>
            <div class="footer">
                <p>Best regards,</p>
                <p>Hellenic Grocery</p>
            </div>
        </div>
    </body>
    </html>`;

    return email;
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