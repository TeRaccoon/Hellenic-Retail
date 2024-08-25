import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from './cart.service';
import { FormService } from './form.service';

@Injectable({
    providedIn: 'root'
})
export class CartGuard {

    constructor(private cartService: CartService, private router: Router, private formService: FormService) { }

    async canActivate(): Promise<boolean> {
        if ((await this.cartService.getCart()).length == 0) {
            this.formService.setPopupMessage('Your cart is empty!', true)
            this.router.navigate(['shop']);
            return false;
        }
        return true;
    }
}