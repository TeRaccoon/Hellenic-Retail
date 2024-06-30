import { Component } from '@angular/core';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  styleUrls: ['./order-complete.component.scss']
})
export class OrderCompleteComponent {
  orderDetails: any = {};

  constructor(private formService: FormService) {}

  ngOnInit() {
    this.orderDetails = this.formService.getOrderDetails();
  }
}
