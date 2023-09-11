import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummariserComponent } from './summariser.component';

describe('SummariserComponent', () => {
  let component: SummariserComponent;
  let fixture: ComponentFixture<SummariserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SummariserComponent]
    });
    fixture = TestBed.createComponent(SummariserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
