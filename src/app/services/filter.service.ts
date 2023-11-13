import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FilterService {
    private maxPrice: (number | null) = null;
    private minPrice: (number | null) = null;

    getMaxPrice() {
        return this.maxPrice;
    }
    getMinPrice() {
        return this.minPrice;
    }
    setMaxPrice(maxPrice: number) {
        this.maxPrice = maxPrice;
    }
    setMinPrice(minPrice: number) {
        this.minPrice = minPrice;
    }
}