import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentViewerComponent } from './document-viewer.component';

describe('DocumentViewerComponent', () => {
  let component: DocumentViewerComponent;
  let fixture: ComponentFixture<DocumentViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentViewerComponent]
    });
    fixture = TestBed.createComponent(DocumentViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
