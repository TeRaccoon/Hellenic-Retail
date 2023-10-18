import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCardSectionAComponent } from './home-card-section-a.component';

describe('HomeCardSectionAComponent', () => {
  let component: HomeCardSectionAComponent;
  let fixture: ComponentFixture<HomeCardSectionAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeCardSectionAComponent]
    });
    fixture = TestBed.createComponent(HomeCardSectionAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
