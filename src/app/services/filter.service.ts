import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FilterService {
    private maxPrice: (number | null) = null;
    private minPrice: (number | null) = null;
    private filterUpdated = new BehaviorSubject<boolean>(false);
    private shopPriceFilters = [
        { price: '£0.01-£5.00', maxPrice: 5, minPrice: 0.01 },
        { price: '£5.00-£10.00', maxPrice: 10, minPrice: 5 },
        { price: '£10.00-£15.00', maxPrice: 15, minPrice: 10 },
        { price: '£15.00+', maxPrice: 999, minPrice: 15 }
    ];    

    getShopPriceFilter() {
        return this.shopPriceFilters;
    }

    getMaxPrice() {
        return this.maxPrice;
    }
    getMinPrice() {
        return this.minPrice;
    }
    setMaxPrice(maxPrice: number | null) {
        this.maxPrice = maxPrice;
    }
    setMinPrice(minPrice: number | null) {
        this.minPrice = minPrice;
    }

    getFilterUpdated() {
        return this.filterUpdated.asObservable();
    }
    filterUpdateRequested() {
        this.filterUpdated.next(true);
    }
    filterUpdateReceived() {
        this.filterUpdated.next(false);
    }
}