import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  async loadConfig() {
    this.config = await lastValueFrom(this.http.get(environment.configUrl));
  }

  getConfig() {
    return this.config;
  }
}
