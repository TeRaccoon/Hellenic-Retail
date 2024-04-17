import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FilterService {
    private maxPrice: (number | null) = null;
    private minPrice: (number | null) = null;
    private filterUpdated = new BehaviorSubject<boolean>(false);

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