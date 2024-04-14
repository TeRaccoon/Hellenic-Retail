import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from '../../services/form.service';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  changeAccountDetails: FormGroup;
  loggedIn: boolean | null = null;
  userData: any = null;
  edit = false;

  constructor(private dataService: DataService, private formService: FormService, private authService: AuthService, private fb: FormBuilder) {
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
    this.authService.isLoggedInObservable().subscribe(loggedIn => {
      this.loggedIn = loggedIn;
      if (!loggedIn) {
        this.formService.showLoginForm();
      } else {
        this.loadAccountDetails();
      }
    });    
  }

  async loadAccountDetails() {
    let email = this.authService.getUserEmail();

    if (email != null) {
      this.dataService.collectData('user-details-from-email', email.toString()).subscribe((userData: any) => {
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
    let email = this.authService.getUserEmail();

    if (email != null) {
      let formData = this.changeAccountDetails.value;
      formData['email'] = email;
      this.dataService.submitFormDataQuery('change-account-details', formData);
    }
  }
}
