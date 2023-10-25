import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRelatedComponent } from './view-related.component';

describe('ViewRelatedComponent', () => {
  let component: ViewRelatedComponent;
  let fixture: ComponentFixture<ViewRelatedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewRelatedComponent]
    });
    fixture = TestBed.createComponent(ViewRelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
