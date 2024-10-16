import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDescriptionComponent } from './view-description.component';

describe('ViewDescriptionComponent', () => {
  let component: ViewDescriptionComponent;
  let fixture: ComponentFixture<ViewDescriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewDescriptionComponent]
    });
    fixture = TestBed.createComponent(ViewDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
