import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from '../../services/form.service';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  changeAccountDetails: FormGroup;
  loggedIn: boolean | null = null;
  userData: any = null;
  orderHistory: any[] = [];
  edit = false;

  constructor(private router: Router, private dataService: DataService, private formService: FormService, private authService: AuthService, private fb: FormBuilder) {
    this.changeAccountDetails = this.fb.group({
      forename: [{ value: '', disabled: true }, [Validators.required]],
      surname: [{ value: '', disabled: true }, [Validators.required]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      primaryPhone: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(7), Validators.maxLength(14)]],
      secondaryPhone: [{ value: '', disabled: true }]      
    });
  }

  ngOnInit() {
    this.checkLogin();
  }

  async checkLogin() {
    let id = this.authService.getUserID();
    this.loggedIn = true;
    this.loadAccountDetails(id);
    this.loadOrderHistory(id); 
  }

  async loadAccountDetails(id: string | null) {

    if (id != null) {
      this.dataService.collectData('user-details-from-id', id).subscribe((userData: any) => {
        this.userData = userData;
        this.changeAccountDetails.patchValue({
          forename: this.userData.forename,
          surname: this.userData.surname,
          email: this.userData.email,
          primaryPhone: this.userData.phone_number_primary,
          secondaryPhone: this.userData.phone_number_secondary
        });
      });
    }
  }

  async loadOrderHistory(id: string | null) {
    if (id != null) {
      this.orderHistory = await lastValueFrom(this.dataService.collectData('order-history', id));      
    }
  }

  toggleEdit() {
    this.edit = !this.edit;
    Object.keys(this.changeAccountDetails.controls).forEach(controlName => {
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
    let id = this.authService.getUserID();

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
}
