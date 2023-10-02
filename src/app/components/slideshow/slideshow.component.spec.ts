import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideshowComponent } from './slideshow.component';

describe('SlideshowComponent', () => {
  let component: SlideshowComponent;
  let fixture: ComponentFixture<SlideshowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlideshowComponent]
    });
    fixture = TestBed.createComponent(SlideshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
