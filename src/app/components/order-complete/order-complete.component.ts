import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConstManager, settingKeys } from 'src/app/common/const/const-manager';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  styleUrls: ['./order-complete.component.scss'],
})
export class OrderCompleteComponent {
  orderDetails: any = {};
  supportEmail = '';

  constructor(
    private formService: FormService,
    private router: Router,
    private consts: ConstManager
  ) {
    this.supportEmail = this.consts.getConstant(settingKeys.support_email);
  }

  ngOnInit() {
    this.orderDetails = this.formService.getOrderDetails();
    if (this.orderDetails == null) {
      this.router.navigate(['/']);
    }
  }
}
