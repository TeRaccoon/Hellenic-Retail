import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private isLoginVisible = new BehaviorSubject<boolean>(false);
  private isCartVisible = new BehaviorSubject<boolean>(false);
  private isPopupVisible = new BehaviorSubject<boolean>(false);
  private popupMessage = "";
  private bannerMessage = new BehaviorSubject<string>("");

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

  showPopup() {
    this.isPopupVisible.next(true);
  }

  hidePopup() {
    this.isPopupVisible.next(false);
  }

  getPopupVisibility(): Observable<boolean> {
    return this.isPopupVisible.asObservable();
  }

  setPopupMessage(popupMessage: string) {
    this.popupMessage = popupMessage;
  }

  getPopupMessage() {
    return this.popupMessage;
  }

  setBannerMessage(message: string) {
    this.bannerMessage.next(message);
  }

  getBannerMessage(): Observable<string>  {
    return this.bannerMessage.asObservable();
  }
}