import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, lastValueFrom, map } from 'rxjs';
import { FormService } from './form.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router, private formService: FormService) {
    this.checkLoginAndRedirect();
  }

  private checkLoginAndRedirect(): void {
    this.authService.isLoggedInObservable().subscribe((loggedIn: boolean) => {
      if (!loggedIn) {
        this.router.navigate([this.router.url]);
        this.formService.showLoginForm();
      }
    });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isLoggedIn();
  }
}