import { Component } from '@angular/core';
import { FormService } from '../../services/form.service';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

@Component({
  selector: 'app-cart-popup',
  templateUrl: './cart-popup.component.html',
  styleUrls: ['./cart-popup.component.scss'],
  animations: [
    trigger('cartAnimation', [
      state('visible', style({ opacity: 1, display: 'block'})),
      state('hidden', style({ opacity: 0, display: 'none'})),
      transition('hidden => visible', animate('600ms ease', keyframes([
        style({opacity: 0, display: 'block', offset: 0}),
        style({opacity: 1, offset: 1})
      ]))),
      transition('visible => hidden', animate('600ms ease', keyframes([
        style({opacity: 1, offset: 0}),
        style({opacity: 0, display: 'none', offset: 1})
      ])))
    ]),
  ]
})
export class CartPopupComponent {
  cartVisible = 'visible';

  constructor(private formService: FormService) {}

  ngOnInit() {
    this.formService.getCartFormVisibility().subscribe((visible) => {
      this.cartVisible = visible ? 'visible' : 'hidden';
    });
  }

  toggleCart() {
    let state = this.cartVisible == 'visible' ? 'hidden' : 'visible';
    if (state == 'visible') {
      this.formService.showCartForm();
    }
  }
}
