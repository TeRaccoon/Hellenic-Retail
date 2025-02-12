import { Injectable } from '@angular/core';
import { CheckoutSummary } from '../common/types/checkout';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private checkoutSummarySubject: BehaviorSubject<CheckoutSummary>;

  constructor(private dataService: DataService) {
    const initialSummary: CheckoutSummary = {
      subtotal: 0,
      delivery: 0,
      vat: 0,
      total: 0,
      discount: null,
    };

    this.checkoutSummarySubject = new BehaviorSubject<CheckoutSummary>(
      initialSummary
    );
  }

  public setCheckoutSummary(checkoutSummary: CheckoutSummary): void {
    this.checkoutSummarySubject.next(checkoutSummary);
  }

  public updateCheckoutSummary(partialSummary: Partial<CheckoutSummary>): void {
    const currentSummary = this.checkoutSummarySubject.value;
    const updatedSummary = {
      ...currentSummary,
      ...partialSummary,
    };
    this.checkoutSummarySubject.next(updatedSummary);
  }

  public getCheckoutSummary(): CheckoutSummary {
    return this.checkoutSummarySubject.value;
  }

  public getCheckoutSummaryObservable(): Observable<CheckoutSummary> {
    return this.checkoutSummarySubject.asObservable();
  }

  public async revertInvoice(invoicedItemIDs: number[], invoiceID: number) {
    for (let i = 0; i < invoicedItemIDs.length; i++) {
      await lastValueFrom(
        this.dataService.submitFormData({
          action: 'delete',
          id: invoicedItemIDs[i],
          table_name: 'invoiced_items',
        })
      );
    }

    await lastValueFrom(
      this.dataService.submitFormData({
        action: 'delete',
        id: invoiceID,
        table_name: 'invoices',
      })
    );
  }
}
