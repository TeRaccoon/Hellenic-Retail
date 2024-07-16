import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private isLoginVisible = new BehaviorSubject<boolean>(false);
  private isCartVisible = new BehaviorSubject<boolean>(false);
  private isPopupVisible = new BehaviorSubject<boolean>(false);
  private popupTime = 2500;
  private isImageViewerVisible = new BehaviorSubject<boolean>(false);
  private popupMessage = "";
  private bannerMessage = new BehaviorSubject<string>("");
  private imageViewerUrl = "";
  private orderDetails = {};

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

  setPopupMessage(popupMessage: string, show = false, popupTime = 2500) {
    this.popupTime = popupTime;
    this.popupMessage = popupMessage;
    show && this.showPopup();
  }

  getPopupMessage() {
    return this.popupMessage;
  }

  getPopupTime() {
    return this.popupTime;
  }

  setBannerMessage(message: string) {
    this.bannerMessage.next(message);
  }

  getBannerMessage(): Observable<string>  {
    return this.bannerMessage.asObservable();
  }

  showImageViewer() {
    this.isImageViewerVisible.next(true);
  }

  hideImageViewer() {
    this.isImageViewerVisible.next(false);
  }

  getImageViewerVisibility(): Observable<boolean> {
    return this.isImageViewerVisible.asObservable();
  }

  setImageViewerUrl(url: string) {
    this.imageViewerUrl = url;
  }

  getImageViewerUrl() {
    return this.imageViewerUrl;
  }

  setOrderDetails(orderDetails: any) {
    this.orderDetails = orderDetails;
  }

  getOrderDetails() {
    return this.orderDetails;
  }
}