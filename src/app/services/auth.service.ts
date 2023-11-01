import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticated = new BehaviorSubject<boolean>(false);
    private userID = new BehaviorSubject<number | null>(null);

    constructor() {}

    login(userID: number) {
        this.isAuthenticated.next(true);
        this.userID.next(userID);
    }

    logout() {
        this.isAuthenticated.next(false);
    }

    isLoggedIn(): Observable<boolean> {
        return this.isAuthenticated.asObservable();
    }

    getUserID(): Observable<number | null> {
        return this.userID.asObservable();
    }
}