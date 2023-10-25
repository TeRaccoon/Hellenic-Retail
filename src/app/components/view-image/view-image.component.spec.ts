import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewImageComponent } from './view-image.component';

describe('ViewImageComponent', () => {
  let component: ViewImageComponent;
  let fixture: ComponentFixture<ViewImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewImageComponent]
    });
    fixture = TestBed.createComponent(ViewImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
