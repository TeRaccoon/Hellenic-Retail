import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private isLoginVisible = new BehaviorSubject<boolean>(false);
  private isCartVisible = new BehaviorSubject<boolean>(false);

  constructor() {}

  showLoginForm() {
    this.isLoginVisible.next(true);
  }

  hideLoginForm() {
    this.isLoginVisible.next(false);
  }

  getLoginFormVisibility(): Observable<boolean> {
    return this.isLoginVisible.asObservable();
  }

  showCartForm() {
    this.isCartVisible.next(true);
  }
  hideCartForm() {
    this.isCartVisible.next(false);
  }
  getCartFormVisibility(): Observable<boolean> {
    return this.isCartVisible.asObservable();
  }
}