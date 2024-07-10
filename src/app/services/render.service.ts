import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RenderService {
  constructor() {}

  getScreenSize(): Observable<{ width: number, height: number }> {
    return fromEvent(window, 'resize').pipe(
      debounceTime(200),
      startWith(this.getCurrentSize()),
      map(() => this.getCurrentSize())
    );
  }

  private getCurrentSize(): { width: number, height: number } {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
}
