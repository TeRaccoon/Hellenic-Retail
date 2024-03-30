import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from '../../services/form.service';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    this.authService.isLoggedIn().subscribe((data) => {
      this.loggedIn = data;
      if (!data) {
        this.formService.showLoginForm();
      }
    });
    this.loadAccountDetails();
  }
  async loadAccountDetails() {
    this.authService.getUserID().subscribe((data) => {
      const userID = data;
      if (userID != null) {
        this.dataService.collectData('user-details', userID.toString()).subscribe((userData: any) => {
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
    });
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
    this.authService.getUserID().subscribe((data) => {
      const userID = data;
      if (userID != null) {
        let formData = this.changeAccountDetails.value;
        formData['userID'] = userID;
        console.log(formData);
        this.dataService.submitFormDataQuery('change-account-details', formData).subscribe((data: any) => {
          
        });
      }
    });
  }
}
