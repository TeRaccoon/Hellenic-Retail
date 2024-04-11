import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticated = new BehaviorSubject<boolean>(false);
    private email = new BehaviorSubject<number | null>(null);

    constructor() {}

    login(email: number) {
        this.email.next(email);
        this.isAuthenticated.next(true);
    }

    logout() {
        this.isAuthenticated.next(false);
    }

    isLoggedIn(): Observable<boolean> {
        return this.isAuthenticated.asObservable();
    }

    getUserID(): Observable<number | null> {
        return this.email.asObservable();
    }
}