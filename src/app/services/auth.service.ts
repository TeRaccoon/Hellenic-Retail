import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticated = new BehaviorSubject<boolean>(false);
    private email: string | null = null

    constructor() {}

    login(email: string) {
        this.email = email;
        this.isAuthenticated.next(true);
    }

    logout() {
        this.isAuthenticated.next(false);
    }

    isLoggedInObservable(): Observable<boolean> {
        return this.isAuthenticated.asObservable();
    }

    isLoggedIn() {
        return this.isAuthenticated.getValue();
    }

    getUserEmail() {
        return this.email
    }
}