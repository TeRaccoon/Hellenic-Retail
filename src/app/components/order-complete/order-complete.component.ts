import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  styleUrls: ['./order-complete.component.scss']
})
export class OrderCompleteComponent {
  orderDetails: any = {};

  constructor(private formService: FormService, private router: Router) {}

  ngOnInit() {
    this.orderDetails = this.formService.getOrderDetails();
    if (this.orderDetails == null) {
      this.router.navigate(['/']);
    }
  }
}
