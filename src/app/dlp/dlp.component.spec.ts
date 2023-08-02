import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlpComponent } from './dlp.component';

describe('DlpComponent', () => {
  let component: DlpComponent;
  let fixture: ComponentFixture<DlpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DlpComponent]
    });
    fixture = TestBed.createComponent(DlpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
