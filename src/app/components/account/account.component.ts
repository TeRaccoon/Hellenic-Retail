import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from '../../services/form.service';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import {
  faPencil,
  faTrashCan,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { Order } from 'src/app/common/types/account';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  pencil = faPencil;
  bin = faTrashCan;
  tick = faCheck;

  changeAccountDetails: FormGroup;
  addAddressForm: FormGroup;

  loggedIn: boolean | null = null;
  userId: string | null = null;
  userData: any = null;
  orderHistory: Order[] = [];
  addressBook: any[] = [];
  edit = false;

  pendingDeleteId: string | null = null;
  showAddNew = false;

  constructor(
    private router: Router,
    private dataService: DataService,
    private formService: FormService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.changeAccountDetails = this.fb.group({
      forename: [{ value: '', disabled: true }, [Validators.required]],
      surname: [{ value: '', disabled: true }, [Validators.required]],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      primaryPhone: [
        { value: '', disabled: true },
        [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(14),
        ],
      ],
      secondaryPhone: [{ value: '', disabled: true }],
    });

    this.addAddressForm = this.fb.group({
      customer_id: [''],
      delivery_address_one: ['', Validators.required],
      delivery_address_two: [''],
      delivery_address_three: [''],
      delivery_postcode: ['', Validators.required],
      action: ['add'],
      table_name: ['customer_address'],
    });
  }

  ngOnInit() {
    this.checkLogin();
  }

  async checkLogin() {
    this.userId = this.authService.getCustomerID();
    if (this.userId != null) {
      this.loggedIn = true;
      this.loadAccountDetails();
      this.loadOrderHistory();
      this.loadAddressBook();
    }
  }

  async loadAccountDetails() {
    let userData = await this.dataService.processPost({
      action: 'account-details',
      customer_id: this.userId?.toString(),
    });

    this.userData = userData;
    this.changeAccountDetails.patchValue({
      forename: this.userData.forename,
      surname: this.userData.surname,
      email: this.userData.email,
      primaryPhone: this.userData.phone_number_primary,
      secondaryPhone: this.userData.phone_number_secondary,
    });
  }

  async loadAddressBook() {
    this.addressBook = await this.dataService.processPost(
      { action: 'address-book', customer_id: this.userId?.toString() },
      true
    );
  }

  async loadOrderHistory() {
    this.orderHistory = await this.dataService.processPost(
      { action: 'order-history', customer_id: this.userId?.toString() },
      true
    );
  }

  toggleEdit() {
    this.edit = !this.edit;
    Object.keys(this.changeAccountDetails.controls).forEach((controlName) => {
      let control = this.changeAccountDetails.get(controlName);
      if (control) {
        control.disabled ? control.enable() : control.disable();
      }
    });
  }

  cancelEdit() {
    this.edit = false;
  }

  submitChanges() {
    let id = this.authService.getCustomerID();

    if (id != null) {
      let formData = this.changeAccountDetails.value;
      formData['id'] = id;
      this.dataService.submitFormDataQuery('change-account-details', formData);
    }
  }

  async logout() {
    await this.router.navigate(['/home']);
    this.authService.logout();
  }

  setDeleteId(id: string) {
    this.pendingDeleteId = id;
  }

  async removeAddress() {
    let response = await lastValueFrom(
      this.dataService.submitFormData({
        action: 'delete',
        id: this.pendingDeleteId,
        table_name: 'customer_address',
      })
    );
    if (!response.success) {
      this.formService.setPopupMessage(
        'There was an error deleting this address!',
        true
      );
    } else {
      this.formService.setPopupMessage('Address deleted successfully', true);
      this.loadAddressBook();
    }
  }

  toggleAddNew() {
    this.showAddNew = !this.showAddNew;
  }

  async addAddress() {
    this.addAddressForm.patchValue({ customer_id: this.userId });

    let response = await lastValueFrom(
      this.dataService.submitFormData(this.addAddressForm.value)
    );
    if (!response.success) {
      this.formService.setPopupMessage(
        'There was an error adding this address!',
        true
      );
      this.pendingDeleteId = null;
    } else {
      this.formService.setPopupMessage('Address added successfully', true);
      this.addAddressForm.reset();
      this.showAddNew = false;
      this.loadAddressBook();
    }
  }

  cancelAddAddress() {
    this.addAddressForm.reset();
    this.showAddNew = false;
  }
}
