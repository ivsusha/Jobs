import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondsComponent } from './seconds.component';

describe('SecondsComponent', () => {
  let component: SecondsComponent;
  let fixture: ComponentFixture<SecondsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
